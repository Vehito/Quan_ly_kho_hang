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
    constructor(data) {
        this.id = data.id ?? undefined,
        this.name = data.name,
        this.address = data.address,
        this.phone = data.phone,
        this.description = data.description ?? null
    }

    static getEmptyObject() {
        return new Supplier({
            name: '', address: '', phone: ''
        });
    }
}