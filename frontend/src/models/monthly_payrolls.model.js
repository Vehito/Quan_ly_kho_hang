import date_helperUtil from "@/utils/date_helper.util";
import Model from "./model";
import { EmployeePayroll } from "./employee_payrolls.model";
import number_heplerUtil from "@/utils/number_hepler.util";

class MonthlyPayrollsModel extends Model {
    constructor() {
        super("/api/monthly_payrolls");
    }

    createIntance(data) {
        return new MonthlyPayroll(data);
    }
}

export default new MonthlyPayrollsModel();

export class MonthlyPayroll {
    constructor(data) {
        this.id = data.id ?? undefined;
        this.payroll_month = data.payroll_month;
        this.total_amount = data.total_amount ?? this.caculate_total_amount;
        this.finalized_day = data.finalized_day ?? null;
        this.is_finalized = data.is_finalized ?? false;
        this.employee_payrolls = this.#buildEmployeePayRolls(data.employee_payrolls);
    }
    
    get formatted_total_amount() {
        return number_heplerUtil.getFormattedNumber(this.total_amount);
    }
    get text_payroll_month() {
        return date_helperUtil.getStringMonth(this.payroll_month);
    }
    get text_finalized_day() {
        return this.is_finalized
            ? date_helperUtil.getStringDate(this.finalized_day)
            : "Chưa thanh toán";
    }
    get text_is_finalized() {
        return this.is_finalized ? "Đã thanh toán" : "Chưa thanh toán";
    }
    get caculate_total_amount() {
        return this.employee_payrolls
            .reduce((preVal, currVal) => 
                Number(preVal) + Number(currVal.net_salary), 0);
    }

    #buildEmployeePayRolls(dataList) {
        const rawList =
            (Array.isArray(dataList) && dataList.length > 0) 
                ? dataList : [{}];
        return rawList.map(
            payroll => payroll instanceof EmployeePayroll 
                ? payroll : new EmployeePayroll(payroll)
        )
    }
}