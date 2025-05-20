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
}

export default ShipmentsService;