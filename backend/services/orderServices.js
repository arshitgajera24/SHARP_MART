import { desc, eq } from "drizzle-orm"
import { cartItemsTable, orderItemsTable, ordersTable, productsTable } from "../drizzle/schema.js"
import { db } from "../config/db.js";

export const getCartItemsByUserId = async (userId) => {
    const cartItems = await db.select({
        id: cartItemsTable.id,
        quantity: cartItemsTable.quantity,
        productId: cartItemsTable.itemId,
        price: productsTable.price,
        name: productsTable.name,
        image: productsTable.image,
    }).from(cartItemsTable).leftJoin(productsTable, eq(productsTable.id,cartItemsTable.itemId)).where(eq(cartItemsTable.userId, userId));
    return cartItems;
}

export const addNewOrder = async ({userId, amount, firstName, lastName, email, street, city, state, zipCode, country, phone, status }) => {
    const [newOrder] = await db.insert(ordersTable).values({userId, amount, firstName, lastName, email, street, city, state, zipCode, country, phone, status }).returning({ id: ordersTable.id });;
    return newOrder.id;
}

export const addNewOrderItems = async (orderItems) => {
    const [orderItem] = await db.insert(orderItemsTable).values(orderItems).returning({ id: orderItemsTable.id });;
    return orderItem.id;
}

export const emptyCartDataByUserId = async (userId) => {
    return await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
}

export const findOrderByIdAndUpdatePayment = async (orderId) => {
    return await db.update(ordersTable).set({payment: true}).where(eq(ordersTable.id, orderId));
}

export const findOrderByIdAndDelete = async (orderId) => {
    const deleteOrder = await db.delete(ordersTable).where(eq(ordersTable.id, orderId));
    const deleteOrderItems = await db.delete(orderItemsTable).where(eq(orderItemsTable.orderId, orderId))
    return {deleteOrder, deleteOrderItems};
}

export const getAllOrdersItemsByUserId = async (userId) => {
    const orderItems = await db.select({
        orderId: ordersTable.id,
        amount: ordersTable.amount,
        status: ordersTable.status,
        payment: ordersTable.payment,
        createdAt: ordersTable.createdAt,

        productId: productsTable.id,
        productName: productsTable.name,
        productImage: productsTable.image,
        productPrice: productsTable.price,

        quantity: orderItemsTable.quantity,
        itemPrice: orderItemsTable.price,
    }).from(ordersTable).innerJoin(orderItemsTable, eq(orderItemsTable.orderId, ordersTable.id)).innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId)).where(eq(ordersTable.userId, userId)).orderBy(desc(ordersTable.createdAt));

    const groupedOrders = orderItems.reduce((acc, item) => {
        let order = acc.find(ord => ord.orderId === item.orderId);
        if(!order)
        {
            order = {
                orderId: item.orderId,
                amount: item.amount,
                status: item.status,
                payment: item.payment,
                createdAt: item.createdAt,
                items: []
            };
            acc.push(order);
        }

        order.items.push({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            productPrice: item.productPrice,
            quantity: item.quantity,
            itemPrice: item.itemPrice * item.quantity,
        });
        return acc;
    }, []);

    return groupedOrders;
}

export const getAllOrdersList = async () => {
    const orderItems = await db.select({
        orderId: ordersTable.id,
        amount: ordersTable.amount,
        status: ordersTable.status,
        createdAt: ordersTable.createdAt,
        paymentStatus: ordersTable.payment,

        firstName: ordersTable.firstName,
        lastName: ordersTable.lastName,
        email: ordersTable.email,
        street: ordersTable.street,
        city: ordersTable.city,
        state: ordersTable.state,
        zipCode: ordersTable.zipCode,
        country: ordersTable.country,
        phone: ordersTable.phone,

        productId: productsTable.id,
        productName: productsTable.name,
        productImage: productsTable.image,
        productPrice: productsTable.price,

        quantity: orderItemsTable.quantity,
        itemPrice: orderItemsTable.price,
    }).from(ordersTable).innerJoin(orderItemsTable, eq(orderItemsTable.orderId, ordersTable.id)).innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId)).orderBy(desc(ordersTable.createdAt));

    const groupedOrders = orderItems.reduce((acc, item) => {
        let order = acc.find(ord => ord.orderId === item.orderId);
        if(!order)
        {
            order = {
                orderId: item.orderId,
                amount: item.amount,
                status: item.status,
                createdAt: item.createdAt,
                paymentStatus: item.paymentStatus,
                address: {
                    firstName: item.firstName,
                    lastName: item.lastName,
                    email: item.email,
                    street: item.street,
                    city: item.city,
                    state: item.state,
                    zipCode: item.zipCode,
                    country: item.country,
                    phone: item.phone,
                },
                items: []
            };
            acc.push(order);
        }

        order.items.push({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            productPrice: item.productPrice,
            quantity: item.quantity,
            itemPrice: item.itemPrice * item.quantity,
        });
        return acc;
    }, []);

    return groupedOrders;
}

export const findOrderByIdAndUpdateStatus = async (orderId, status) => {
    if(status === "Delivered")
    {
        return await db.update(ordersTable).set({ payment: true, status }).where(eq(ordersTable.id, orderId));
    }
    else
    {
        return await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, orderId));
    }
}
