import z from "zod";

export const signDataValidator = z.object({
    quote:z.string().min(1).max(250).optional().message('quote size exceeded'),
    message:z.string().min(1).max(500).optional().message("message size limit exceeded"),
    type:z.enum(['anonymous','non_anonymous']).message("type must 'anonymous','non_anonymous'OR'friends_only'")
});
