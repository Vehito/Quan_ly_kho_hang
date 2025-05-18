import Service from "./service.js";

class SuppliersService extends Service {
    constructor() {
        super('suppliers');
    }

    #extractSupplierData(payload) {
        const supplier = {
            id: payload.id,
            name: payload.name,
            address: payload.address,
            phone: payload.phone,
            description: payload.description ?? null
        };
        Object.keys(supplier).forEach(
            (key) => supplier[key] === undefined && delete supplier[key]
        );
        return supplier;
    }

    async insert(payload, conn) {
        const supplier = this.#extractSupplierData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (name, address, phone, description)
            VALUES (?, ?, ?, ?)`,
            Object.values(supplier)
        );
        return {
            id: result.insertId,
            ...result,
        };
    }
}

export default SuppliersService;