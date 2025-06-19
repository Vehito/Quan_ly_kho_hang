import Model from "./model";

class CustomersModel extends Model {
    constructor() {
        super("/api/customers");
    }

    createIntance(data) {
        return new Customer(data);
    }
}

export default new CustomersModel();

export class Customer {
    constructor(data) {
        this.id = data.id ?? null;
        this.name = data.name;
        this.company = data.company ?? null;
        this.address = data.address;
        this.debt = data.debt;
        this.due_date = data.due_date ?? null;
        this.status = data.status;
        this.text_status = this.status === 1 ? 'Kích hoạt' : 'Không kích hoạt';
    }

    get isOverdue() {
        if (!this.due_date) return false;
        return new Date(this.due_date) < new Date();
    }
}