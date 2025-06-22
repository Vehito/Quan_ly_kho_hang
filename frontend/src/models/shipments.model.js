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
}

export default ShipmentsModel;

export class Shipment {
    constructor(data) {
        this.id = data.id ?? null;
        this.created_at = data.created_at ?? new Date();
        this.created_by = data.created_by;
        this.employee_name = data.employee_name;
        this.description = data.description ?? null;
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