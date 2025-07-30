import ApiError from "../api-error.js";
import MonthlyPayrollsService from "../services/monthly_payrolls.service.js";
import EmployeePayrollsService from "../services/employee_payrolls.service.js";
import * as sharedController from "./controller.shared.js";

export async function insert(req, res, next) {
    sharedController.isValid(req.body, ['payroll_month'],'monthly_payrolls');
    try {
        const result = await sharedController
        .withTransaction(async (conn) => {
            const monthlyPayrollsService = new MonthlyPayrollsService();
            return await monthlyPayrollsService.insert(req.body, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the monthly_payroll: ${error}`)
        )
    }
}

export async function query(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const monthlyPayrollsService = new MonthlyPayrollsService();
                const {needItem, ...filter} = req.query;
                let monthly_payrolls = [];
                if(req.params) {
                    monthly_payrolls = await monthlyPayrollsService.query(req.params, conn);
                } else if(req.query?.itemLength) {
                    return await monthlyPayrollsService.queryCount(filter, conn);
                } else {
                    monthly_payrolls = await monthlyPayrollsService.query(filter, conn);
                }
                if(needItem==='true') {
                    const employeePayrollsService = new EmployeePayrollsService();
                    for (const ele of monthly_payrolls) {
                        ele.employee_payrolls = 
                            await employeePayrollsService.query({payroll_month: ele.payroll_month}, conn);
                    }
                }
                return monthly_payrolls;
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the monthly_payroll: ${error}`)
        );
    }
}

export async function update(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const monthlyPayrollsService = new MonthlyPayrollsService();
                return await monthlyPayrollsService.update(req.params.id, req.body, conn);
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while updating the monthly_payroll: ${error}`)
        );
    }
}

export async function remove(req, res, next) {
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const monthlyPayrollsService = new MonthlyPayrollsService();
            return await monthlyPayrollsService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the monthly_payroll: ${error}`)
        )
    }
}