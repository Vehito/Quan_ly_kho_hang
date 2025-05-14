import app from "./app.js";
import configs from "./config/index.js";
import MySQL from "./utils/mysql.util.js";

async function startServer() {
    try {
        await MySQL.initPool();
        const PORT = configs.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Cant connect to MySQL", error);
        process.exit();
    }
}

startServer();