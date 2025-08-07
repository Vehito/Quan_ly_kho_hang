<template>
    <div class="page">
        <FilterMenu
            :product-fields="true"
            :time-fields="true"
            :supplier-fields="true"
            :customer-fields="true"
            @update:values="updateData"
        />
        <div class="mt-2">
            <div class="row">
                <div v-for="(card, index) in cards" :key="index" class="col">
                    <LoadingScreen v-if="card.isVisiable" :is-loading="card.isLoading.value">
                        <Card
                            :header-title="card.cardHeader"
                            :card-text="number_heplerUtil.getFormattedNumber(card.cardText?.value)"
                            :class-card="card.cardClass"
                            :class-text="card.classText"
                        />
                    </LoadingScreen>
                </div>
            </div>
            <div class="mt-2 shadow chart">
                <div>
                    <h6 class="text-center">{{ titleChart }}</h6>
                    <LineChart :data="chartObject" 
                        :is-loading="isLoading.importShipments.value || isLoading.exportShipments.value"
                    />
                </div>
            </div>
            <!-- import -->
            <div class="mt-5">
                <LoadingScreen :is-loading="isLoading.importShipments.value">
                    <h5 class="text-center">Bảng đơn nhập</h5>
                    <CustomTable :table-headers="imTableHeaders" :table-rows="importTableRows">
                        <template #custom="{row}">
                            <button class="btn btn-outline-dark"
                                @click="router.push({name: 'import_shipment.detail', params: {id: row.id}})"
                            >
                                Xem chi tiết
                            </button>
                        </template>
                    </CustomTable>
                </LoadingScreen>
                <Pagination :is-loading="isLoading.importShipments.value"
                    :item-quantity="importShipments.length" @on-click:index="importChangePage" />
            </div>
            <!-- export -->
            <div class="mt-5">
                <LoadingScreen :is-loading="isLoading.exportShipments.value">
                    <h5 class="text-center">Bảng đơn xuất</h5>
                    <CustomTable :table-headers="exTableHeaders" :table-rows="exportTableRows">
                        <template #custom="{row}">
                            <button class="btn btn-outline-dark"
                                @click="router.push({name: 'export_shipment.detail', params: {id: row.id}})"
                            >
                                Xem chi tiết
                            </button>
                        </template>
                    </CustomTable>
                </LoadingScreen>
                <Pagination :is-loading="isLoading.exportShipments.value"
                    :item-quantity="exportShipments.length" @on-click:index="exportChangePage" />
            </div>
        </div>
    </div>
</template>

<script setup>
// components
import { computed, onMounted, ref} from 'vue';
import LineChart from '@/components/charts/LineChart.vue';
import Card from '@/components/Card.vue';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import FilterMenu from '@/components/FilterMenu.vue';
import CustomTable from '@/components/CustomTable.vue';
import Pagination from '@/components/Pagination.vue';

// controller
import ShipmentsController from '@/controllers/shipments.controller';
const importShipmentController = new ShipmentsController(true);
const exportShipmentController = new ShipmentsController(false);

// more
import { ChartObject, DataSets } from '@/components/charts/ChartObject';
import date_helperUtil from '@/utils/date_helper.util';
import number_heplerUtil from '@/utils/number_hepler.util';
import { ExportShipment, ImportShipment } from '@/models/shipments.model';
import router from '@/router';

// ref
const isLoading = {
    importShipments: ref(true),
    exportShipments: ref(true)
};
const chartObject = ref(new ChartObject({}));
const importShipments = ref([new ImportShipment({})]);
const exportShipments = ref([new ExportShipment({})]);
const isImport = ref(null);
const totals = {import_total: ref(0), export_total: ref(0)};
const titleChart = ref('');

