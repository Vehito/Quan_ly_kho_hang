import Service from "./service.js";

class PositionsService extends Service {
    constructor() {
        super('positions');
    }

    #extractPositionData(payload) {
        const position = {
            id: payload.id,
            name: payload.name,
            level: payload.level,
            description: payload.description ?? null
        }

        Object.keys(position).forEach(
            (key) => position[key] === undefined && delete position[key]
        );
        return position;
    }

    async insert(payload, conn) {
        const position = this.#extractPositionData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (name, level, description)
            VALUES (?, ?, ?)`,
            Object.values(position)
        );
        return {
            id: result.insertId,
            ...result
        };
    }
}

export default PositionsService;