import MySQL from "../utils/mysql.util.js";

export async function withTransaction(callback) {
    const conn = await MySQL.getConnection();
    try {
        await conn.beginTransaction();
        const result = await callback(conn);
        await conn.commit();
        return result;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

export function isValid(payload, requiredFields = []) {
    return requiredFields.every(field => payload[field]);
}