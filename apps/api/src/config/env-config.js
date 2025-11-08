import { apiEnvSchema } from '@kanpeki/env-vars';

const parseProcessEnv = apiEnvSchema.safeParse(process.env);

if (!parseProcessEnv.success) {
    console.error("The .env variables for /api are invalid:");
    console.error(parseProcessEnv.error.issues);
    process.exit(1);
}

export const env = parseProcessEnv.data;