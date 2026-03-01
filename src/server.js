import 'dotenv/config';
import app from "./app.js";
// dotenv.config();

console.log(process.env.PORT);

import {pool} from "./database/connection.js";

const PORT = process.env.PORT || 5000;

// Start Server Function
const startServer = async () => {
    try {
        // 1️⃣ Test DB Connection
        await pool.query("SELECT 1");
        console.log("✅ Database Connected");

        // 2️⃣ Start HTTP Server
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        // 3️⃣ Graceful Shutdown
        process.on("SIGTERM", () => {
            console.log("SIGTERM received. Shutting down...");
            server.close(() => {
                console.log("Process terminated");
                process.exit(0);
            });
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();