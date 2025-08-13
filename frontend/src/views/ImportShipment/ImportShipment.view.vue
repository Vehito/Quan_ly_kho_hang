<template>
    <div class="page row">
        <div class="col-12">
            <FilterMenu
                :product-fields="true"
                :time-fields="true"
                :supplier-fields="true"
                @update:values="updateData"
            />
        </div>
        <div class="col-12 mt-2">
            <div class="float-right">
                <PDF_Btn
                    :table-headers="PDF_Btn_content.tableHeaders"
                    :load-func="PDF_Btn_content.loadFunc"
                    :file-name="PDF_Btn_content.fileName"
                    :table-title="PDF_Btn_content.tableTitle"
                />
            </div>
        </div>
        <div class="col-12 mt-3">
            <LoadingScreen :is-loading="isLoading">
                <h6 class="text-center">{{ tableTitle }}</h6>
                <CustomTable 
                    :table-headers="tableHeaders"
                    :table-rows="shipments"
                >
                    <template #custom="{ row }">
                        <DropdownBtn
                            :dropdown-items="['Chi tiết đơn hàng', 'Xuất PDF']"
                            @select:value="(selectedAction) => handleAction(selectedAction, row)"
                        >
                            <template #label>
                                <i class="fa-solid fa-bars"></i>
                            </template>
                        </DropdownBtn>
                    </template>
                </CustomTable>
            </LoadingScreen>
            <Pagination :is-loading="pageLoading" :item-quantity="numberOfItems" @on-click:index="changePage" />
        </div>
    </div>
</template>

<script setup>
import CustomTable from '@/components/CustomTable.vue';
import FilterMenu from '@/components/FilterMenu.vue';
import router from '@/router';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import Pagination from '@/components/Pagination.vue';
import { DropdownBtn } from '@/utils/buttons.util';
import PDF_Btn from '@/components/PDF_Btn.vue';

import { onMounted, ref } from 'vue';
import { shipmentPdfExport } from '@/utils/PDF_export';

import ShipmentsController from '@/controllers/shipments.controller';
import date_helperUtil from '@/utils/date_helper.util';
const shipmentsController = new ShipmentsController(true);

const tableHeaders = [
    { name: "Mã đơn hàng", key: "id" },
    { name: "Nhà cung cấp", key: "supplier_name" },
    { name: "Người tạo", key: "employee_name" },
    { name: "Ngày tạo", key: "text_created_at" },
    { name: "Tổng tiền", key: "formatted_total" },
];

const conditions = {start: null, end: null, product_id: null, supplier_id: null, limit: 10, offset: 0};
const PDF_Btn_content = {
    tableHeaders: tableHeaders,
    fileName: 'Danh_sach_don_hang.pdf',
    tableTitle: 'Danh sách đơn nhập',
    loadFunc: async () => {
        const {limit, offset, ...filter} = conditions;
        return await shipmentsController.queryAll({
            start: conditions.start, end: conditions.end,
            product_id: conditions.product_id, supplier_id: conditions.supplier_id
        }, true);
    }
}
const isLoading = ref(true);
const shipments = ref([]);
const numberOfItems = ref(0);
const pageLoading = ref(true);
const tableTitle = ref('');

async function updateData(values = {}) {
    try {
        isLoading.value = true;
        Object.keys(values).forEach((key) => {
            conditions[key] = values[key];
        });
        await getCount();
        shipments.value = await shipmentsController.queryAll(conditions, true);
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.value = false;
    }
}
async function changePage(index) {
    conditions.offset = 10 * (index-1);
    // await updateData();
    shipments.value = await shipmentsController.queryAll(conditions, true);
}
async function getShipments() {
    try {
        shipments.value = (await shipmentsController.queryAll(conditions, true));
        tableTitle.value = `Bảng đơn nhập từ ${conditions.start.split(' ')[0]} đến ${conditions.end.split(' ')[0]}`
    } catch (error) {
        error.showAlert();
    } finally {
        isLoading.value = false;
    }
}
async function getCount() {
    try {
        pageLoading.value = true;
        numberOfItems.value = await shipmentsController.queryCount({
            start: conditions.start, end: conditions.end,
            product_id: conditions.product_id, supplier_id: conditions.supplier_id
        });
    } catch (error) {
        error?.showAlert();
    } finally {
        pageLoading.value = false;
    }
}
async function handleAction(selectedAction, row) {
    switch(selectedAction) {
        case "Chi tiết đơn hàng":
            router.push({ name: 'import_shipment.detail', params: {id: row.id}})
        break;
        case "Xuất PDF":
            shipmentPdfExport(row, [
                { name: 'Sản phẩm', key: 'product_name' },
                { name: 'Số lượng', key: 'quantity' },
                { name: 'Tồn kho', key: 'stoke' },
                { name: 'Ngày sản xuất', key: 'text_mfg' },
                { name: 'Hạn sử dụng', key: 'text_exp' },
                { name: 'Giá mua', key: 'formatted_price' },
            ], true);
        break;
    }
}

onMounted(async () => {
    const { start, end }  = date_helperUtil.getPeriod('month');
    conditions.start = date_helperUtil.formatDateForMySQL(start);
    conditions.end = date_helperUtil.formatDateForMySQL(end);
    await getCount();
    await getShipments();
})

</script>