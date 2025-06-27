<template>
    <div class="page">
        <h2 class="text-center">Chi tiết đơn nhập</h2>
        <LoadingScreen :is-loading="isLoading">
                <div class="row mt-3">
                    <div class="col-lg-4 col-md-6 col-12">
                        <strong>Mã đơn hàng:</strong> {{ importShipment.id }}
                    </div>
                    <div class="col-lg-4 col-md-6 col-12">
                        <strong>Được tạo vào:</strong> {{ importShipment.text_created_at }}
                    </div>
                    <div class="col-lg-4 col-md col-12">
                        <strong>Người tạo:</strong> {{ importShipment.employee_name }}
                    </div>
                    <div v-if="importShipment.description" class="col">
                        <strong>Mô tả:</strong> {{ importShipment.description }}
                    </div>
                </div>
                <div class="mt-3">
                    <CustomTable
                        v-if="importShipment.listItem"
                        :table-headers="tableHeaders"
                        :table-rows="importShipment.listItem"
                    />
                </div>
        </LoadingScreen>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ShipmentsController from '@/controllers/shipments.controller';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import CustomTable from '@/components/CustomTable.vue';
import { ImportShipment } from '@/models/shipments.model';
const importShipmentsController = new ShipmentsController(true);

const props = defineProps({
    id: { type: String, required: true }
});

const importShipment = ref(null);
const isLoading = ref(true);
const tableHeaders = [
    { name: "Sản phẩm", key: "product_name" },
    { name: "Số lượng", key: "quantity" },
    { name: "Giá nhập", key: "price" },
    { name: "Ngày sản xuất", key: "text_mfg" },
    { name: "Hạn sử dụng", key: "text_exp" },
    { name: "Tồn kho", key: "stoke" },
]

async function getShipments() {
    try {
        importShipment.value = await importShipmentsController.queryById(props.id, true);
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