import date_helperUtil from "@/utils/date_helper.util";
import Model from "./model";

class ShipmentItemModel extends Model {
    constructor(isImport) {
        super("/api/shipments/shipment_items");
        this.isImport = isImport;
    }

    createIntance(data) {
        return this.isImport ? 
            new ImportItem(data) : new ExportItem(data);
    }

    async queryAll(filter = {}) {
        filter.isImport = this.isImport;
        return await super.queryAll(filter);
    }
}

export default ShipmentItemModel;

export class ShipmentItem {
    constructor(data) {
        this.shipment_id = data.shipment_id ?? undefined;
        this.product_id = data.product_id;
        this.product_name = data.product_name;
        this.quantity = data.quantity;
        this.price = data.price;
        this.formatted_price = this.price?.toLocaleString('vi-VN');
    }
}

export class ImportItem extends ShipmentItem {
    constructor(data) {
        super(data);
        this.id = this.shipment_id;
        this.mfg = data.mfg;
        this.text_mfg = date_helperUtil.getStringDate(this.mfg);
        this.exp = data.exp;
        this.text_exp = date_helperUtil.getStringDate(this.exp);
        this.stoke = data.stoke;
    }

    get name() {
        return `Tồn kho:${this.stoke}-NSX:${this.text_mfg}-HSD:${this.text_exp}`;
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
        this.id = this.shipment_id;
        this.import_shipment_id = data.import_shipment_id;
        this.mfg = data.mfg;
        this.text_mfg = date_helperUtil.getStringDate(this.mfg);
        this.exp = data.exp;
        this.text_exp = date_helperUtil.getStringDate(this.exp);
    }
}