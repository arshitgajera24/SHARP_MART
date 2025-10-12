import { eq } from "drizzle-orm";
import { db } from "../config/db.js"
import { productsTable } from "../drizzle/schema.js";

export const addNewProduct = async ({name, category, description, price, original_price, ratings, image, isAvailable}) => {
    const [product] = await db.insert(productsTable).values({name, category, description, price, originalPrice: original_price, ratings, image, isAvailable}).returning({ id: productsTable.id });
    return product;
}

export const getAllProducts = async () => {
    const products = await db.select().from(productsTable);
    return products;
}

export const findProductById = async (productId) => {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));
    return product;
}

export const findProductByName = async (productName) => {
    const product = await db.select().from(productsTable).where(eq(productsTable.name, productName));
    return product;
}

export const findProductByIdAndDelete = async (productId) => {
    return await db.delete(productsTable).where(eq(productsTable.id, productId));
}

export const findProductByIdAndUpdate = async ({id, name, category, description, price, original_price, ratings, image, isAvailable}) => {
    const [product] = await db.update(productsTable).set({
        name,
        category,
        description,
        price,
        originalPrice: original_price,
        ratings,
        image,
        isAvailable
    }).where(eq(productsTable.id, id));
    return product;
}
