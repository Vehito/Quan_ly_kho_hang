import Model from "./model";

class DepartmentsModel extends Model {
    constructor() {
        super("/api/departments");
    }

    createIntance(data) {
        return new Department(data);
    }
}

export default new DepartmentsModel();

export class Department {
    constructor(data) {
        this.id = data.id ?? null,
        this.name = data.name,
        this.level = data.level,
        this.description = data.description ?? null
    }
}