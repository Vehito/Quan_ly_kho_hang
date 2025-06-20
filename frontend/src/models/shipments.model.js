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
}

export default ShipmentsModel;

export class Shipment {
    // #id;
    // #created_at;
    // #created_by;
    // #description;
    constructor(data) {
        this.id = data.id ?? null,
        this.created_at = data.created_at ?? new Date(),
        this.created_by = data.created_by,
        this.description = data.description ?? null;
    }

    // get id() { 
    //     return this.#id; 
    // }
    // get created_at() {
    //     return this.#created_at;
    // }
    // get created_by() {
    //     return this.#created_by;
    // }
    // get description() {
    //     return this.#description;
    // }
}

export class ImportShipment extends Shipment{
    static isImport = true;
    constructor(data) {
        super(data);
        this.supplier_id = data.supplier_id;
    }
}

export class ExportShipment extends Shipment {
    static isImport = false;
    constructor(data) {
        super(data);
        this.customer_id = data.customer_id;
    }
}