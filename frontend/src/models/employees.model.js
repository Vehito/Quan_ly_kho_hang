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
        this.department_id = data.department_id;
        this.birth = data.birth;
        this.phone = data.phone;
        this.position = data.position;
        this.username = data.username ?? null;
        this.password = data.password ?? null;
        this.address = data.address;
        this.department_name= data.department_name ?? null;
    }

    get arr_working_days() {
        return this.working_days.split(', ');
    }
    get arr_working_days_status() {
        const date = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        const workingDaysSet = new Set(this.arr_working_days);
        return date.map((day) => workingDaysSet.has(day));
    }
    get text_birth() {
        return date_helperUtil.getStringDate(this.birth);
    }
    get formatted_basic_salary() {
        return number_heplerUtil.getFormattedNumber(this.basic_salary);
    }
    get text_position() {
        return this.position==='Admin' ? "Quản lý" : "Nhân viên";
    }

    static getEmptyObject() {
        return new Employee({
            name: '', department_id: 1,
            birth: new Date(), phone: '',
            username: null, address: '',
            position: 'Employee',
            working_days: 'T2, T3, T4, T5, T6, T7'
        });
    }

    static arrDateInWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
}