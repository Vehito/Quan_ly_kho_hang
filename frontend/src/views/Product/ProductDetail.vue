<script setup>
// components
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import CustomTable from '@/components/CustomTable.vue';
import FilterMenu from '@/components/FilterMenu.vue';
import FormFields from '@/components/forms/FormFields.vue';
import ButtonCollapse from '@/components/ButtonCollapse.vue';
import Pagination from '@/components/Pagination.vue';

// controllers
import productsController from '@/controllers/products.controller';
import ShipmentsController from '@/controllers/shipments.controller';
const importShipmentController = new ShipmentsController(true);
const exportShipmentController = new ShipmentsController(false);

// more
import { Product } from '@/models/products.model';
import { ImportShipment } from '@/models/shipments.model';
import { computed, onMounted, ref, watch } from 'vue';
import date_helperUtil from '@/utils/date_helper.util';
import router from '@/router';
const props = defineProps({
    id: { type: String, required: true }
});

// ref
const product = ref(Product.getEmptyObject());
const importShipment = ref([new ImportShipment(true)]);
const numberOfImportShipment = ref(0);
const exportShipment = ref([new ImportShipment(false)]);
const numberOfExportShipment = ref(0);
const isLoading = {
    product: ref(true), import_shipments: ref(true),
    export_shipments: ref(true), import_number: ref(0),
    export_number: ref(0)
};

// var
const importRows = computed(
    () => importShipment.value.flatMap(
        (shipment) => shipment.listItem
            .filter(item => item.product_id == props.id)
            .map(item => ({
                id: shipment.id,
                product_name: item.product_name,
                price: item.formatted_price,
                stoke: item.stoke,
                text_mfg: item.text_mfg,
                text_exp: item.text_exp
            }))
    )
)
const exportRows = computed(
    () => exportShipment.value.flatMap(
        (shipment) => shipment.listItem
            .filter(item => item.product_id == props.id)
            .map(item => ({
                id: shipment.id,
                product_name: item.product_name,
                price: item.formatted_price,
                quantity: item.quantity,
                text_mfg: item.text_mfg,
                text_exp: item.text_exp
            }))
    )
)
const conditions = {
    import: {
        product_id: props.id,
        start: undefined, end: undefined,
//      {start: undefined, end: undefined}
        mfg: undefined,
//      {start: undefined, end: undefined}
        exp: undefined,
        offset: 0,
        limit: 10,
    },
    export: { product_id: props.id, start: undefined, 
        end: undefined, offset: 0, limit: 10 }
};
const tableContent = {
    import: {
        tableHeaders: [
            { name: 'Mã đơn hàng', key: 'id' },
            { name: 'Sản phẩm', key: 'product_name' },
            { name: 'Đơn giá nhập', key: 'price' },
            { name: 'Tồn kho', key: 'stoke' }, 
            { name: 'NSX', key: 'text_mfg' },
            { name: 'HSD', key: 'text_exp' }
        ],
    },
    export: {
        tableHeaders: [
            { name: 'Mã đơn hàng', key: 'id' },
            { name: 'Sản phẩm', key: 'product_name' },
            { name: 'Đơn giá xuất', key: 'price' },
            { name: 'Số lượng', key: 'quantity' },
            { name: 'NSX', key: 'text_mfg' },
            { name: 'HSD', key: 'text_exp' }
        ],
    },
};
const mfg = { start: undefined, end: undefined };
const exp = { start: undefined, end: undefined };
const importFileds = [
    { 
        label: 'Điểm đầu NSX',
        type: "date",
        modelValue: null,
        placeholder: 'Chọn thời gian bắt đầu',
        name: "mfg_start",
        updateModelValue: (value) => {
            mfg.start = value;
        }
    },
    { 
        label: 'Điểm cuối NSX',
        type: "date",
        modelValue: null,
        placeholder: 'Chọn thời gian cuối',
        name: "mfg_end",
        updateModelValue: (value) => {
            mfg.end = value;
        }
    },
    { 
        label: 'Điểm đầu HSD',
        type: "date",
        modelValue: null,
        placeholder: 'Chọn thời gian bắt đầu',
        name: "exp_start",
        updateModelValue: (value) => {
            exp.start = value;
        }
    },
    { 
        label: 'Điểm cuối HSD',
        type: "date",
        modelValue: null,
        placeholder: 'Chọn thời gian cuối',
        name: "exp_end",
        updateModelValue: (value) => {
            exp.end = value;
        }
    },
]
const importTableTitle = ref('');
const exportTableTitle = ref('');

