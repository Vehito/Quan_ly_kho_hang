import ApiError from "../api-error.js";
import EmployeePayrollsService from "../services/employee_payrolls.service.js";
import * as sharedController from "./controller.shared.js";

export async function insert(req, res, next) {
    sharedController.isValid(req.body, ['employee_id', 'payroll_month'],'employee_payrolls');
    try {
        const result = await sharedController
        .withTransaction(async (conn) => {
            const employeePayrollsService = new EmployeePayrollsService();
            return await employeePayrollsService.insert(req.body, conn);
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
                if(req.params) {
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
                return await employeePayrollsService.update(req.params.id, req.body, conn);
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