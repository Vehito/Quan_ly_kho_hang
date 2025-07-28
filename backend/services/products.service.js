import Service from "./service.js";

class ProductsService extends Service {
    constructor() {
        super('products', ['id', 'name']);
    }

    #extractProductData(payload) {
        const product = {
            id: payload.id ?? undefined,
            name: payload.name,
            sale_price: payload.sale_price,
            manufacturer: payload.manufacturer,
            img_name: payload.img_name,
            type: payload.type,
            unit: payload.unit,
            origin: payload.origin,
            description: payload.description ?? null,
            quantity: payload.quantity ?? 0,
            created_at: payload.created_at ?? new Date(),
        };
        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]
        );
        return product;
    }

    async insert(payload, conn) {
        const product = this.#extractProductData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (name, sale_price, manufacturer, img_name, type, unit, origin, description, quantity, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            Object.values(product)
        );
        return {
            id: result.insertId,
            ...result,
        };
    }

    async adjustQuantity(id, quantity, conn) {
        const update = 
            `UPDATE ${this.tableName} 
            SET quantity = CASE
                WHEN (quantity + ?) >= 0
                THEN quantity + ?
            END
            WHERE id = ?`;
        const result = await conn.query(update, [quantity, quantity, id]);
        return result;
    }
}

export default ProductsService;