// asyn
async function loadProduct() {
    try {
        isLoading.product.value = true;
        product.value = await productsController.queryById(props.id);
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.product.value = false;
    }
}
async function loadNumberOfImportShipment() {
    const { limit, offset, ...filter } = conditions.import;
    conditions.import.offset = 0;
    try {
        isLoading.import_number.value = true;
        numberOfImportShipment.value = await importShipmentController.queryCount(filter);
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.import_number.value = false;
    }
}
async function loadImportShipments() {
    try {
        isLoading.import_shipments.value = true;
        importShipment.value = await importShipmentController.queryAll(conditions.import, true);
        importTableTitle.value = `Bảng từ ngày ${date_helperUtil.getStringDate(conditions.import.start)} đến ${date_helperUtil.getStringDate(conditions.import.end)}`
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.import_shipments.value = false;
    }
}
async function changePageImport(index) {
    conditions.import.offset = 10 * (index - 1);
    await loadImportShipments();
}
async function updateImportData(values) {
    conditions.import.start = date_helperUtil.formatDateForMySQL(values.start);
    conditions.import.end = date_helperUtil.formatDateForMySQL(values.end);

    if(mfg.start && mfg.end) {
        conditions.import.mfg = {
            start: date_helperUtil.formatDateForMySQL(mfg.start+' 00:00:00'),
            end: date_helperUtil.formatDateForMySQL(mfg.end+' 00:00:00')
        };
    } else {
        conditions.import.mfg = undefined;
    }

    if(exp.start && exp.end) {
        conditions.import.exp = {
            start: date_helperUtil.formatDateForMySQL(exp.start+' 00:00:00'),
            end: date_helperUtil.formatDateForMySQL(exp.end+' 00:00:00')
        };
    } else {
        conditions.import.exp = undefined;
    }

    await loadNumberOfImportShipment();
    await loadImportShipments();
}
async function loadNumberOfExportShipment() {
    const { limit, offset, ...filter } = conditions.export;
    conditions.export.offset = 0;
    try {
        isLoading.export_number.value = true;
        numberOfExportShipment.value = await exportShipmentController.queryCount(filter);
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.export_number.value = false;
    }
}
async function loadExportShipments() {
    try {
        isLoading.export_shipments.value = true;
        exportShipment.value = await exportShipmentController.queryAll(conditions.export, true);
        exportTableTitle.value = `Bảng từ ngày ${date_helperUtil.getStringDate(conditions.export.start)} đến ${date_helperUtil.getStringDate(conditions.export.end)}`
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.export_shipments.value = false;
    }
}
async function changePageExport(index) {
    conditions.export.offset = 10 * (index - 1);
    await loadExportShipments();
}
async function updateExportData(values) {
    conditions.export.start = date_helperUtil.formatDateForMySQL(values.start);
    conditions.export.end = date_helperUtil.formatDateForMySQL(values.end);

    if(mfg.start && mfg.end) {
        conditions.export.mfg = {
            start: date_helperUtil.formatDateForMySQL(mfg.start+' 00:00:00'),
            end: date_helperUtil.formatDateForMySQL(mfg.end+' 00:00:00')
        };
    } else {
        conditions.export.mfg = undefined;
    }

    if(exp.start && exp.end) {
        conditions.export.exp = {
            start: date_helperUtil.formatDateForMySQL(exp.start+' 00:00:00'),
            end: date_helperUtil.formatDateForMySQL(exp.end+' 00:00:00')
        };
    } else {
        conditions.export.exp = undefined;
    }

    await loadNumberOfExportShipment();
    await loadExportShipments();
}

onMounted(async () => {
    const { start, end } = date_helperUtil.getPeriod('month');
    const sqlStart = date_helperUtil.formatDateForMySQL(start);
    const sqlEnd = date_helperUtil.formatDateForMySQL(end);
    conditions.import.start = sqlStart;
    conditions.import.end = sqlEnd;
    conditions.export.start = sqlStart;
    conditions.export.end = sqlEnd;

    await loadProduct();
    await loadNumberOfImportShipment();
    await loadImportShipments();
    await loadNumberOfExportShipment();
    await loadExportShipments();
})

</script>

