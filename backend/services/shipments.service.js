import Service from "./service.js";

class ShipmentsService extends Service {
    constructor(isImport) {
        super(isImport ? "import_shipments" : "export_shipments");
        this.items = isImport ? 'import_items' : 'export_items';
        this.object = isImport ? "supplier" : "customer";
        this.isImport = isImport;
    }

    #extractShipmentData(payload) {
        const shipment = {
            id: payload.id,
            [`${this.object}_id`]: payload[`${this.object}_id`],
            created_at: payload.created_at ?? new Date(),
            created_by: payload.created_by,
            description: payload.description ?? null
        }
        Object.keys(shipment).forEach(
            (key) => shipment[key] === undefined && delete shipment[key]
        );
        return shipment;
    }

    async insert(payload, conn) {
        const shipment = this.#extractShipmentData(payload);
        const [result] = await conn.query(
            `INSERT INTO ${this.tableName} (${this.object}_id, created_at, created_by, description)
            VALUES (?, ?, ?, ?)`,
            [shipment[`${this.object}_id`], shipment.created_at, shipment.created_by, shipment.description]
        );
        return {
            id: result.insertId,
            ...result
        };
    }

    async query(filter, conn) {
        const { clauses, values } = this.getQueryClauses(filter, this.tableName);
        let query = `SELECT ${this.tableName}.*,
            ${this.object}s.name AS ${this.object}_name, employees.name AS employee_name
            FROM ${this.tableName}`;
        query += ` JOIN ${this.object}s ON ${this.tableName}.${this.object}_id = ${this.object}s.id`;
        query += ` JOIN employees ON ${this.tableName}.created_by = employees.id`;
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        const [rows] = await conn.query(query, values);
        return rows;
    }

    async queryForReport(filter, conn) {
        const { clauses, values } = this.#getConditionsForReport(filter);
        const itemTable = this.isImport ? 'import_items' : 'export_items';
        const json_object = this.isImport 
            ? `JSON_OBJECT(
                        'shipment_id', ${itemTable}.shipment_id,
                        'product_id', ${itemTable}.product_id,
                        'mfg', ${itemTable}.mfg,
                        'exp', ${itemTable}.exp,
                        'product_name', products.name,
                        'quantity', ${itemTable}.quantity,
                        'stoke', ${itemTable}.stoke,
                        'price', ${itemTable}.price
                    )`
            : `JSON_OBJECT(
                        'shipment_id', ${itemTable}.shipment_id,
                        'product_id', ${itemTable}.product_id,
                        'product_name', products.name,
                        'import_shipment_id', ${itemTable}.import_shipment_id,
                        'mfg', import_items.mfg,
                        'exp', import_items.exp,
                        'quantity', ${itemTable}.quantity,
                        'price', ${itemTable}.price
                    )`
        let query = `SELECT 
                ${this.tableName}.*,
                ${this.object}s.name AS ${this.object}_name,
                employees.name AS employee_name,
                JSON_ARRAYAGG(
                    ${json_object}
                ) AS listItem,
                SUM(${itemTable}.quantity * ${itemTable}.price) AS total
            FROM ${this.tableName}
            JOIN ${itemTable} ON ${this.tableName}.id = ${itemTable}.shipment_id
            JOIN ${this.object}s ON ${this.tableName}.${this.object}_id = ${this.object}s.id
            JOIN products ON ${itemTable}.product_id = products.id
            JOIN employees ON ${this.tableName}.created_by = employees.id`;
        if(!this.isImport) {
            query += `\nJOIN import_items ON export_items.product_id = import_items.product_id AND export_items.import_shipment_id = import_items.shipment_id`
        }
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        query += ` GROUP BY ${this.tableName}.id`
        const [rows] = await conn.query(query, values);
        rows
        return rows;
    }

    #getConditionsForReport(filter) {
        if(filter.id) {
            return {
                clauses: `${this.tableName}.id = ?`,
                values: [filter.id]
            }
        }
        const keys = ['product_id', 'customer_id', 'supplier_id'];
        let {clauses, values} = this.getQueryArrClauses(filter, this.items, keys);
        if(filter.start && filter.end) {
            clauses += ` ${clauses ? 'AND' : ''} ${this.tableName}.created_at BETWEEN ? AND ?`;
            values.push(filter.start, filter.end);
        }
        return {
            clauses: clauses,
            values
        }
    }
}

export default ShipmentsService;