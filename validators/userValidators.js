import z, { email } from "zod";

export const nameSchema = z.string().trim().min(1, {message: "Name is Required"}).max(100, {message: "Name Must be no more than 100 Characters"})
export const emailSchema = z.string().trim().min(1, {message: "Email is Required"}).email({message: "Please Enter a Valid Email Address"}).max(100, {message: "Name Must be no more than 100 Characters"});
export const passwordSchema = z.string().trim().min(6, {message: "Password is Required With Atleast 6 Characters"}).max(100, {message: "Password Must be no more than 100 Characters"});

export const userLoginValidatorSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

export const userRegisterValidatorSchema = userLoginValidatorSchema.extend({
    name: nameSchema,
})

export const verifyEmailValidatorSchema = z.object({
    token: z.string().trim().length(8),
    email: z.string().trim().email(),
})

export const editProfileValidatorSchema = z.object({
    name: nameSchema,
})

export const changePasswordVallidatorSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current Password is Required" }),
    newPassword: z.string().min(6, {message: "New Password is Required With Atleast 6 Characters"}).max(100, {message: "New Password Must be no more than 100 Characters"}),
    confirmPassword: z.string().min(6, {message: "Confirm Password is Required With Atleast 6 Characters"}).max(100, {message: "Confirm Password Must be no more than 100 Characters"}),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New and Confirm Password are not Matching",
    path: ["confirmPassword"],
});

export const forgotPasswordValidatorSchema = z.object({
    email: emailSchema,
})

export const resetPasswordValidatorSchema = z.object({
    newPassword: z.string().min(6, {message: "New Password is Required With Atleast 6 Characters"}).max(100, {message: "New Password Must be no more than 100 Characters"}),
    confirmPassword: z.string().min(6, {message: "Confirm Password is Required With Atleast 6 Characters"}).max(100, {message: "Confirm Password Must be no more than 100 Characters"}),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New and Confirm Password are not Matching",
    path: ["confirmPassword"],
});

export const setPasswordValidatorSchema = resetPasswordValidatorSchema;