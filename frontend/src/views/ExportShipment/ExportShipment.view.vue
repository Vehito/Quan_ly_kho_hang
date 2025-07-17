<template>
    <div class="page row">
        <div class="col-12">
            <FilterMenu
                :product-fields="true"
                :time-fields="true"
                :customer-fields="true"
                @update:values="updateData"
            />
        </div>

        <div class="col-12 mt-3">
            <LoadingScreen :is-loading="isLoading">
                <CustomTable 
                    :table-headers="tableHeaders"
                    :table-rows="shipments"
                >
                    <template #custom="{ row }">
                        <button class="btn btn-block btn-info"
                            @click="router.push({ name: 'export_shipment.detail', params: { id: row.id } })"
                        >
                            Xem chi tiết
                        </button>
                    </template>
                </CustomTable>
            </LoadingScreen>
            <Pagination :is-loading="pageLoading" :item-quantity="numberOfItems" @on-click:index="changePage" />
        </div>

        <div class="d-flex">
            <button
                class="btn btn-success"
                @click="router.push({ name: 'export_shipment.create' })">
                Thêm đơn hàng
            </button>
        </div>
    </div>
</template>

<script setup>
import CustomTable from '@/components/CustomTable.vue';
import FilterMenu from '@/components/FilterMenu.vue';
import router from '@/router';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import Pagination from '@/components/Pagination.vue';

import { onMounted, ref } from 'vue';

import ShipmentsController from '@/controllers/shipments.controller';
const shipmentsController = new ShipmentsController(false);

const tableHeaders = [
    { name: "Mã đơn hàng", key: "id" },
    { name: "Khách hàng", key: "customer_name" },
    { name: "Người tạo", key: "employee_name" },
    { name: "Ngày tạo", key: "text_created_at" },
];
const conditions = {start: null, end: null, product_id: null, customer_id: null, limit: 10, offset: 0};

const isLoading = ref(true);
const shipments = ref([]);
const numberOfItems = ref(0);
const pageLoading = ref(true);

async function updateData(values = {}) {
    try {
        isLoading.value = true;
        Object.keys(values).forEach((key) => {
            if(values[key]) {
                conditions[key] = values[key];
            }
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
    await updateData();
}
async function getShipments() {
    try {
        shipments.value = (await shipmentsController.queryAll(conditions, true));
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

onMounted(async () => {
    await getShipments();
    await getCount();
})

</script>