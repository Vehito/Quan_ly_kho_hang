import date_helperUtil from "@/utils/date_helper.util";
import Model from "./model";
import { ExportItem, ImportItem, ShipmentItem } from "./shipment_items.model";
import number_heplerUtil from "@/utils/number_hepler.util";

class ShipmentsModel extends Model {
    constructor(isImport, extend = '') {
        super(`/api/shipments/${extend}`);
        this.isImport = isImport;
    }

    createIntance(data) {
        return this.isImport ? 
            new ImportShipment(data) : new ExportShipment(data);
    }

    async queryAll(filter = {}) {
        filter.isImport = this.isImport;
        const shipments = await super.insert(filter);
        return shipments.map((shipment) => {
            return this.createIntance(shipment);
        })
    }

    async queryCount(filter = {}) {
        filter.isImport = this.isImport;
        const data = (await this.api.post('/', filter)).data;
        return data;
    }

    async queryById(id, filter = {}) {
        filter.isImport = this.isImport;
        const data = (await this.api.post(`/${id}`, filter)).data;
        if(data.length > 1) {
            return Array.isArray(data) 
                ? data.map((item) => this.createIntance(item)) : [];
        }
        return this.createIntance(data[0]);
    }

    async insert(data) {
        data.isImport = this.isImport;
        return await super.insert(data);
    }

    async queryForReport(filter) {
        filter.isImport = this.isImport;
        return await super.insert(filter);
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
        // this.total = data.total;
        this.listItem = this.buildListItems(data.listItem);
    }

    get total() {
        return this.listItem.reduce(
            (preVal, currVal) => Number(preVal) + (Number(currVal.price)*Number(currVal.quantity)), 0
        );
    }
    get formatted_total() {
        return number_heplerUtil.getFormattedNumber(this.total);
    }

    formatDateForMySql() {
        this.created_at = date_helperUtil.formatDateForMySQL(this.created_at);
    }

    createItemInstance(data) {
        return new ShipmentItem(data);
    }

    buildListItems(dataList) {
        const rawList = Array.isArray(dataList) && dataList.length > 0 ? dataList : [{}];
        return rawList.map(item =>
            item instanceof ShipmentItem ? item : this.createItemInstance(item)
        );
    }
}

export class ImportShipment extends Shipment{
    static isImport = true;
    constructor(data) {
        super(data);
        this.supplier_id = data.supplier_id;
        this.supplier_name = data.supplier_name;
    }

    createItemInstance(data) {
        return new ImportItem(data);
    }
}

export class ExportShipment extends Shipment {
    static isImport = false;
    constructor(data) {
        super(data);
        this.customer_id = data.customer_id;
        this.customer_name = data.customer_name;
    }

    createItemInstance(data) {
        return new ExportItem(data);
    }
}