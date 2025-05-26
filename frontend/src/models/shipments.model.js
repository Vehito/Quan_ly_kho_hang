import Model from "./model";

class ShipmentsModel extends Model {
    constructor() {
        super("/api/shipments");
    }

    createIntance(data) {
        return new Shipment(data);
    }
}

export default new ShipmentsModel();

export class Shipment {
    #id;
    #created_at;
    #created_by;
    #description;
    constructor(data) {
        this.#id = data.id ?? null,
        this.#created_at = data.created_at ?? new Date(),
        this.#created_by = data.created_by,
        this.#description = data.description ?? null;
    }

    get id() { 
        return this.#id; 
    }
    get created_at() {
        return this.#created_at;
    }
    get created_by() {
        return this.#created_by;
    }
    get description() {
        return this.#description;
    }
}

export class ImportShipment extends Shipment{
    static isImport = true;
    #supplier_id;
    constructor(data) {
        super(data);
        this.#supplier_id = data.supplier_id;
    }

    get supplier_id() {
        return this.#supplier_id;
    }
}

export class ExportShipment extends Shipment {
    static isImport = false;
    #customer_id;
    constructor(data) {
        super(data);
        this.#customer_id = data.customer_id;
    }

    get customer_id() {
        return this.#customer_id;
    }
}