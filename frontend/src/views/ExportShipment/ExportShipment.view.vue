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
import ShipmentsController from '@/controllers/shipments.controller';
const shipmentsController = new ShipmentsController(false);
import router from '@/router';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import { onMounted, ref } from 'vue';

const tableHeaders = [
    { name: "Mã đơn hàng", key: "id" },
    { name: "Khách hàng", key: "customer_name" },
    { name: "Người tạo", key: "employee_name" },
    { name: "Ngày tạo", key: "text_created_at" },
]

const isLoading = ref(true);
const shipments = ref([]);

async function updateData(values) {
    try {
        isLoading.value = true;
        const conditions = {};
        Object.keys(values).forEach((key) => {
            if(values[key]) {
                conditions[key] = values[key];
            }
        })
        shipments.value = await shipmentsController.queryAll(conditions, true);
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.value = false;
    }
}

async function getShipments() {
    try {
        shipments.value = (await shipmentsController.queryAll());
    } catch (error) {
        error.showAlert();
    } finally {
        isLoading.value = false;
    }
}

onMounted(async () => {
    await getShipments();
})

</script>