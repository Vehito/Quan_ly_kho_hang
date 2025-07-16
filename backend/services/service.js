class Service {
    constructor(tableName, likeClauses = []) {
        this.tableName = tableName;
        this.likeClauses = likeClauses;
    };

    async query(filter, conn) {
        const { limit, offset, ...conditions } = filter;
        const {clauses, values} = this.getQueryClauses(conditions, this.tableName, this.likeClauses);
        let query = `SELECT * FROM ${this.tableName}`;
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        if(limit > 0) {
            query += `\nLIMIT ${limit} ${offset>0 ? ('OFFSET ' + offset) : ''}`
        }
        const [rows] = await conn.query(query, values);
        return rows;
    }

    async queryCount(filter, conn) {
        const { itemLength, ...conditions } = filter;
        const {clauses, values} = this.getQueryClauses(conditions, this.tableName, this.likeClauses);
        let query = `SELECT COUNT(*) AS length FROM ${this.tableName}`;
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        const [rows] = await conn.query(query, values);
        return rows[0].length;
    }

    async queryArr(filter = {}, conn) {
        const {clauses, values} = this.getQueryArrClauses(filter);
        let query = `SELECT * FROM ${this.tableName}`;
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        const [rows] = await conn.query(query, values);
        return rows;
    }

    async update(id, payload, conn) {
        const {clauses, values} = this.getUpdateClauses(payload);
        values.push(id);
        const update = `UPDATE ${this.tableName} SET ${clauses} WHERE id = ?`;
        const [result] = await conn.query(update, values);
        return result;
    }

    async delete(id, conn) {
        const deleteQuery = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const [result] = await conn.query(deleteQuery, id);
        return result;
    }

    getQueryArrClauses(filter, tableName= '', keys = []) {
        const clauses = [];
        const values = [];

        if(tableName != '') tableName += '.';
        const entries = keys.length > 0
            ? keys.map((key) => [key, filter[key]])
            : Object.entries(filter);
        entries.forEach(([key, arr]) => {
            if(Array.isArray(arr) && arr.length > 0) {
                clauses.push(`${tableName + key} IN (${arr.map(() => '?').join(', ')})`);
                values.push(...arr);
            }
        });
        return {
            clauses: clauses.join(' AND '),
            values
        };
    }

    getQueryClauses(filter, tableName = '', likeClauses = []) {
        const clauses = [];
        const values = [];

        if(tableName != '') tableName += '.';
        Object.entries(filter).forEach(([key, val]) => {
            if(likeClauses.includes(key)) {
                clauses.push(`${tableName}${key} LIKE ?`);
                values.push(`%${val}%`);
            } else {
                clauses.push(`${tableName}${key} = ?`);
                values.push(val);
            }
        });
        return {
            clauses: clauses.join(' AND '),
            values
        };
    }

    getUpdateClauses(payload) {
        const clauses = [];
        const values = [];

        Object.entries(payload).forEach(([key, val]) => {
            clauses.push(`${key} = ?`);
            values.push(val);
        });
        return {
            clauses: clauses.join(', '),
            values: values
        }
    }
}

export default Service;