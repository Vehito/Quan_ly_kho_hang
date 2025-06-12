export class ShipmentItem {
    constructor(data) {
        this.shipment_id = data.shipment_id ?? null,
        this.product_id = data.product_id,
        this.quantity = data.quantity,
        this.price = data.price
    }

}

export class ImportItem extends ShipmentItem {
    constructor(data) {
        super(data);
        this.mfg = data.mfg,
        this.exp = data.exp,
        this.stoke = data.stoke
    }
}

export class ImportItem extends ShipmentItem {
    constructor(data) {
        super(data);
        this.import_shipment_id = data.import_shipment_id
    }
}