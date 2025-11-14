import { apiEnvSchema } from '@kanpeki/env-vars';

const parseProcessEnv = apiEnvSchema.safeParse(process.env);

if (!parseProcessEnv.success) {
    console.log("The .env variables for /api are invalid:");
    throw new Error(parseProcessEnv.error);
}

export const env = Object.freeze(parseProcessEnv.data);