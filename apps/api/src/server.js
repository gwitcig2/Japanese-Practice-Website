import { env } from "./config/env-config.js";
import app from "./app.js";
import { connectDB } from "./config/db-connection.js";

const port = env.NODE_SERVER_PORT;

try {
    await connectDB();
    if (env.NODE_ENV === "development") {
        app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
    }
} catch (error) {
    console.log(error);
}
