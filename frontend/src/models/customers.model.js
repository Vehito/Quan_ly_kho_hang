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
    #id;
    #name;
    #company;
    #address;
    #debt; 
    #due_date;
    #status;
    constructor(data) {
        this.#id = data.id ?? null,
        this.#name = data.name,
        this.#company = data.company ?? null,
        this.#address = data.address,
        this.#debt = data.debt,
        this.#due_date = data.due_date ?? null,
        this.#status = data.status
    }

    get isOverdue() {
        if (!this.#due_date) return false;
        return new Date(this.#due_date) < new Date();
    }
    get id() { 
        return this.#id; 
    }
    get name() {
        return this.#name;
    }
    get company() {
        return this.#company;
    }
    get address() {
        return this.#address;
    }
    get debt() {
        return this.#debt;
    }
    get dueDate() {
        return this.#due_date;
    }
    get status() {
        return this.#status;
    }
}