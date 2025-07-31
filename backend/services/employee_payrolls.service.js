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
            overtime_weekday_hours: payload.overtime_weekday_hours ?? 0,
            overtime_weekend_hours: payload.overtime_weekend_hours ?? 0,
            overtime_holiday_hours: payload.overtime_holiday_hours ?? 0,
            lunch_allowance: payload.lunch_allowance ?? 0,
            other_allowances: payload.other_allowances ?? 0,
            other_allowances_description: payload.other_allowances_description ?? null,
            social_insurance: payload.social_insurance ?? 0,
            health_insurance: payload.health_insurance ?? 0,
            other_dedutions: payload.other_dedutions ?? 0,
            other_dedutions_description: payload.other_dedutions_description ?? null,
            unemloyment_insurance: payload.unemloyment_insurance ?? 0,
            recorded_payment: payload.recorded_payment ?? false,
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
                (employee_id, payroll_month, workdays, overtime_weekday_hours, overtime_weekend_hours,
                overtime_holiday_hours, lunch_allowance, other_allowances, other_allowances_description,
                social_insurance, health_insurance, other_dedutions, other_dedutions_description,
                unemloyment_insurance, recorded_payment)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                employees.basic_salary AS basic_salary,
                employees.responsibility_allowance AS responsibility_allowance,
                employees.working_days AS working_days,
                SUM(basic_salary*workdays + overtime_weekday_hours*1.5 + overtime_weekend_hours*2
                    + overtime_holiday_hours*3 + lunch_allowance + responsibility_allowance + other_allowances) 
                    AS total_income,
                SUM(social_insurance + health_insurance + unemployment_insurance
                    + other_deductions) AS total_deduction,
                SUM((basic_salary*workdays + overtime_weekday_hours*1.5 + overtime_weekend_hours*2
                        + overtime_holiday_hours*3 + lunch_allowance + responsibility_allowance + other_allowances)
                    - (social_insurance + health_insurance + unemployment_insurance
                        + other_deductions)) AS net_salary
            FROM ${this.tableName}`;
        query += ' JOIN employees ON employee_payrolls.employee_id = employees.id'
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        query += `\nGROUP BY ${this.tableName}.id`
        const [rows] = await conn.query(query, values);
        return rows;
    }
}

export default EmployeePayrollsService;