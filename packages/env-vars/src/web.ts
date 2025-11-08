import { z } from 'zod';

export const webEnvSchema = z.object({
    VITE_SERVER_PORT: z.coerce.number().default(5173),

    VITE_API_URL: z.literal("https://localhost:5000")
});

/*
    Add to env-config of /web

    const parseMetaEnv = webEnvSchema.safeParse(import.meta.env);

    if (!parseMetaEnv.success) {
        console.error("The .env variables for /web are invalid:");
        console.error(parseMetaEnv.error.issues);
        process.exit(1);
    }

    export const webEnv = parseMetaEnv.data;
 */


export type webEnvVar = z.infer<typeof webEnvSchema>;