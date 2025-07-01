import Service from "./service.js";

class ExportItemsService extends Service {
    constructor() {
        super("export_items");
    }

    extractShipmentItemData(payload) {
        const exportItem = {
            shipment_id: payload.shipment_id,
            product_id: payload.product_id,
            import_shipment_id: payload.import_shipment_id,
            quantity: payload.quantity,
            price: payload.price
        }
        Object.keys(exportItem).forEach(
            (key) => exportItem[key] === undefined && delete exportItem[key]
        );
        return exportItem;
    }

    async insert(payload, conn) {
        const exportItem = this.extractShipmentItemData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (shipment_id, product_id, import_shipment_id, quantity, price)
            VALUES (?, ?, ?, ?, ?)`,
            Object.values(exportItem)
        );
        return {
            id: result.insertId,
            ...result
        };
    }

    async query(filter, conn) {
        const { clauses, values } = this.getQueryClauses(filter, this.tableName);
        let query = `SELECT ${this.tableName}.*,
            products.name AS product_name,
            import_items.mfg AS mfg, import_items.exp AS exp
            FROM ${this.tableName}`;
        query += ` JOIN products ON ${this.tableName}.product_id = products.id`;
        query += ` JOIN import_items ON ${this.tableName}.product_id = import_items.product_id AND ${this.tableName}.import_shipment_id = import_items.shipment_id`;
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        const [rows] = await conn.query(query, values);
        return rows;
    }
}

export default ExportItemsService;