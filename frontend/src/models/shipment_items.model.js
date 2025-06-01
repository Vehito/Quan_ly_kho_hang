export class ShipmentItem {
    // #shipment_id;
    // #product_id;
    // #quantity;
    // #price; 
    constructor(data) {
        this.shipment_id = data.shipment_id ?? null,
        this.product_id = data.product_id,
        this.quantity = data.quantity,
        this.price = data.price
    }

    // get shipment_id() { 
    //     return this.#shipment_id; 
    // }
    // get product_id() {
    //     return this.#product_id;
    // }
    // get quantity() {
    //     return this.#quantity;
    // }
    // get price() {
    //     return this.#price;
    // }
}

export class ImportItem extends ShipmentItem {
    // #mfg;
    // #exp;
    // #stoke;
    constructor(data) {
        super(data);
        this.mfg = data.mfg,
        this.exp = data.exp,
        this.stoke = data.stoke
    }

    // get mfg() {
    //     return this.#mfg; 
    // }
    // get exp() {
    //     return this.#exp;
    // }
    // get stoke() {
    //     return this.#stoke;
    // }
}

export class ImportItem extends ShipmentItem {
    // #import_shipment_id;

    constructor(data) {
        super(data);
        this.import_shipment_id = data.import_shipment_id
    }

    // get import_shipment_id() {
    //     return this.#import_shipment_id; 
    // }
}