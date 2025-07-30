import date_helperUtil from "@/utils/date_helper.util";
import Model from "./model";
import number_heplerUtil from "@/utils/number_hepler.util";

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
        this.id = data.id ?? undefined;
        this.name = data.name;
        this.basic_salary = data.basic_salary;
        this.responsibility_allowance = data.responsibility_allowance;
        this.working_days = data.working_days;
        this.position_id = data.position_id;
        this.birth = data.birth;
        this.phone = data.phone;
        this.username = data.username ?? null;
        this.password = data.password ?? null;
        this.address = data.address;
        this.position_name= data.position_name ?? null;
    }

    get arr_working_days() {
        return this.working_days.split(', ');
    }
    get text_birth() {
        return date_helperUtil.getStringDate(this.birth);
    }
    get formatted_basic_salary() {
        return number_heplerUtil.getFormattedNumber(this.basic_salary);
    }

    static getEmptyObject() {
        return new Employee({
            name: '',
            position_id: 1,
            birth: new Date(),
            phone: '',
            username: '',
            address: '',
        });
    }
}