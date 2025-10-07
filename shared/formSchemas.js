import { z } from "zod";

const usernameSchema = z
    .string()
    .min(3, { error: "Username must be at least 3 characters" })
    .max(20, { error: "Username must be at most 20 characters"})
    .regex(/^[a-zA-Z0-9_]+$/, { error: "Username can only contain letters, numbers, and underscores"});

const emailSchema = z.email({ error: "Invalid email address"});

const passwordSchema = z
    .string()
    .min(8, { error: "Password must be at least 8 characters"})
    .max(256, { error: "Password is too long"});

const loginIdentifierSchema = z
    .union([emailSchema, usernameSchema])
    .refine(() => true, {
        error: "Invalid username or email address",
    });

export const signupFormSchema = z.strictObject({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
});

export const loginFormSchema = z.strictObject({
    identifier: loginIdentifierSchema,
    password: passwordSchema,
});

export const readingFormSchema = z.strictObject({
    sentences: z.number().gte(4).lte(8),
    jlpt: z.string().regex(/^N[1-5]$/),
    theme: z.string(), // to be extra strict we could do z.templateLiteral([z.enum(themes)])
});
