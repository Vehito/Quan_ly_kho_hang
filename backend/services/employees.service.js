import Service from "./service.js";
import bcrypt from "bcrypt";

class EmployeesService extends Service {
    #saltRound;
    constructor() {
        super('employees', ['name', 'working_days', 'username']);
        this.#saltRound = 10;
    }

    async #hashPassword(plainPassword) {
        return await bcrypt.hash(plainPassword, this.#saltRound);
    }

    async #extractEmployeeData(payload) {
        const employee = {
            id: payload.id,
            name: payload.name,
            basic_salary: payload.basic_salary,
            position: payload.position ?? 'Employee',
            responsibility_allowance: payload.responsibility_allowance,
            department_id: payload.department_id,
            working_days: payload.working_days,
            birth: payload.birth,
            phone: payload.phone,
            username: payload.username ?? null,
            password: payload.password ? await this.#hashPassword(payload.password) : null,
            address: payload.address,
        }

        Object.keys(employee).forEach(
            (key) => employee[key] === undefined && delete employee[key]
        );
        return employee;
    }

    async insert(payload, conn) {
        const employee = await this.#extractEmployeeData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (name, basic_salary, position, responsibility_allowance, department_id, working_days, birth, phone, username, password, address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            Object.values(employee)
        );
        return {
            id: result.insertId,
            ...result
        };
    }

    async update(id, payload, conn) {
        if(payload.password) {
            payload.password = await this.#hashPassword(payload.password);
        }
        return await super.update(id, payload, conn);
    }

    async query(filter, conn) {
        const { clauses, values } = this.getQueryClauses(filter, this.tableName);
        let query = `SELECT employees.id, employees.name, employees.basic_salary,
            employees.responsibility_allowance, employees.department_id,
            employees.working_days, employees.birth, employees.phone,
            employees.username, employees.address, employees.position,
            departments.name AS department_name
            FROM ${this.tableName}`;
        query += ' JOIN departments ON employees.department_id = departments.id'
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        const [rows] = await conn.query(query, values);
        return rows;
    }

    async vertifyEmployee(username, enteredPassword, conn) {
        const query = `SELECT password FROM ${this.tableName} WHERE username = ?`;
        const result = (await conn.query(query, username))[0];
        if(!result[0].password) return false;
        return await bcrypt.compare(enteredPassword, result[0].password);
    }

    async changePassword(id, enteredPassword, conn) {
        const hashedPassword = await this.#hashPassword(enteredPassword);
        const query = `UPDATE ${this.tableName} SET password = ? WHERE id = ?`;
        return await conn.query(query, [hashedPassword, id]);
    }
}

export default EmployeesService;