// var
const countImport = computed(() => importShipments.value.length);
const countExport = computed(() => exportShipments.value.length);
let importIndex = 10;
let exportIndex = 10;
const imTableHeaders = [
    { name: "Mã đơn hàng", key: "id" },
    { name: "Nhà cung cấp", key: "supplier_name" },
    { name: "Người tạo", key: "employee_name" },
    { name: "Ngày tạo", key: "text_created_at" },
    { name: "Tổng tiền", key: "formatted_total" },
];
const exTableHeaders = [
    { name: "Mã đơn hàng", key: "id" },
    { name: "Khách hàng", key: "customer_name" },
    { name: "Người tạo", key: "employee_name" },
    { name: "Ngày tạo", key: "text_created_at" },
    { name: "Tổng tiền", key: "formatted_total" },
];
const importTableRows= computed(()=> {
    let start = importIndex-10;
    if(start<0) start = 0;
    return importShipments.value.slice(start, importIndex);
});
const exportTableRows= computed(()=> {
    let start = exportIndex-10;
    if(start<0) start = 0;
    return exportShipments.value.slice(start, exportIndex);
});
const conditions = {start: null, end: null, product_id: null, supplier_id: null, customer_id: null};
const cards = 
    [
    {
        cardHeader: 'Tổng nhập',
        cardText: totals.import_total,
        cardClass: 'border-primary',
        classText: 'text-center text-primary h2',
        isLoading: isLoading.importShipments,
        isVisiable: (isImport.value === true || isImport.value === null)
    },
    {
        cardHeader: 'Tổng số đơn nhập',
        cardText: countImport,
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
    },
    {
        cardHeader: 'Tổng số đơn xuất',
        cardText: countExport,
        cardClass: 'border-success',
        classText: 'text-center text-success h2',
        isLoading: isLoading.exportShipments,
        isVisiable: (isImport.value === false || isImport.value === null)
    }
];

// func loading
async function getImportShipment() {
    try {
        isLoading.importShipments.value = true;
        importShipments.value = await importShipmentController.queryAll(conditions, true);
        totals.import_total.value = importShipments.value.reduce(
            (accumulator, currentValue) => Number(accumulator) + Number(currentValue.total), 0);
        getChartObject(importShipments.value);
        importIndex = 10;
    } catch(error) {
        error?.showError();
    } finally {
        isLoading.importShipments.value = false;
    }
}
async function getExportShipment() {
    try {
        isLoading.exportShipments.value = true;
        exportShipments.value = await exportShipmentController.queryAll(conditions, true);
        totals.export_total.value = exportShipments.value.reduce(
            (accumulator, currentValue) => Number(accumulator) + Number(currentValue.total), 0);
        getChartObject(exportShipments.value);
        exportIndex = 10;
    } catch (error) {
        error?.showError();
    } finally {
        isLoading.exportShipments.value = false;
    }
}
async function updateData(values = {}) {
    try {
        Object.keys(values).forEach((key) => {
            conditions[key] = values[key];
        });
        titleChart.value = `Biểu đồ từ ${conditions.start.split(' ')[0]} đến ${conditions.end.split(' ')[0]}`;
        await getImportShipment();
        await getExportShipment();
    } catch (error) {
        error?.showAlert();
    }
}

// func
function getChartObject() {
    let finalDataSets = [];
    let finalLabels = [];
    if(isImport.value===null || isImport.value===true) {
        const { dataSets, range } = date_helperUtil
            .getDataSetByRange(importShipments.value, conditions.start, conditions.end, 'total', 'created_at');
        finalDataSets.push(new DataSets({label: 'Đơn nhập', data: dataSets, backgroundColor: 'blue'}));
        finalLabels = range;
    }
    if(isImport.value===null || isImport.value===false) {
        const { dataSets, range } = date_helperUtil
            .getDataSetByRange(exportShipments.value, conditions.start, conditions.end, 'total', 'created_at');
        finalDataSets.push(new DataSets({label: 'Đơn xuất', data: dataSets, backgroundColor: 'green'}));
        finalLabels = range;
    }
    chartObject.value.datasets = finalDataSets;
    chartObject.value.labels = finalLabels;
}
function importChangePage(index) {
    importIndex = 10 * (index-1);
}
function exportChangePage(index) {
    exportIndex = 10 * (index-1);
}

onMounted(async () => {
    const { start, end } = date_helperUtil.getPeriod('month');
    conditions.start = date_helperUtil.formatDateForMySQL(start);
    conditions.end = date_helperUtil.formatDateForMySQL(end);
    titleChart.value = `Biểu đồ từ ${conditions.start.split(' ')[0]} đến ${conditions.end.split(' ')[0]}`
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