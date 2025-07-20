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
    constructor(data) {
        this.id = data.id ?? null;
        this.name = data.name;
        this.sale_price = data.sale_price;
        this.formatted_sale_price = this.sale_price?.toLocaleString('vi-VN');
        this.manufacturer = data.manufacturer;
        this.quantity = data.quantity ?? null;
        this.created_at = data.created_at;
    }

    static getEmptyObject() {
        return new Product(
            {name: '', sale_price: 0, manufacturer: ''}
        );
    }

}