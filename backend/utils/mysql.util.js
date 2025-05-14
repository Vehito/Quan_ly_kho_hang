import mysql from "mysql2/promise";
import config from "../config/index.js";

class MySQL {
    static pool;

    static async initPool() {
        try {
            this.pool = mysql.createPool({
                host: config.db.host,
                user: config.db.user,
                password: config.db.password,
                database: config.db.database,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });
            console.log('Connect MySQL successfully');
        } catch (error) {
            console.log("Error while connect MySQL: ", error.message);
        }
    }

    static getPool() {
        return this.pool;
    }
}

export default MySQL;