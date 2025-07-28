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
        this.img = data.img ?? undefined;
        this.img_name = data.img_name ?? null;
        this.type = data.type;
        this.description = data.description;
        this.unit = data.unit;
        this.origin = data.origin;
        this.quantity = data.quantity ?? null;
        this.created_at = data.created_at;
    }

    get img_url() {
        return this.img_name ? 'http://localhost:3000/imgs/product/' + this.img_name : null
    }

    static types = ['Trái cây','Rau củ','Các loại thịt','Thực phẩm đóng hộp',
        'Ngũ cốc', 'Cá và hải sản','Quả hạch và hạt'];
    static units = ['Kg', 'Lít', 'Thùng', 'Hộp', 'Bao'];
    static imgBaseURL = 'http://localhost:3000/imgs/product/';
    static getEmptyObject() {
        return new Product(
            {name: '', sale_price: 0, manufacturer: ''}
        );
    }

}