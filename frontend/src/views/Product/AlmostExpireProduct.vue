<template>
    <div class="page">
        <div class="clearfix">
            <span class="float-right fields">
                <FormFields
                    :label="selectField.label"
                    :name="selectField.name"
                    :model-value="selectField.modelValue"
                    :options="selectField.options"
                    :type="selectField.type"
                    :placeholder="selectField.placeholder"
                    @update:model-value="selectField.updateModelValue"
                />
            </span>
        </div> 
        <div class="mt-3">
            <loading-screen :is-loading="isLoading">
                <h5 class="text-center">Danh sách sản phẩm</h5>
                <CustomTable
                    :table-headers="productTableHeader"
                    :table-rows="productTableRows"
                />
            </loading-screen>
        </div>
        <div class="mt-3">
            <loading-screen :is-loading="isLoading">
                <h5 class="text-center">Bảng đơn nhập</h5>
                <CustomTable
                    :table-headers="tableHeaders"
                    :table-rows="tableRows"
                    :change-columns="changeColumns"
                    :changing-condition="changingCondition"
                >
                    <template #custom="{ row }">
                        <button class="btn btn-outline-dark" 
                            @click="router.push({ name: 'import_shipment.detail', params: { id: row.shipment_id } })"
                        >
                            Xem chi tiết
                        </button>
                    </template>
                </CustomTable>
                <Pagination :item-quantity="importShipments.length" @on-click:index="changePage" />
            </loading-screen>
        </div>
    </div>
</template>

<script setup>
// components
import CustomTable from '@/components/CustomTable.vue';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import FormFields from '@/components/forms/FormFields.vue';
import Pagination from '@/components/Pagination.vue';

// controllers
import ShipmentsController from '@/controllers/shipments.controller';
import { ImportShipment } from '@/models/shipments.model';
const importShipmentController = new ShipmentsController(true);

// more
import { ref, onMounted, computed } from 'vue';
import router from '@/router';
import date_helperUtil from '@/utils/date_helper.util';

// ref
const period = {start: ref(new Date()), end: ref(new Date())};
const isLoading = ref(true);
const importShipments = ref([new ImportShipment({})]);

// var
const pageIndex = { start: 0, end: 10 }
const tableHeaders = [
    { name: "Mã đơn hàng", key: "shipment_id" },
    { name: "Sản phẩm", key: "product_name" },
    { name: "Tồn kho", key: "stoke" },
    { name: "Hạn sử dụng", key: "text_exp" },
];
const tableRows = computed(() => {
    // console.log(1111);
    return importShipments.value
        .slice(pageIndex.start, pageIndex.end)
        .flatMap((shipment) => {
            return shipment.listItem.map((item) => {
                const {shipment_id, product_name, stoke, text_exp} = item
                return {shipment_id, product_name, stoke, text_exp};
            });
        })
});
const changeColumns = ['text_exp'];
function changingCondition(key, value) {
    if(key==='text_exp') {
        return 'text-warning'
    }
}
function changePage(index) {
    pageIndex.start = 10 * (index-1);
    pageIndex.end = pageIndex.start + 10;
}
const productTableHeader = [
    {name: 'STT', key : 'index'},
    {name: 'Mã sản phẩm', key : 'product_id'},
    {name: 'Tên sản phẩm', key : 'product_name'},
    {name: 'Tồn kho', key : 'stoke'},
];
const productTableRows = computed(() => {
    const result = [];

    importShipments.value.forEach((shipment) => {
        shipment.listItem.forEach((item) => {
            const { product_id, product_name, stoke, text_exp } = item;

            const existing = result.find((p) => p.product_id === product_id);
            if (existing) {
                existing.stoke += stoke;
            } else {
                result.push({
                    index: result.length+1,
                    product_id,
                    product_name,
                    stoke,
                });
            }
        });
    });

    return result;
});
const options = [
    {id: 0, name: 'HSD còn 3 tháng'},
    {id: 1, name: 'HSD còn 1 tháng'},
    {id: 2, name: 'Đã hết hạn sử dụng'},
];
const selectField = {
    label: 'Khoảng thời gian HSD',
    type: 'select',
    modelValue: 0,
    placeholder: 'Chọn khoảng thời gian HSD',
    options: options,
    name: 'exp',
    updateModelValue: (value) => handlePeriodSelect(value)
};

// asyn func
async function getImportShipment() {
    try {
        isLoading.value = true;
        importShipments.value = await importShipmentController.queryAll(
            {exp : {
                start: date_helperUtil.formatDateForMySQL(period.start.value), 
                end: date_helperUtil.formatDateForMySQL(period.end.value)
                }, available: true},
            true
        );
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.value = false;
    }
}

// func
async function handlePeriodSelect(selected) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    switch (selected) {
        case 0:
            period.start.value = today;
            period.end.value = new Date(year, month + 4, 0);
        break;
        case 1:
            period.start.value = today;
            period.end.value = new Date(year, month + 1, 0);
        break;
        case 2:
            period.start.value = new Date(2000, 1, 1);
            period.end.value = today;
        break;
        default: return;
    }
    await getImportShipment();
}

onMounted(async () => {
    await handlePeriodSelect(0);
});
</script>