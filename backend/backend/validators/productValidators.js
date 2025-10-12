import z from "zod";

export const nameSchema = z.string().trim().min(1, {message: "Name is Required"}).max(100, {message: "Name Must be no more than 100 Characters"})

export const addProductValidatorSchema = z.object({
    name: nameSchema,
    category: z.string().trim().min(1, {message: "Category Name is Required"}).max(50, {message: "Category Name Must be no more than 50 Characters"}),
    description: z.string().trim().min(1, {message: "Description is Required"}).max(500, {message: "Description Must be no more than 500 Characters"}),
    ratings: z.coerce.number({ invalid_type_error: "Ratings must be a number" }).min(1, { message: "Ratings must be at least 1" }).max(5, { message: "Rating must be no more than 5" }),
    price: z.coerce.number({ invalid_type_error: "Price must be a number" }).min(0.01, { message: "Price must be at least 0.01" }).max(100000, { message: "Price must be no more than 100000" }),
    original_price : z.coerce.number({ invalid_type_error: "Original Price must be a number" }).min(0.01, { message: "Original Price must be at least 0.01" }).max(100000, { message: "Price must be no more than 100000" }),
    isAvailable: z.coerce.boolean(),
})

export const editProductValidatorSchema = addProductValidatorSchema.extend({
    id: z.coerce.number().min(1, "Product ID is required"),
})