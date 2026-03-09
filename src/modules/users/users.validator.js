import z from "zod";

export const userValidator = z.object({
    name:z.string().min(6,"must be atlease 6 characters").max(20,"cannot be more than 20 charcters"),
    section_id: z.string().min(1,"invalid section_id"),
    mobile_no:z.string().regex(/^[6-9]\d{9}$/,"invalid mobile number"),
    email:z.email("invalid email"),
    size:z.enum(['XL','L','M','S']),
    password:z.string().min(7,'password should atlease have 7 characters')
    .max(20,'cant cross 20 charcters')
    .regex(/^[A-Za-z\d@#]+$/, "Only letters, numbers, @ and # allowed")
    .regex(/[a-z]/,"atleast one lowercase character")
    .regex(/[A-Z]/,"atleast one uppercase character")
    .regex(/[\d]/,'atlease one numeric charecter')
    .regex(/[@#]/,'atleast one @ or !')
})

export const registrationInputValidator = userValidator.strict();
export const loginValidator = userValidator.pick({
    email:true,
    password:true
}).strict();
export const preRegistrationDetailsValidators = userValidator.pick({
    name:true,
    section_id:true,
    mobile_no:true,
    email:true,
    size:true
}).strict();
export const forgotPasswordValidator = userValidator.pick({
    email:true
}).strict();
export const resetPasswordValidator = userValidator.pick({
    password:true
}).strict();