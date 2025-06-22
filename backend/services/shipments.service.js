import Service from "./service.js";

class ShipmentsService extends Service {
    constructor(isImport) {
        super(isImport ? "import_shipments" : "export_shipments");
        this.object = isImport ? "supplier_id" : "customer_id";
    }

    #extractShipmentData(payload) {
        const shipment = {
            id: payload.id,
            [this.object]: payload[this.object],
            created_at: payload.created_at ?? new Date(),
            created_by: payload.created_by,
            description: payload.description ?? null
        }
        Object.keys(shipment).forEach(
            (key) => shipment[key] === undefined && delete shipment[key]
        );
        return shipment;
    }

    async insert(payload, conn) {
        const shipment = this.#extractShipmentData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (${this.object}, created_at, created_by, description)
            VALUES (?, ?, ?, ?)`,
            [shipment[this.object], shipment.created_at, shipment.created_by, shipment.description]
        );
        return {
            id: result.insertId,
            ...result
        };
    }

    async query(filter, conn) {
        const { clauses, values } = this.getQueryClauses(filter, this.tableName);
        let query = `SELECT import_shipments.*,
            suppliers.name AS supplier_name, employees.name AS employee_name
            FROM ${this.tableName}`;
        query += ' JOIN suppliers ON import_shipments.supplier_id = suppliers.id';
        query += ' JOIN employees ON import_shipments.created_by = employees.id';
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        const [rows] = await conn.query(query, values);
        return rows;
    }
}

export default ShipmentsService;