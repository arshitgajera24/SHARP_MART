import z from "zod";

export const nameSchema = z.string().trim().min(1, {message: "Full Name is Required"}).max(100, {message: "Full Name Must be no more than 100 Characters"})
export const emailSchema = z.string().trim().min(1, {message: "Email is Required"}).email({message: "Please Enter a Valid Email Address"}).max(100, {message: "Name Must be no more than 100 Characters"});

export const contactValidatorSchema = z.object({
    fullName: nameSchema,
    email: emailSchema,
    subject: z.string().trim().min(1, {message: "Subject is Required"}).max(100, {message: "Subject Must be no more than 100 Characters"}),
    message: z.string().trim().min(1, {message: "Message is Required"}).max(500, {message: "Message Must be no more than 500 Characters"})
})
