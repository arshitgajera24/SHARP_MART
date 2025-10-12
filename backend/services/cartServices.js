import { and, eq } from "drizzle-orm"
import { db } from "../config/db.js"
import { cartItemsTable, productsTable } from "../drizzle/schema.js"

export const findCartItembyProductIdAndUserId = async (userId, itemId) => {
    const [cartItem] = await db.select().from(cartItemsTable).where(and(eq(cartItemsTable.itemId, itemId), eq(cartItemsTable.userId, userId)));
    return cartItem;
}

export const addNewCartItem = async (userId, itemId) => {
    return await db.insert(cartItemsTable).values({userId, itemId, quantity: 1});
}

export const increaseCartItem = async (userId, itemId, currQuantity) => {
    return await db.update(cartItemsTable).set({quantity: currQuantity + 1}).where(and(eq(cartItemsTable.itemId, itemId), eq(cartItemsTable.userId, userId)));
}

export const decreaseCartItem = async (userId, itemId, currQuantity) => {
    return await db.update(cartItemsTable).set({quantity: currQuantity - 1}).where(and(eq(cartItemsTable.itemId, itemId), eq(cartItemsTable.userId, userId)));
}

export const removeCartItem = async (userId, itemId) => {
    return await db.delete(cartItemsTable).where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.itemId, itemId)));
}

export const getCartData = async (userId) => {
    const cartItems = await db.select({
        id: cartItemsTable.id,
        quantity: cartItemsTable.quantity,
        product : {
            id: productsTable.id,
            name: productsTable.name,
            price: productsTable.price,
            image: productsTable.image,
            category: productsTable.category,
        }
    }).from(cartItemsTable).leftJoin(productsTable, eq(cartItemsTable.itemId, productsTable.id)).where(eq(cartItemsTable.userId, userId));
    return cartItems;
}