import ApiError from "../api-error.js";
import EmployeePayrollsService from "../services/employee_payrolls.service.js";
import MonthlyPayrollsService from "../services/monthly_payrolls.service.js";
import * as sharedController from "./controller.shared.js";

function getEmployeePayrollTotal(emp_payroll) {
    const OT_150_salary = (emp_payroll.basic_salary/8)*Number(emp_payroll.overtime_weekday_hours);
    const OT_200_salary = (emp_payroll.basic_salary/8)*Number(emp_payroll.overtime_weekend_hours);
    const OT_300_salary = (emp_payroll.basic_salary/8)*Number(emp_payroll.overtime_holiday_hours);
    const total_income = emp_payroll.basic_salary*Number(emp_payroll.workdays) + OT_150_salary 
        + OT_200_salary + OT_300_salary + emp_payroll.lunch_allowance
        + emp_payroll.responsibility_allowance + emp_payroll.other_allowances;
    const total_deduction = emp_payroll.social_insurance + emp_payroll.health_insurance
        + ((emp_payroll.basic_salary*Number(emp_payroll.workdays))*0.1)
        + emp_payroll.unemployment_insurance + emp_payroll.other_deductions;
    return total_income - total_deduction;
}

export async function insert(req, res, next) {
    sharedController.isValid(req.body, ['employee_id', 'payroll_month'],'employee_payrolls');
    try {
        const result = await sharedController
        .withTransaction(async (conn) => {
            const employeePayrollsService = new EmployeePayrollsService();
            const { id } = await employeePayrollsService.insert(req.body, conn);
            const emp_payroll = await employeePayrollsService.query({id: id}, conn);
            const emp_total = getEmployeePayrollTotal(emp_payroll[0]);
            const monthlyPayrollsService = new MonthlyPayrollsService();
            await monthlyPayrollsService.adjustTotalAmount(req.body.monthly_payroll_id, emp_total, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the employee_payroll: ${error}`)
        )
    }
}

export async function query(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const employeePayrollsService = new EmployeePayrollsService();
                if(req.params?.id) {
                    return await employeePayrollsService.query(req.params, conn);
                } else if(req.query?.itemLength==='true') {
                    return await employeePayrollsService.queryCount(req.query, conn);
                } else {
                    return await employeePayrollsService.query(req.query, conn);
                }
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the employee_payroll: ${error}`)
        );
    }
}

export async function update(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const employeePayrollsService = new EmployeePayrollsService();
                const monthlyPayrollsService = new MonthlyPayrollsService();
                const employee_payroll = await employeePayrollsService.query({id: req.params.id}, conn);
                const result = await employeePayrollsService.update(req.params.id, req.body, conn);
                const old_emp_total = getEmployeePayrollTotal(employee_payroll[0]);
                const new_emp_total = getEmployeePayrollTotal(req.body);
                await monthlyPayrollsService.adjustTotalAmount(req.body.monthly_payroll_id,
                    new_emp_total - old_emp_total, conn
                )
                return result;
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while updating the employee_payroll: ${error}`)
        );
    }
}

export async function remove(req, res, next) {
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const employeePayrollsService = new EmployeePayrollsService();
            return await employeePayrollsService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the employee_payroll: ${error}`)
        )
    }
}