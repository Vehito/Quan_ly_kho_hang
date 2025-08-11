<template>
    <div class="page">
        <FilterMenu
            :product-fields="true"
            :time-fields="true"
            :supplier-fields="true"
            :customer-fields="true"
            @update:values="updateData"
        />
        <div class="row mt-2">
            <div v-for="(card, index) in cards" class="col" :key="index">
                <LoadingScreen v-if="card.isVisiable" :is-loading="card.isLoading.value">
                    <Card
                        :header-title="card.cardHeader"
                        :card-text="number_heplerUtil.getFormattedNumber(card.cardText.value)"
                        :class-card="card.cardClass"
                        :class-text="card.classText"
                    />
                </LoadingScreen>
            </div>
        </div>
        <div class="mb-3 shadow chart">
            <div>
                <h6 class="text-center">{{ titleChart }}</h6>
                <BarChart :data="chartObject" 
                    :is-loading="isLoading.importShipments.value || isLoading.exportShipments.value"
                />
            </div>
        </div>
        <hr>

        <h4 class="text-center mt-2">Tình hình lợi nhuận theo mặt hàng</h4>
        <div class="table-container mt-1 shadow">
            <div v-if="tableContent.data.value.length===0" class="text-center">
                <h5>Không có thông tin</h5>
            </div>
            <table v-else class="table table table-bordered table-hover bordered">
                <thead class="thead-light">
                    <tr class="thead-light align-items-center">
                        <th 
                            scope="col"
                            v-for="(tableHeader, index) in tableContent.tableHeaders.upper"
                            :key="index"
                            :rowspan="tableHeader.rowspan"
                            :colspan="tableHeader.colspan"
                            class="text-center"
                        >
                            {{ tableHeader.name }}
                        </th>
                    </tr>
                    <tr class="thead-light">
                        <th
                            scope="col"
                            v-for="(tableHeader, index) in tableContent.tableHeaders.lower"
                            :key="index"
                            :rowspan="tableHeader.rowspan"
                            :colspan="tableHeader.colspan"
                        >
                            {{ tableHeader.name }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(tableRow, index) in tableContent.data.value"
                        :key="index"
                    >
                        <td
                            v-for="(key, index) in tableContent.tableRows"
                            :key="index"
                        >
                            <span 
                            >
                                {{ tableRow[key] }}
                            </span>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
// components
import { onMounted, ref} from 'vue';
import BarChart from '@/components/charts/BarChart.vue';
import Card from '@/components/Card.vue';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import FilterMenu from '@/components/FilterMenu.vue';

// controller
import ShipmentsController from '@/controllers/shipments.controller';
const importShipmentController = new ShipmentsController(true);
const exportShipmentController = new ShipmentsController(false);

// more
import { ChartObject, DataSets } from '@/components/charts/ChartObject';
import date_helperUtil from '@/utils/date_helper.util';
import number_heplerUtil from '@/utils/number_hepler.util';
import { ExportShipment, ImportShipment } from '@/models/shipments.model';

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
const conditions = {start: null, end: null, product_id: null, supplier_id: null, customer_id: null};
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
// product_map[product_id] = index;
let product_map = [];
// table_data = [
//      {id: 0, name: '', ex_quantity: 0, ex_price: 0, 
//       im_quantity: 0, im_average_price: 0, im_apperent: 0,
//       ex_apperent: 0, im_total: 0, ex_total: 0}
// ]
let table_data = [];
const tableContent = {
    tableHeaders: {
        upper: [
            {name: 'Mã mặt hàng', colspan: 1, rowspan: 2},
            {name: 'Tên mặt hàng', colspan: 1, rowspan: 2},
            {name: 'Bán hàng', colspan: 3, rowspan: 1},
            {name: 'Giá vốn', colspan: 2, rowspan: 1}, 
            {name: 'Lợi nhuận', colspan: 2, rowspan: 1},
            {name: 'Tỷ suất lợi nhuận', colspan: 1, rowspan: 2},
        ],
        lower: [
            {name: 'Số lượng', colspan: 1, rowspan: 1},
            {name: 'Đơn giá T.Bình', colspan: 1, rowspan: 1},
            {name: 'Số tiền', colspan: 1, rowspan: 1},
            {name: 'Đơn giá T.Bình', colspan: 1, rowspan: 1},
            {name: 'Số tiền', colspan: 1, rowspan: 1},
            {name: 'Đơn giá', colspan: 1, rowspan: 1},
            {name: 'Số tiền', colspan: 1, rowspan: 1},
        ]
    },
    tableRows: ['id', 'name', 'ex_quantity', 'ex_average_price', 'ex_total',
        'im_average_price', 'im_total', 'profit_price', 'profit_total', 'rate_of_profit'],
    data: ref([])

};

// func loading
async function getImportShipment() {
    try {
        isLoading.importShipments.value = true;
        importShipments.value = await importShipmentController.queryAll(conditions, true);
        totals.import_total.value = importShipments.value.reduce(
            (accumulator, currentValue) => Number(accumulator) + Number(currentValue.total), 0);
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
        getChartObject();
        getTableData();
    } catch (error) {
        error?.showAlert();
    }
}

// func
function getChartObject() {
    product_map = [];
    table_data = [];
    const labels = [];
    const importDataSets = new DataSets({
        label: 'Nhập vào', backgroundColor: 'blue', data: []
    });
    const exportDataSets = new DataSets({
        label: 'Bán vào', backgroundColor: 'green', data: []
    });
    for (const shipment of importShipments.value) {
        for (const item of shipment.listItem) {
            const index = product_map[item.product_id]
            if(!Number.isInteger(index)) {
                // datasets
                labels.push(item.product_name);
                importDataSets.data.push(item.price*item.quantity);
                exportDataSets.data.push(0);
                // table
                table_data.push({
                    id: item.product_id, im_quantity: item.quantity, name: item.product_name,
                    im_average_price: item.price, ex_quantity: 0,
                    ex_average_price: 0, im_apperent: 1, ex_apperent: 0,
                    im_total: item.price*item.quantity, ex_total: 0,
                });
                // map
                product_map[item.product_id] = importDataSets.data.length-1;
            } else {
                // datasets
                importDataSets.data[index] += item.price*item.quantity;
                // table
                table_data[index].im_apperent++;
                table_data[index].im_average_price += item.price;
                table_data[index].im_total += item.price*item.quantity;
            }
        }
    }
    for (const shipment of exportShipments.value) {
        for (const item of shipment.listItem) {
            const index = product_map[item.product_id];
            if(!Number.isInteger(index)) {
                // datasets
                labels.push(item.product_name);
                importDataSets.data.push(0);
                exportDataSets.data.push(item.price*item.quantity);
                // table
                table_data.push({
                    id: item.product_id, ex_quantity: item.quantity, name: item.product_name,
                    ex_average_price: item.price, im_quantity: 0,
                    im_average_price: 0, im_apperent: 0, ex_apperent: 1,
                    ex_total: item.price*item.quantity, im_total: 0,
                });
                // map
                product_map[item.product_id] = importDataSets.data.length-1;
            } else {
                //datasets
                exportDataSets.data[index] += item.price*item.quantity;
                // table
                table_data[index].ex_quantity += item.quantity;
                table_data[index].ex_apperent++;
                table_data[index].ex_average_price += item.price;
                table_data[index].ex_total += item.price*item.quantity;
            }
        }
    }
    chartObject.value = new ChartObject({labels: labels, datasets: [importDataSets, exportDataSets]});
}
function getTableData() {
    tableContent.data.value = table_data.map((row) => {
        if (row.ex_apperent > 0) {
            row.ex_average_price = row.ex_average_price / row.ex_apperent;
        }
        if (row.im_apperent > 0) {
            row.im_average_price = row.im_average_price / row.im_apperent;
        }

        // Lưu các giá trị số học vào biến tạm để tính toán
        const exTotal = row.ex_total;
        const imTotal = row.im_total;
        const exAvg = row.ex_average_price;
        const imAvg = row.im_average_price;

        row.profit_price = (exAvg - imAvg).toLocaleString('vi-VN');
        row.profit_total = (exTotal - imTotal).toLocaleString('vi-VN');
        row.rate_of_profit = `${(((exTotal - imTotal) * 100) / (exTotal + imTotal)).toFixed(0)}%`;

        // Cuối cùng mới định dạng lại các trường số
        row.ex_total = exTotal.toLocaleString('vi-VN');
        row.im_total = imTotal.toLocaleString('vi-VN');
        row.ex_average_price = exAvg.toLocaleString('vi-VN');
        row.im_average_price = imAvg.toLocaleString('vi-VN');

        return row;
    })
}

onMounted(async () => {
    const { start, end } = date_helperUtil.getPeriod('month');
    conditions.start = date_helperUtil.formatDateForMySQL(start);
    conditions.end = date_helperUtil.formatDateForMySQL(end);
    titleChart.value = `Biểu đồ từ ${conditions.start.split(' ')[0]} đến ${conditions.end.split(' ')[0]}`
    await getImportShipment();
    await getExportShipment();
    getChartObject();
    getTableData();
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

tr {
    border: green;
}
</style>