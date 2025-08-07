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
            created_at: payload.created_at ?? new Date(),
            created_by: payload.created_by
        }

        Object.keys(employee_payrolls).forEach(
            (key) => employee_payrolls[key] === undefined && delete employee_payrolls[key]
        );
        return employee_payrolls;
    }

    async query(filter, conn) {
        const { limit, offset, ...conditions } = filter;
        const {clauses, values} = this.getQueryClauses(conditions, this.tableName, this.likeClauses);
        let query = `SELECT ${this.tableName}.*, employees.name AS employee_name
            FROM ${this.tableName}`;
        query += ` JOIN employees ON ${this.tableName}.created_by = employees.id`
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        if(limit > 0) {
            query += `\nLIMIT ${limit} ${offset>0 ? ('OFFSET ' + offset) : ''}`
        }
        const [rows] = await conn.query(query, values);
        return rows;
    }

    async insert(payload, conn) {
        const employee_payrolls = await this.#extractEmployeePayrollData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (payroll_month, total_amount, finalized_day, is_finalized, created_at, created_by)
            VALUES (?, ?, ?, ?, ?, ?)`,
            Object.values(employee_payrolls)
        );
        return {
            id: result.insertId,
            ...result
        };
    }

    getQueryClauses(filter, tableName, likeClause) {
        const { start, end, ...conditions } = filter;
        if(start && end) {
            const values = super.getQueryClauses(conditions, tableName, likeClause);
            values.clauses += ` ${values.clauses ? 'AND' : ''} payroll_month BETWEEN ? AND ?`
            values.values.push(...[start, end]);
            return values;
        }
        return super.getQueryClauses(filter, tableName, likeClause);
    }

    async adjustTotalAmount(id, total_amount, conn) {
        const update = 
            `UPDATE ${this.tableName} 
            SET total_amount = CASE
                WHEN (total_amount + ?) >= 0
                THEN total_amount + ?
            END
            WHERE id = ?`;
        const result = await conn.query(update, [total_amount, total_amount, id]);
        return result;
    }
}

export default MonthlyPayrollsService;