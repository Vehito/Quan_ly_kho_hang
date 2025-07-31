import monthly_payrollsModel from "@/models/monthly_payrolls.model";
import Controller from "./controller";
import date_helperUtil from "@/utils/date_helper.util";

class MonthlyPayrollsController extends Controller {
    constructor() {
        super(monthly_payrollsModel);
    }

    async queryAll(filter, needItem = false) {
        return await super.queryAll({needItem, ...filter});
    }

    async queryById(id, filter, needItem = false) {
        return await super.queryById(id, {needItem, ...filter});
    }

    async queryCount(filter, needItem = false) {
        return await super.queryCount({needItem, ...filter});
    }

    async insert(data) {
        data.payroll_month = date_helperUtil.formatDateForMySQL(data.payroll_month);
        const editedData = super.deleteAttribute(data, ['employee_payrolls', 'employee_name']);
        return await super.insert(editedData);
    }

    async update(id, data) {
        data.payroll_month = date_helperUtil.formatDateForMySQL(data.payroll_month);
        const editedData = super.deleteAttribute(data, ['employee_payrolls', 'employee_name']);
        return await super.update(id, editedData);
    }
}

export default new MonthlyPayrollsController();