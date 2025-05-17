import Service from "./service.js";

class ProductsService extends Service {
    constructor() {
        super('products');
    }

    #extractProductData(payload) {
        const product = {
            id: payload.id,
            name: payload.name,
            salePrice: payload.sale_price,
            manufacturer: payload.manufacturer,
            quantity: payload.quantity ?? 0,
            createAt: payload.create_at ?? new Date(),
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
            [product.name, product.salePrice, product.manufacturer, product.quantity, product.createAt]
        );
        return {
            id: result.insertId,
            ...result,
        };
    }
}

export default ProductsService;