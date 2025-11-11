import { apiEnvSchema } from '@kanpeki/env-vars';

const parseProcessEnv = apiEnvSchema.safeParse(process.env);

if (!parseProcessEnv.success) {
    console.log("The .env variables for /api are invalid:");
    console.log(parseProcessEnv.error.issues);
    throw new Error(parseProcessEnv.error.message);
}

export const env = parseProcessEnv.data;