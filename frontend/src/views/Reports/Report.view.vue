<template>
    <div class="page">
        <div class="row mt-1">
            <div v-for="field in timeFields" class="col-lg-3 col shadow-sm fields mr-3 mt-2">
                <FormFields
                    :label="field.label"
                    :type="field.type"
                    :model-value="field.modelValue"
                    :placeholder="field.placeholder"
                    :options="field.options"
                    :disabled="field.disabled?.value"
                    :name="field.name"
                    @update:model-value="field.updateModelValue"
                />
            </div>
            <button @click="handleSubmit"
                 class="btn btn-outline-success mt-2 lietke col-lg-2 col" type="button">
                Liệt kê
            </button>
        </div>
        <hr>
        <ButtonCollapse
            :btn-texts="collapses.btnTexts"
            :btn-classes="collapses.btnClasses"
            :ids="collapses.ids">
            <template #default="{ index }">
                <FormFields
                    :label="checkboxFields[index].label"
                    :type="checkboxFields[index].type"
                    :is-loading="checkboxFields[index].isLoading.value"
                    :name="checkboxFields[index].name"
                    :options="checkboxFields[index].options.value"
                    @update:model-value="checkboxFields[index].updateModelValue"
                />
            </template>
        </ButtonCollapse>
        <div class="row mt-2">
            <div class="col-lg-3 col-12">
                <div v-for="(card, index) in cards" :key="index" class="row-lg">
                    <LoadingScreen v-if="card.isVisiable" :is-loading="card.isLoading.value">
                        <Card
                            :header-title="card.cardHeader"
                            :card-text="number_heplerUtil.getCurrencyFormat(card.cardText.value)"
                            :class-card="card.cardClass"
                            :class-text="card.classText"
                        />
                    </LoadingScreen>
                </div>
            </div>
            <div class="col-lg-9 col-12 mb-5 shadow chart">
                <div>
                    <h6>{{ titleChart }}</h6>
                    <LineChart :data="chartObject" 
                        :is-loading="isLoading.importShipments.value || isLoading.exportShipments.value"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// components
import { onMounted, ref } from 'vue';
import LineChart from '@/components/charts/LineChart.vue';
import Card from '@/components/Card.vue';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import FormFields from '@/components/forms/FormFields.vue';
import ButtonCollapse from '@/components/ButtonCollapse.vue';

// controller
import ShipmentsController from '@/controllers/shipments.controller';
import suppliersController from '@/controllers/suppliers.controller';
import productsController from '@/controllers/products.controller';
import customersController from '@/controllers/customers.controller';
const importShipmentController = new ShipmentsController(true);
const exportShipmentController = new ShipmentsController(false);

// more
import { ChartObject, DataSets } from '@/components/charts/ChartObject';
import date_helperUtil from '@/utils/date_helper.util';
import number_heplerUtil from '@/utils/number_hepler.util';
import { ExportShipment, ImportShipment } from '@/models/shipments.model';

// ref
const isLoading = {
    product: ref(true),
    customer: ref(true),
    supplier: ref(true),
    importShipments: ref(true),
    exportShipments: ref(true)
};
const chartObject = ref(new ChartObject({}));
const importShipments = ref([new ImportShipment({})]);
const exportShipments = ref([new ExportShipment({})]);
const period = {start: ref(new Date()), end: ref(new Date()), range: ref([])};
const isImport = ref(null);
const totals = {import_total: ref(0), export_total: ref(0)};
const products = ref([]);
const customers = ref([]);
const suppliers = ref([]);
const titleChart = ref('');

