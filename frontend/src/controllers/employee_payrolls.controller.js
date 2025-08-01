import employee_payrollsModel from "@/models/employee_payrolls.model";
import Controller from "./controller";
import date_helperUtil from "@/utils/date_helper.util";

class EmployeePayrollController extends Controller {
    constructor() {
        super(employee_payrollsModel);
    }

    async insert(data) {
        data.payroll_month = date_helperUtil.formatDateForMySQL(data.payroll_month);
        const editedData = super.deleteAttribute(data,
            ['employee_name', 'department_name', 'position']);
        return await super.insert(editedData);
    }

    async update(id, data) {
        data.payroll_month = date_helperUtil.formatDateForMySQL(data.payroll_month);
        const editedData = super.deleteAttribute(data, ['employee_name', 'department_name', 'position']);
        return await super.update(id, editedData);
    }
}

export default new EmployeePayrollController();