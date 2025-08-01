import Service from "./service.js";

class PositionsService extends Service {
    constructor() {
        super('departments');
    }

    #extractPositionData(payload) {
        const department = {
            id: payload.id,
            name: payload.name,
            level: payload.level,
            description: payload.description ?? null
        }

        Object.keys(department).forEach(
            (key) => department[key] === undefined && delete department[key]
        );
        return department;
    }

    async insert(payload, conn) {
        const department = this.#extractPositionData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (name, description)
            VALUES (?, ?, ?)`,
            Object.values(department)
        );
        return {
            id: result.insertId,
            ...result
        };
    }
}

export default PositionsService;