import Service from "./service.js";

class MonthlyPayrollsService extends Service {
    constructor() {
        super('monthly_payrolls');
    }

    async #extractEmployeePayrollData(payload) {
        const employee_payrolls = {
            id: payload.id ?? undefined,
            payroll_month: payload.payroll_month,
            total_amount: payload.total_amount ?? 0,
            finalized_day: payload.finalized_day ?? null,
            is_finalized: payload.is_finalized ?? false,
        }

        Object.keys(employee_payrolls).forEach(
            (key) => employee_payrolls[key] === undefined && delete employee_payrolls[key]
        );
        return employee_payrolls;
    }

    async insert(payload, conn) {
        const employee_payrolls = await this.#extractEmployeePayrollData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (payroll_month, total_amount, finalized_day, is_finalized)
            VALUES (?, ?, ?, ?)`,
            Object.values(employee_payrolls)
        );
        return {
            id: result.insertId,
            ...result
        };
    }

    async query(filter, conn) {
        const { clauses, values } = this.getQueryClauses(filter, this.tableName);
        let query = `SELECT ${this.tableName}.*
            FROM ${this.tableName}`;
        // query += `\nJOIN employee_payrolls ON ${this.tableName}.payroll_month = employee_payrolls.payroll_month`;
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        const [rows] = await conn.query(query, values);
        return rows;
    }
}

export default MonthlyPayrollsService;