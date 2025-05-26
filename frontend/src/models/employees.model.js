import Model from "./model";

class EmployeesModel extends Model {
    constructor() {
        super("/api/employees");
    }

    createIntance(data) {
        return new Employee(data);
    }
}

export default new EmployeesModel();

export class Employee {
    #id;
    #name;
    #position_id;
    #birth;
    #phone;
    #username;
    #address;
    constructor(data) {
        this.#id = data.id ?? null,
        this.#name = data.name,
        this.#position_id = data.position_id,
        this.#birth = data.birth,
        this.#phone = data.phone,
        this.#username = data.username,
        this.#address = data.address
    }

    get id() { 
        return this.#id; 
    }
    get name() {
        return this.#name;
    }
    get position_id() {
        return this.#position_id;
    }
    get bitrh() {
        return this.#birth;
    }
    get phone() {
        return this.#phone;
    }
    get username() {
        return this.#username;
    }
    get address() {
        return this.#address;
    }
}