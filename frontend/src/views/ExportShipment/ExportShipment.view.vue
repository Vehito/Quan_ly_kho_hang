<template>
    <div class="page row">
        <div class="col">
            <InputSearch v-model="searchText" v-on:submit="searchSubmit"/>
        </div>

        <div class="col-12 text-center mt-3">
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
import InputSearch from '@/components/InputSearch.vue';
import ShipmentsController from '@/controllers/shipments.controller';
const shipmentsController = new ShipmentsController(false);
import router from '@/router';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import { onMounted, ref } from 'vue';

const tableHeaders = [
    { name: "Mã đơn hàng", key: "id" },
    { name: "Nhà cung cấp", key: "supplier_name" },
    { name: "Người tạo", key: "employee_name" },
    { name: "Ngày tạo", key: "text_created_at" },
]

const isLoading = ref(true);
const searchText = ref('');
const shipments = ref([]);

function searchSubmit(text) {
    console.log(text);
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