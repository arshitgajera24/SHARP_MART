import Stripe from "stripe"
import { placeOrderValidatorSchema } from "../validators/orderValidators.js";
import * as orderServices from "../services/orderServices.js";
import razorpay from "razorpay";
import crypto from "crypto"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_KEY_SECRET,
})

export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const {data, error} = placeOrderValidatorSchema.safeParse(req.body);

        if(error)
        {
            const errors = error.issues[0].message;
            return res.json({ success: false, error: errors });
        }

        const { firstName, lastName, email, street, city, state, zipCode, country, phone, status } = data;

        const cartItems = await orderServices.getCartItemsByUserId(userId);
        if(!cartItems || cartItems.length === 0)
        {
            return res.json({success: false, error: "Cart is Empty"});
        }

        const totalAmount = (cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0) + 100);        

        const orderId = await orderServices.addNewOrder({userId, amount: totalAmount, firstName, lastName, email, street, city, state, zipCode, country, phone, status });

        const orderItemsData = cartItems.map(item => ({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }))

        const orderItemId = await orderServices.addNewOrderItems(orderItemsData);

        const options = {
            amount: Math.round(Number(totalAmount) * 100),
            currency: "INR",
            receipt: String(orderId),
        }

        const order = await razorpayInstance.orders.create(options);

        res.json({ success: true, data: order, orderId });

        // const line_items = cartItems.map((item) => ({
        //     price_data: {
        //         currency: "inr",
        //         product_data: {
        //             name: item.name
        //         },
        //         unit_amount: item.price*100
        //     },
        //     quantity: item.quantity
        // }));

        // line_items.push({
        //     price_data: {
        //         currency: "inr",
        //         product_data: {
        //             name: "Delivery Charges"
        //         },
        //         unit_amount: 100*100
        //     },
        //     quantity: 1
        // })

        // const session = await stripe.checkout.sessions.create({
        //     line_items,
        //     mode: "payment",
        //     success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${orderId}`,
        //     cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${orderId}`,
        // })

        // res.json({ success: true, session_url: session.url, message: "Order placed successfully", orderId });

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message, orderId });
    }
}

export const placeOrderCashOnDelivery = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const {data, error} = placeOrderValidatorSchema.safeParse(req.body);

        if(error)
        {
            const errors = error.issues[0].message;
            return res.json({ success: false, error: errors });
        }

        const { firstName, lastName, email, street, city, state, zipCode, country, phone, status } = data;

        const cartItems = await orderServices.getCartItemsByUserId(userId);
        if(!cartItems || cartItems.length === 0)
        {
            return res.json({success: false, error: "Cart is Empty"});
        }

        const totalAmount = (cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0) + 100);        

        const orderId = await orderServices.addNewOrder({userId, amount: totalAmount, firstName, lastName, email, street, city, state, zipCode, country, phone, status });

        const orderItemsData = cartItems.map(item => ({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }))

        const orderItemId = await orderServices.addNewOrderItems(orderItemsData);
        await orderServices.emptyCartDataByUserId(userId);
        res.json({success: true, message: "Order Placed Successfully"});
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const verifyOrder = async (req, res) => {
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZOR_KEY_SECRET).update(sign).digest("hex");

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if(expectedSign === razorpay_signature)
        {
            await orderServices.findOrderByIdAndUpdatePayment(orderInfo.receipt);
            await orderServices.emptyCartDataByUserId(req.user.id);
            return res.json({success: true, message: "Payment Successful"})
        }
        else
        {
            const orderDelete = await orderServices.findOrderByIdAndDelete(orderInfo.receipt);
            return res.json({success: false, error: "Payment Failed"});
        }

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }

    
    // const {orderId, success} = req.body;

    // try {
    //     if(success == "true")
    //     {
    //         const paymentSucceded = await orderServices.findOrderByIdAndUpdatePayment(orderId);
    //         res.json({success: true, message: "Payment Successful"});
    //     }
    //     else
    //     {
    //         const orderDelete = await orderServices.findOrderByIdAndDelete(orderId);
    //         res.json({success: false, error: "Payment Failed"});
    //     }
    // } catch (error) {
    //     console.error(error);
    //     res.json({ success: false, error: error.message });
    // }
}

export const cancelOrder = async (req, res) => {
    try {
        const {orderId} = req.body;
        if (!orderId) return res.json({ success: false, error: "Order ID required" });

        const orderDelete = await orderServices.findOrderByIdAndDelete(orderId);
        res.json({success: true, message: "Payment Cancelled, Order not Placed"});

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const userOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderServices.getAllOrdersItemsByUserId(userId);
        res.json({success: true, data: orders});
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const listOrders = async (req, res) => {
    try {
        const orders = await orderServices.getAllOrdersList();
        res.json({success: true, data: orders});
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const {orderId, status} = req.body;
        const updated = await orderServices.findOrderByIdAndUpdateStatus(orderId, status);
        res.json({success: true, message: "Order Status Updated Successfully"});
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}