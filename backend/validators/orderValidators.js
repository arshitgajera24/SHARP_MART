import z from "zod";

export const nameSchema = z.string().trim().min(1, {message: "Name is Required"}).max(100, {message: "Name Must be no more than 100 Characters"})
export const emailSchema = z.string().trim().min(1, {message: "Email is Required"}).email({message: "Please Enter a Valid Email Address"}).max(100, {message: "Name Must be no more than 100 Characters"});

export const placeOrderValidatorSchema = z.object({
    firstName: z.string().trim().min(1, {message: "First Name is Required"}).max(20, {message: "First Name Must be no more than 20 Characters"}),
    lastName: z.string().trim().min(1, {message: "Last Name is Required"}).max(20, {message: "Last Name Must be no more than 20 Characters"}),
    email: emailSchema,
    street: z.string().trim().min(1, {message: "Street is Required"}).max(100, {message: "Street Must be no more than 100 Characters"}),
    city: z.string().trim().min(1, {message: "City is Required"}).max(100, {message: "City Must be no more than 100 Characters"}),
    state: z.string().trim().min(1, {message: "State is Required"}).max(100, {message: "State Must be no more than 100 Characters"}),
    zipCode: z.string().min(1, {message: "Zip Code is Required"}).max(6, {message: "Zip Code must be no more than 6 Digits"}),
    country: z.string().trim().min(1, {message: "Country is Required"}).max(100, {message: "Country Must be no more than 100 Characters"}),
    phone: z.string().min(10, {message: "Phone Number is Required"}).max(10, {message: "Phone Number must be no more than 10 Digits"}),
    status: z.string().trim().min(1, {message: "Status is Required"}).max(100, {message: "Status Must be no more than 100 Characters"}),
})
