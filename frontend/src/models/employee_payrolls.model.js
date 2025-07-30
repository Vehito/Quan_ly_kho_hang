import date_helperUtil from "@/utils/date_helper.util";
import Model from "./model";
import number_heplerUtil from "@/utils/number_hepler.util";

class EmployeePayrollsService extends Model {
    constructor() {
        super("/api/employee_payrolls");
    }

    createIntance(data) {
        
    }
}

export default new EmployeePayrollsService();

export class EmployeePayroll {
    constructor(data) {
        this.id = data.id ?? undefined;
        this.employee_id = data.employee_id;
        this.payroll_month = data.payroll_month;
        this.workdays = data.workdays ?? 0;
        this.working_days = data.working_days ?? '';
        this.basic_salary = data.basic_salary ?? 0;
        this.overtime_weekday_hours = data.overtime_weekday_hours ?? 0;
        this.overtime_weekend_hours = data.overtime_weekend_hours ?? 0;
        this.overtime_holiday_hours = data.overtime_holiday_hours ?? 0;
        this.responsibility_allowance = data.responsibility_allowance ?? 0;
        this.lunch_allowance = data.lunch_allowance ?? 0;
        this.orther_allowances = data.orther_allowances ?? 0;
        this.orther_allowances_description = data.orther_allowances_description ?? null;
        this.social_insurance = data.social_insurance ?? 0;
        this.heath_insurance = data.heath_insurance ?? 0;
        this.orther_dedutions = data.orther_dedutions ?? 0;
        this.orther_dedutions_description = data.orther_dedutions_description ?? null;
        this.unemloyment_insurance = data.unemloyment_insurance ?? 0;
        this.recorded_payment = data.recorded_payment ?? false;
        this.total_income = data.total_income ?? this.caculate_total_income;
        this.total_deduction = data.total_deduction ?? this.caculate_total_deduction;
        this.net_salary = data.net_salary ?? this.caculate_net_salary;
    }

    get text_payroll_month() { return date_helperUtil.getStringMonth(this.payroll_month); }
    get arr_working_days() { return this.working_days.split(', '); }
    get formatted_lunch_allowance() { return number_heplerUtil.getCurrencyFormat(this.lunch_allowance); }
    get formatted_orther_allowances() { return number_heplerUtil.getFormattedNumber(this.orther_allowances); }
    get formatted_social_insurance() { return number_heplerUtil.getFormattedNumber(this.social_insurance); }
    get formatted_heath_insurance() { return number_heplerUtil.getFormattedNumber(this.heath_insurance); }
    get formatted_orther_deductions() { return number_heplerUtil.getFormattedNumber(this.orther_dedutions); }
    get formatted_unemloyment_insurance() { return number_heplerUtil.getFormattedNumber(this.unemloyment_insurance); }
    get formatted_total_income() { return number_heplerUtil.getFormattedNumber(this.total_income); }
    get formatted_total_deduction() { return number_heplerUtil.getFormattedNumber(this.total_deduction); }
    get formatted_net_salary() { return number_heplerUtil.getFormattedNumber(this.net_salary); }
    get caculate_total_income() {
        return (this.basic_salary*this.workdays + this.overtime_weekday_hours*1.5 + this.overtime_weekend_hours*2
            + this.overtime_holiday_hours*3 + this.lunch_allowance + this.responsibility_allowance + this.orther_allowances)
    }
    get caculate_total_deduction() {
        return (this.social_insurance + this.heath_insurance
            + this.unemloyment_insurance + this.orther_dedutions);
    }
    get caculate_net_salary() {
        return this.total_income - this.total_deduction;
    }
}