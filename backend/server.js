import app from "./app.js";
import configs from "./config/index.js";

const PORT = configs.app.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});