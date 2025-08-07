import date_helperUtil from "@/utils/date_helper.util";
import Model from "./model";
import number_heplerUtil from "@/utils/number_hepler.util";

class EmployeePayrollsService extends Model {
    constructor() {
        super("/api/employee_payrolls");
    }

    createIntance(data) {
        return new EmployeePayroll(data);
    }
}

export default new EmployeePayrollsService();

export class EmployeePayroll {
    constructor(data) {
        this.id = data.id ?? undefined;
        this.employee_id = data.employee_id;
        this.employee_name = data.employee_name;
        this.department_name = data.department_name;
        this.department_id = data.department_id;
        this.position = data.position;
        this.monthly_payroll_id = data.monthly_payroll_id;
        this.finalized_day = data.finalized_day;
        this.payroll_month = data.payroll_month;
        this.workdays = data.workdays ?? 0;
        this.basic_salary = data.basic_salary ?? 0;
        this.overtime_weekday_hours = data.overtime_weekday_hours ?? 0;
        this.overtime_weekend_hours = data.overtime_weekend_hours ?? 0;
        this.overtime_holiday_hours = data.overtime_holiday_hours ?? 0;
        this.responsibility_allowance = data.responsibility_allowance ?? 0;
        this.lunch_allowance = data.lunch_allowance ?? 0;
        this.other_allowances = data.other_allowances ?? 0;
        this.other_allowances_description = data.other_allowances_description ?? null;
        this.social_insurance = data.social_insurance ?? 0;
        this.health_insurance = data.health_insurance ?? 0;
        this.other_deductions = data.other_deductions ?? 0;
        this.other_deductions_description = data.other_deductions_description ?? null;
        this.unemployment_insurance = data.unemployment_insurance ?? 0;
        this.recorded_payment = data.recorded_payment ?? false;
    }
    
    get text_payroll_month() { return date_helperUtil.getStringMonth(this.payroll_month); }
    get text_finalized_day() {
        return this.finalized_day
            ? date_helperUtil.getStringDate(this.finalized_day)
            : 'Chưa thanh toán';
    }
    get text_position() { return this.position==='Admin' ? 'Quản lý' : this.position==='Boss' ? 'Chủ kho' : 'Nhân viên'; }
    get text_recorded_payment() {
        return this.finalized_day ? "Đã thanh toán": "Chưa thanh toán";
    }

    get formatted_persenal_tax_deduction() { return number_heplerUtil.getFormattedNumber(this.persenal_tax_deduction); }
    get formatted_basic_salary() { return number_heplerUtil.getFormattedNumber(this.basic_salary); }
    get formatted_lunch_allowance() { return number_heplerUtil.getFormattedNumber(this.lunch_allowance); }
    get formatted_OT_allowance() { return number_heplerUtil.getFormattedNumber(this.OT_150_salary+this.OT_200_salary+this.OT_300_salary); }
    get formatted_resposibility_allowances() { return number_heplerUtil.getFormattedNumber(this.responsibility_allowance); }
    get formatted_other_allowances() { return number_heplerUtil.getFormattedNumber(this.other_allowances); }
    get formatted_social_insurance() { return number_heplerUtil.getFormattedNumber(this.social_insurance); }
    get formatted_health_insurance() { return number_heplerUtil.getFormattedNumber(this.health_insurance); }
    get formatted_other_deductions() { return number_heplerUtil.getFormattedNumber(this.other_deductions); }
    get formatted_unemployment_insurance() { return number_heplerUtil.getFormattedNumber(this.unemployment_insurance); }
    get formatted_total_income() { return number_heplerUtil.getFormattedNumber(this.total_income); }
    get formatted_total_deduction() { return number_heplerUtil.getFormattedNumber(this.total_deduction); }
    get formatted_net_salary() { return number_heplerUtil.getFormattedNumber(this.net_salary); }
    get formatted_OT_150_salary() { return number_heplerUtil.getFormattedNumber(this.OT_150_salary); }
    get formatted_OT_200_salary() { return number_heplerUtil.getFormattedNumber(this.OT_200_salary); }
    get formatted_OT_300_salary() { return number_heplerUtil.getFormattedNumber(this.OT_300_salary); }
    get formatted_basic_month_salary() { 
        return number_heplerUtil.getFormattedNumber(
            this.basic_salary*this.workdays + this.OT_150_salary + this.OT_200_salary + this.OT_300_salary
        );
    }

    get OT_150_salary() { return (this.basic_salary/8)*this.overtime_weekday_hours; }
    get OT_200_salary() { return (this.basic_salary/8)*this.overtime_weekend_hours; }
    get OT_300_salary() { return (this.basic_salary/8)*this.overtime_holiday_hours; }
    get total_income() {
        return (this.basic_salary*this.workdays + this.OT_150_salary + this.OT_200_salary
            + this.OT_300_salary + this.lunch_allowance + this.responsibility_allowance + this.other_allowances)
        }
    get persenal_tax_deduction() { return (this.basic_salary*this.workdays)*0.1; }
    get total_deduction() {
        return (this.social_insurance + this.health_insurance + this.persenal_tax_deduction
            + this.unemployment_insurance + this.other_deductions);
    }
    get net_salary() {
        return this.total_income - this.total_deduction;
    }

    static persenal_tax_value = 0.1;
    static text_persenal_tax = '10%';
}