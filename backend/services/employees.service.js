import Service from "./service.js";
import bcrypt from "bcrypt";

class EmployeesService extends Service {
    #saltRound;
    constructor() {
        super('employees');
        this.#saltRound = 10;
    }

    async #hashPassword(plainPassword) {
        return await bcrypt.hash(plainPassword, this.#saltRound);
    }

    async #extractEmployeeData(payload) {
        const employee = {
            id: payload.id,
            name: payload.name,
            position_id: payload.position_id,
            birth: payload.birth,
            phone: payload.phone,
            username: payload.username,
            password: await this.#hashPassword(payload.password),
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
            `INSERT INTO ${this.tableName} (name, position_id, birth, phone, username, password, address)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            Object.values(employee)
        );
        return {
            id: result.insertId,
            ...result
        };
    }

    async query(filter, conn) {
        const { clauses, values } = this.getQueryClauses(filter, this.tableName);
        let query = `SELECT employees.id, employees.name, employees.position_id,
            employees.birth, employees.phone, employees.username, employees.address,
            positions.name AS position_name, positions.level AS level 
            FROM ${this.tableName}`;
        query += ' JOIN positions ON employees.position_id = positions.id'
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        const [rows] = await conn.query(query, values);
        return rows;
    }

    async vertifyEmployee(username, enteredPassword, conn) {
        const query = `SELECT password FROM ${this.tableName} WHERE username = ?`;
        const [result] = await conn.query(query, username);
        return await bcrypt.compare(enteredPassword, result[0].password);
    }

    async changePassword(id, enteredPassword, conn) {
        const hashedPassword = await this.#hashPassword(enteredPassword);
        const query = `UPDATE ${this.tableName} SET password = ? WHERE id = ?`;
        return await conn.query(query, [hashedPassword, id]);
    }
}

export default EmployeesService;