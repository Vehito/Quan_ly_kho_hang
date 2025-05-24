import Service from "./service.js";

class ImportItemsService extends Service {
    constructor() {
        super("import_items");
    }

    extractShipmentItemData(payload) {
        const importItem = {
            shipment_id: payload.shipment_id,
            product_id: payload.product_id,
            mfg: payload.mfg,
            exp: payload.exp,
            quantity: payload.quantity,
            stoke: payload.stoke ?? payload.quantity,
            price: payload.price
        }
        Object.keys(importItem).forEach(
            (key) => importItem[key] === undefined && delete importItem[key]
        );
        return importItem;
    }

    async insert(payload, conn) {
        const importItem = this.extractShipmentItemData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (shipment_id, product_id, mfg, exp, quantity, stoke, price)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            Object.values[importItem]
        );
        return {
            id: result.insertId,
            ...result
        };
    }
}

export default ImportItemsService;