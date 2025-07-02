import Service from "./service.js";

class ProductsService extends Service {
    constructor() {
        super('products');
    }

    #extractProductData(payload) {
        const product = {
            id: payload.id,
            name: payload.name,
            sale_price: payload.sale_price,
            manufacturer: payload.manufacturer,
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
            `INSERT INTO ${this.tableName} (name, sale_price, manufacturer, quantity, created_at)
            VALUES (?, ?, ?, ?, ?)`,
            [product.name, product.sale_price, product.manufacturer, product.quantity, product.created_at]
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