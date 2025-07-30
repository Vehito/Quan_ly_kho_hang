import monthly_payrollsModel from "@/models/monthly_payrolls.model";
import Controller from "./controller";
import date_helperUtil from "@/utils/date_helper.util";

class MonthlyPayrollsController extends Controller {
    constructor() {
        super(monthly_payrollsModel);
    }

    async insert(data) {
        data.payroll_month = date_helperUtil.formatDateForMySQL(data.payroll_month);
        const editedData = super.deleteAttribute(data, ['employee_payrolls']);
        return await super.insert(editedData);
    }

    async update(id, data) {
        data.payroll_month = date_helperUtil.formatDateForMySQL(data.payroll_month);
        const editedData = super.deleteAttribute(data, ['text_status', 'text_due_date', 'formatted_debt']);
        return await super.update(id, editedData);
    }
}

export default new MonthlyPayrollsController();