// var
let filteredProductIds = [];
let filteredCustomerIds = [];
let filteredSupplierIds = [];
const cards = 
    [{
        cardHeader: 'Tổng nhập',
        cardText: totals.import_total,
        cardClass: 'border-primary',
        classText: 'text-center text-primary h2',
        isLoading: isLoading.importShipments,
        isVisiable: (isImport.value === true || isImport.value === null)
    },
    {
        cardHeader: 'Tổng xuất',
        cardText: totals.export_total,
        cardClass: 'border-success',
        classText: 'text-center text-success h2',
        isLoading: isLoading.exportShipments,
        isVisiable: (isImport.value === false || isImport.value === null)
}];
const periods = [
    {id: 'month', name: "Tháng hiện tại"},
    {id: 'quarter', name: "Quý hiện tại"},
    {id: 'year', name: "Năm hiện tại"},
    {id: 'custom', name: "--Tự chọn--"},
];
const timeFields = [
    { 
        label: 'Khoảng thời gian',
        type: "select",
        modelValue: 'month',
        placeholder: 'Chọn khoảng thời gian',
        options: periods,
        name: "period",
        updateModelValue: (value) => {
            handlePeriodField(value);
        }
    },
    {
        label: 'Thời gian bắt đầu',
        type: "date",
        modelValue: null,
        placeholder: 'Chọn thời gian bắt đầu',
        name: "start",
        disabled: ref(true),
        updateModelValue: (value) => {
            period.start.value = value;
        }
        
    },
    {
        label: 'Thời gian kết thúc',
        type: "date",
        modelValue: null,
        placeholder: 'Chọn thời gian kết thúc',
        name: "end",
        disabled: ref(true),
        updateModelValue: (value) => {
            period.end.value = value;
        }
        
    }
];
const checkboxFields = [
    {
        label: 'Sản phẩm',
        type: 'checkbox',
        isLoading: isLoading.product,
        name: 'products',
        options: products,
        updateModelValue(selectedValue) {
            const {value, index} = selectedValue;
            filteredProductIds[index] = value;
        }
    },
    {
        label: 'Khách hàng',
        type: 'checkbox',
        isLoading: isLoading.customer,
        name: 'customers',
        options: customers,
        updateModelValue(selectedValue) {
            const {value, index} = selectedValue;
            filteredCustomerIds[index] = value;
        }
    },
    {
        label: 'Nhà cung cấp',
        type: 'checkbox',
        isLoading: isLoading.supplier,
        name: 'suppliers',
        options: suppliers,
        updateModelValue(selectedValue) {
            const {value, index} = selectedValue;
            filteredSupplierIds[index] = value;
        }
    },
];
const collapses = {
    btnClasses: ['btn-light border', 'btn-light border', 'btn-light border'],
    btnTexts: ['Sản phẩm', 'Khách hàng', 'Nhà cung cấp'],
    ids: ['products', 'customers', 'suppliers']
};

// func loading
async function getProducts() {
    try {
        isLoading.product.value = true;
        const result = await productsController.queryAll({});
        products.value = [{id: -1, name: 'Tất cả', checked: true}, ...result];
    } catch (error) {
        error?.showError();
    } finally {
        isLoading.product.value = false;
    }
}
async function getCustomers() {
    try {
        isLoading.customer.value = true;
        const result = await customersController.queryAll({});
        customers.value = [{id: -1, name: 'Tất cả', checked: true}, ...result]
    } catch (error) {
        error?.showError();
    } finally {
        isLoading.customer.value = false;
    }
}
async function getSuppliers() {
    try {
        isLoading.supplier.value = true;
        const result = await suppliersController.queryAll({});
        suppliers.value = [{id: -1, name: 'Tất cả', checked: true}, ...result];
    } catch (error) {
        error?.showError();
    } finally {
        isLoading.supplier.value = false;
    }
}
async function getImportShipment() {
    try {
        isLoading.importShipments.value = true;
        const conditions = getObjectCondition(true);
        importShipments.value = await importShipmentController.queryAll(conditions, true);
        totals.import_total.value = importShipments.value.reduce(
            (accumulator, currentValue) => Number(accumulator) + Number(currentValue.total), 0);
        getChartObject(importShipments.value);
    } catch(error) {
        error?.showError();
    } finally {
        isLoading.importShipments.value = false;
    }
}
async function getExportShipment() {
    try {
        isLoading.exportShipments.value = true;
        const conditions = getObjectCondition(false);
        exportShipments.value = await exportShipmentController.queryAll(conditions, true);
        totals.export_total.value = exportShipments.value.reduce(
            (accumulator, currentValue) => Number(accumulator) + Number(currentValue.total), 0);
        getChartObject(exportShipments.value);
    } catch (error) {
        error?.showError();
    } finally {
        isLoading.exportShipments.value = false;
    }
}
async function handleSubmit() {
    titleChart.value = `Biểu đồ từ ${ date_helperUtil.getStringDate(period.start.value) } đến ${ date_helperUtil.getStringDate(period.end.value) }`;
    if(isImport.value===true) {
        await getImportShipment();
    } else if(isImport.value===false) {
        await getExportShipment();
    } else {
        await getImportShipment();
        await getExportShipment();
    }
}