<template>
<div class="page">
    <div class="slot shadow-lg">
        <h3 class="text-center">Chi tiết sản phẩm</h3>
        <LoadingScreen :is-loading="isLoading.product.value">
            <div class="row">
                <div class="col-lg-6">
                    <h4 class="text-center">
                        {{ product.name }}
                    </h4>

                    <div class="text-center img-border">
                        <img class="mt-2" :src="product.img_url" alt="Ảnh sản phẩm"
                            style="height: 300px; width: 300px;"
                        >
                    </div>
                </div>
                <div class="col-lg-6 mt-2">
                    <p class="ml-3"><strong>Mã sản phẩm: </strong>{{ product.id }}</p>
                    <p class="ml-3"><strong>Tên sản phẩm: </strong>{{ product.name }}</p>
                    <p class="ml-3"><strong>Đơn giá: </strong>{{ product.formatted_sale_price }}</p>
                    <p class="ml-3"><strong>Nhà sản xuất: </strong>{{ product.manufacturer }}</p>
                    <p class="ml-3"><strong>Loại sản phẩm: </strong>{{ product.type }}</p>
                    <p class="ml-3"><strong>Đơn vị đo: </strong>{{ product.unit }}</p>
                    <p class="ml-3"><strong>Nguồn gốc: </strong>{{ product.origin }}</p>
                    <p class="ml-3"><strong>Tồn kho: </strong>{{ product.quantity }}</p>
                    <p class="ml-3"><strong>Mô tả: </strong>{{ product.description }}</p>
                </div>
            </div>
        </LoadingScreen>
    </div>

    <div class="slot mt-2 shadow">
        <h3 class="text-center">Lịch sử nhập hàng</h3>
        <ButtonCollapse :btn-classes="['btn btn-outline-dark']" 
            :btn-texts="['Bộ lọc']" :ids="['import_shipments']"
        >
            <template #default="{ index }">
                <FilterMenu :time-fields="true" @update:values="updateImportData"/>
                <div class="row">
                    <div v-for="(field, index) in importFileds" 
                        class="col" :key="index"
                    >
                        <FormFields
                            :label="field.label"
                            :type="field.type"
                            :name="field.name"
                            :model-value="field.modelValue"
                            :placeholder="field.placeholder"
                            @update:model-value="field.updateModelValue"
                        />
                    </div>
                </div>
            </template>
        </ButtonCollapse>
        <div class="mt-2">
            <LoadingScreen :is-loading="isLoading.import_shipments.value">
                <h6 class="text-center">{{ importTableTitle }}</h6>
                <CustomTable
                    :table-headers="tableContent.import.tableHeaders"
                    :table-rows="importRows"
                >
                    <template #custom="{row}">
                        <button class="btn btn-outline-dark"
                            @click="router.push({name: 'import_shipment.detail', params: {id: row.id}})"
                        >
                            Xem chi tiết
                        </button>
                    </template>
                </CustomTable>
            </LoadingScreen>
            <Pagination :is-loading="isLoading.import_number.value"
                :item-quantity="numberOfImportShipment" @on-click:index="changePageImport"
            />
        </div>
    </div>

    <div class="slot mt-5 shadow">
        <h3 class="text-center">Lịch sử xuất hàng</h3>
        <ButtonCollapse :btn-classes="['btn btn-outline-dark']" 
            :btn-texts="['Bộ lọc']" :ids="['export_shipments']"
        >
            <template #default="{ index }">
                <FilterMenu :time-fields="true" @update:values="updateExportData"/>
            </template>
        </ButtonCollapse>
        <div class="mt-5">
            <LoadingScreen :is-loading="isLoading.export_shipments.value">
                <h6 class="text-center">{{ exportTableTitle }}</h6>
                <CustomTable
                    :table-headers="tableContent.export.tableHeaders"
                    :table-rows="exportRows"
                >
                    <template #custom="{row}">
                        <button class="btn btn-outline-dark"
                            @click="router.push({name: 'export_shipment.detail', params: {id: row.id}})"
                        >
                            Xem chi tiết
                        </button>
                    </template>
                </CustomTable>
            </LoadingScreen>
            <Pagination :is-loading="isLoading.export_number.value"
                :item-quantity="numberOfExportShipment" @on-click:index="changePageExport"
            />
        </div>
    </div>
</div>
</template>

<style scoped>
.slot {
    padding: 30px;
    border: .5px solid gray;
    border-radius: 20px;
    width: 100%;
}
.img-border{
    border: .5px gray solid;
    border-radius: 20px;
}
</style>