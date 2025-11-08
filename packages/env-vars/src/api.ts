import { z } from 'zod';

export const apiEnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    NODE_SERVER_PORT: z.coerce.number().default(5000),
    ACCESS_KEY: z.hash("sha512"),
    REFRESH_KEY: z.hash("sha512"),
    /*
        Eventually this should be a z.enum also that includes the actual domain name (https://www.kanpeki.com or whatever).
        Not sure if there would be a good way to sync the Vite port with this schema, but manually changing them
        around would take like 10 seconds max. So I dunno...
    */
    CLIENT_ORIGIN: z.literal("http://localhost:5173"),

    /*
        z.url() is good enough for verifying this variable contains a valid URI/URL, but
        a stricter measure would be to either pass it thru a regex or { parseUri } from mongodb-uri.
     */
    MONGO_URI: z.url(),

});

export type apiEnvVar = z.infer<typeof apiEnvSchema>;