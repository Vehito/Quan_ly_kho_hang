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
    constructor(data) {
        this.id = data.id ?? null;
        this.name = data.name;
        this.position_id = data.position_id;
        this.birth = data.birth;
        this.phone = data.phone;
        this.username = data.username;
        this.address = data.address;
        this.position_name= data.position_name ?? null;
    }
}