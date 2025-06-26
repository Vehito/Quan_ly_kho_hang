import date_helperUtil from "@/utils/date_helper.util";
import Model from "./model";

class ShipmentsModel extends Model {
    constructor(isImport) {
        super("/api/shipments");
        this.isImport = isImport;
    }

    createIntance(data) {
        return this.isImport ? 
            new ImportShipment(data) : new ExportShipment(data);
    }

    async queryAll(filter = {}) {
        filter.isImport = this.isImport;
        return await super.queryAll(filter);
    }

    async insert(data) {
        data.isImport = this.isImport;
        return await super.insert(data);
    }
}

export default ShipmentsModel;

export class Shipment {
    constructor(data) {
        this.id = data.id ?? null;
        this.created_at = data.created_at ?? new Date();
        this.text_created_at = date_helperUtil.getStringDateTime(this.created_at);
        this.created_by = data.created_by;
        this.employee_name = data.employee_name;
        this.description = data.description ?? null;
    }

    formatDateForMySql() {
        this.created_at = date_helperUtil.formatDateForMySQL(this.created_at);
    }
}

export class ImportShipment extends Shipment{
    static isImport = true;
    constructor(data) {
        super(data);
        this.supplier_id = data.supplier_id;
        this.supplier_name = data.supplier_name;
    }
}

export class ExportShipment extends Shipment {
    static isImport = false;
    constructor(data) {
        super(data);
        this.customer_id = data.customer_id;
    }
}