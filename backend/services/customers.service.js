import Service from "./service.js";

class CustomersService extends Service {
    constructor() {
        super('customers', ['id', 'name', 'company']);
    }

    #extractCustomerData(payload) {
        const customer = {
            id: payload.id,
            name: payload.name,
            company: payload.company ?? null,
            address: payload.address,
            debt: payload.debt ?? 0,
            due_date: payload.due_date ?? null,
            status: payload.status ?? true
        }

        Object.keys(customer).forEach(
            (key) => customer[key] === undefined && delete customer[key]
        );
        return customer;
    }

    async insert(payload, conn) {
        const customer = this.#extractCustomerData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (name, company, address, debt, due_date, status)
            VALUES (?, ?, ?, ?, ?, ?)`,
            Object.values(customer)
        );
        return {
            id: result.insertId,
            ...result
        };
    }

    async adjustDebt(id, debt, conn) {
        const update = 
            `UPDATE ${this.tableName} 
            SET debt = CASE
                WHEN (debt + ?) >= 0
                THEN debt + ?
            END
            WHERE id = ?`;
        const result = await conn.query(update, [debt, debt, id]);
        return result;
    }
}

export default CustomersService;