import Service from "./service.js";

class EmployeePayrollsService extends Service {
    constructor() {
        super('employee_payrolls');
    }

    async #extractEmployeePayrollData(payload) {
        const employee_payrolls = {
            id: payload.id,
            employee_id: payload.employee_id,
            payroll_month: payload.payroll_month,
            workdays: payload.workdays ?? 0,
            basic_salary: payload.basic_salary ?? 0,
            overtime_weekday_hours: payload.overtime_weekday_hours ?? 0,
            overtime_weekend_hours: payload.overtime_weekend_hours ?? 0,
            overtime_holiday_hours: payload.overtime_holiday_hours ?? 0,
            responsibility_allowance: payload.responsibility_allowance ?? 0,
            lunch_allowance: payload.lunch_allowance ?? 0,
            other_allowances: payload.other_allowances ?? 0,
            other_allowances_description: payload.other_allowances_description ?? null,
            social_insurance: payload.social_insurance ?? 0,
            health_insurance: payload.health_insurance ?? 0,
            other_deductions: payload.other_deductions ?? 0,
            other_deductions_description: payload.other_deductions_description ?? null,
            unemployment_insurance: payload.unemployment_insurance ?? 0,
            recorded_payment: payload.recorded_payment ?? false,
            monthly_payroll_id: payload.monthly_payroll_id,
            position: payload.position,
            department_id: payload.department_id
        }

        Object.keys(employee_payrolls).forEach(
            (key) => employee_payrolls[key] === undefined && delete employee_payrolls[key]
        );
        return employee_payrolls;
    }

    async insert(payload, conn) {
        const employee_payrolls = await this.#extractEmployeePayrollData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} 
                (employee_id, payroll_month, workdays, basic_salary, overtime_weekday_hours, overtime_weekend_hours,
                overtime_holiday_hours, responsibility_allowance, lunch_allowance, other_allowances,
                other_allowances_description, social_insurance, health_insurance, other_deductions,
                other_deductions_description, unemployment_insurance, recorded_payment, monthly_payroll_id,
                position, department_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            Object.values(employee_payrolls)
        );
        return {
            id: result.insertId,
            ...result
        };
    }

    async query(filter, conn) {
        const { clauses, values } = this.getQueryClauses(filter, this.tableName);
        let query = `SELECT employee_payrolls.*,
                employees.name AS employee_name,
                departments.name AS department_name,
                monthly_payrolls.finalized_day AS finalized_day
            FROM ${this.tableName}`;
        query += ' JOIN employees ON employee_payrolls.employee_id = employees.id'
        query += ' JOIN departments ON employee_payrolls.department_id = departments.id'
        query += ' JOIN monthly_payrolls ON employee_payrolls.monthly_payroll_id = monthly_payrolls.id'
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        const [rows] = await conn.query(query, values);
        return rows;
    }
}

export default EmployeePayrollsService;