import Model from "./model";

class SuppliersModel extends Model {
    constructor() {
        super("/api/suppliers");
    }

    createIntance(data) {
        return new Supplier(data);
    }
}

export default new SuppliersModel();

export class Supplier {
    // #id;
    // #name;
    // #address;
    // #phone; 
    // #description;
    constructor(data) {
        this.id = data.id ?? null,
        this.name = data.name,
        this.address = data.address,
        this.phone = data.phone,
        this.description = data.description ?? null
    }

    // get id() { 
    //     return this.#id; 
    // }
    // get name() {
    //     return this.#name;
    // }
    // get address() {
    //     return this.#address;
    // }
    // get phone() {
    //     return this.#phone;
    // }
    // get description() {
    //     return this.#description;
    // }
}