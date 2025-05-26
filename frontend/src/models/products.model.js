import Model from "./model";

class ProductsModel extends Model {
    constructor() {
        super("/api/products");
    }

    createIntance(data) {
        return new Product(data);
    }
}

export default new ProductsModel();

export class Product {
    #id;
    #name;
    #sale_price;
    #manufacturer; 
    #quantity;
    #created_at;
    constructor(data) {
        this.#id = data.id ?? null,
        this.#name = data.name,
        this.#sale_price = data.sale_price,
        this.#manufacturer = data.manufacturer,
        this.#quantity = data.quantity ?? null,
        this.#created_at = data.created_at
    }

    get id() { 
        return this.#id; 
    }
    get name() {
        return this.#name;
    }
    get sale_price() {
        return this.#sale_price;
    }
    get manufacturer() {
        return this.#manufacturer;
    }
    get quantity() {
        return this.#quantity;
    }
    get created_at() {
        return this.#created_at; 
    }
}