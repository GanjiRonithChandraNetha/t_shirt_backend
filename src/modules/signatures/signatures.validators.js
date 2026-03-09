import z from "zod";

export const signDataValidator = z.object({
    quote:z.string().min(1,'invalid quote').max(250,'quote size exceeded'),
    message:z.string().min(1,'invalid message').max(500,'message size limit exceeded').optional(),
    type:z.enum(['anonymous','non_anonymous'],"type must 'anonymous','non_anonymous'OR'friends_only'")
});
