import * as cartServices from "../services/cartServices.js";
import * as userServices from "../services/userServices.js";

export const addToCart = async (req, res) => {

    try {
        if(!req.user)
        {
            return res.json({success:false, redirect: "/login"});
        }

        let userData = await userServices.findUserByIdWithoutPassword(req.user.id);
        if(!userData)
        {
            return res.json({success: true, error: "User is not Active"});
        }

        const userId = req.user.id;
        const itemId = req.body.itemId;        

        const existingProducts = await cartServices.findCartItembyProductIdAndUserId(userId, itemId);

        if(!existingProducts)
        {
            await cartServices.addNewCartItem(userId, itemId);
            res.json({success:true, message:"Product Added to Cart"})
        }
        else
        {
            const currQuantity = existingProducts.quantity;
            await cartServices.increaseCartItem(userId, itemId, currQuantity);
            res.json({success:true})
        }

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const DecreaseFromCart = async (req, res) => {

    try {
        if(!req.user)
        {
            return res.json({success:false, redirect: "/login"});
        }

        let userData = await userServices.findUserByIdWithoutPassword(req.user.id);
        if(!userData)
        {
            return res.json({success: true, error: "User is not Active"});
        }

        const userId = req.user.id;
        const itemId = req.body.itemId;

        const existingProducts = await cartServices.findCartItembyProductIdAndUserId(userId, itemId);

        if (!existingProducts) {
            return res.json({ success: false, message: "Item not found in cart" });
        }

        const currQuantity = existingProducts.quantity;

        if (currQuantity > 1) {
            await cartServices.decreaseCartItem(userId, itemId, currQuantity);
            res.json({ success: true, message: "Product Quantity Decreased" });
        } else {
            await cartServices.removeCartItem(userId, itemId);
            res.json({ success: true, message: "Product Removed from Cart" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const removeFromCart = async (req, res) => {
        try {
        if(!req.user)
        {
            return res.json({success:false, redirect: "/login"});
        }

        let userData = await userServices.findUserByIdWithoutPassword(req.user.id);
        if(!userData)
        {
            return res.json({success: true, error: "User is not Active"});
        }

        const userId = req.user.id;
        const itemId = req.body.itemId;

        const existingProducts = await cartServices.findCartItembyProductIdAndUserId(userId, itemId);

        if (!existingProducts) {
            return res.json({ success: false, message: "Item not found in cart" });
        }

        await cartServices.removeCartItem(userId, itemId);
        res.json({ success: true, message: "Product Removed from Cart" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const getCart = async (req, res) => {
    try {
        if(!req.user)
        {
            return res.json({success:false, redirect: "/login"});
        }
        
        let userData = await userServices.findUserByIdWithoutPassword(req.user.id);
        if(!userData)
        {
            return res.json({success: true, error: "User is not Active"});
        }

        const userId = req.user.id;

        let cartData = await cartServices.getCartData(userId);
        res.json({success:true, cartData});

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}