import ApiError from "../api-error.js";
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

export function isValid(payload, requiredFields = [], dataName = 'sent') {
    const result = requiredFields.every(field => payload[field]);
    if(!result) {
        throw new ApiError(400, `Invalid ${dataName} data!`);
    }
}