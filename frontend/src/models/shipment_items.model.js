import date_helperUtil from "@/utils/date_helper.util";

export class ShipmentItem {
    constructor(data) {
        this.shipment_id = data.shipment_id ?? undefined;
        this.product_id = data.product_id;
        this.product_name = data.product_name;
        this.quantity = data.quantity;
        this.price = data.price;
    }
}

export class ImportItem extends ShipmentItem {
    constructor(data) {
        super(data);
        this.mfg = data.mfg,
        this.text_mfg = date_helperUtil.getStringDate(this.mfg);
        this.exp = data.exp,
        this.text_exp = date_helperUtil.getStringDate(this.exp);
        this.stoke = data.stoke
    }

    static getEmptyObject() {
        return new ImportItem({
            shipment_id: null,
            product_id: null
        })
    }

    formatDateForMySql() {
        this.mfg = date_helperUtil.formatDateForMySQL(this.mfg);
        this.exp = date_helperUtil.formatDateForMySQL(this.exp);
    }
}

export class ExportItem extends ShipmentItem {
    constructor(data) {
        super(data);
        this.import_shipment_id = data.import_shipment_id
    }
}