// func
function getObjectCondition(isImport = false) {
    let conditions = {};
    // products
    if (filteredProductIds[0]!==-1) {
        conditions.product_id = filteredProductIds.map((id) => {
            if(id) return id;});
    }
    // object
    const key = isImport ? 'customer_id' : 'supplier_id';
    const filteredObjectIds = isImport ? filteredSupplierIds : filteredCustomerIds;
    if (filteredObjectIds[0]!==-1) {
        conditions[key] = filteredObjectIds.value.map(id => id);
    }
    // date
    conditions.start = date_helperUtil.formatDateForMySQL(period.start.value);
    conditions.end = date_helperUtil.formatDateForMySQL(period.end.value);
    return conditions;
}
function getChartObject() {
    let finalDataSets = [];
    let finalLabels = [];
    if(isImport.value===null || isImport.value===true) {
        const { dataSets, range } = date_helperUtil
            .getDataSetByRange(importShipments.value, period.start.value, period.end.value, 'total', 'created_at');
        finalDataSets.push(new DataSets({label: 'Đơn nhập', data: dataSets, backgroundColor: 'blue'}));
        finalLabels = range;
    }
    if(isImport.value===null || isImport.value===false) {
        const { dataSets, range } = date_helperUtil
            .getDataSetByRange(exportShipments.value, period.start.value, period.end.value, 'total', 'created_at');
        finalDataSets.push(new DataSets({label: 'Đơn xuất', data: dataSets, backgroundColor: 'green'}));
        finalLabels = range;
    }
    chartObject.value.datasets = finalDataSets;
    chartObject.value.labels = finalLabels;
}
function handlePeriodField(value) {
    if(value !== 'custom') {
        const { start, end, range } = date_helperUtil.getPeriod(value);
        period.start.value = start;
        period.end.value = end;
        period.range.value = range;
        timeFields[1].disabled.value = true;
        timeFields[2].disabled.value = true;
    } else {
        timeFields[1].disabled.value = false;
        timeFields[2].disabled.value = false;
    }
}

onMounted(async () => {
    const { start, end, range } = date_helperUtil.getPeriod('month');
    period.start.value = start;
    period.end.value = end;
    period.range.value = range;
    titleChart.value = `Biểu đồ từ ${ date_helperUtil.getStringDate(period.start.value) } đến ${ date_helperUtil.getStringDate(period.end.value) }`;
    await getProducts();
    filteredProductIds[0] = -1;
    await getCustomers();
    filteredCustomerIds[0] = -1;
    await getSuppliers();
    filteredSupplierIds[0] = -1;
    await getImportShipment();
    await getExportShipment()
});

</script>

<style scoped>
.chart {
    border: .5px solid gray;
    border-radius: 20px;
}
.fields {
    border: .5px solid rgb(128, 128, 128, .5);
    border-radius: 10px;
    padding: 10px;
    width: fit-content;
}
.lietke {
    height: 50px;
    width: 80px;
}
#list-item-4 {
    height: 10px;
}
.scrollspy-example {
    position: relative;
}
</style>