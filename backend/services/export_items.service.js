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
            Object.values[exportItem]
        );
        return {
            id: result.insertId,
            ...result
        };
    }
}

export default ExportItemsService;