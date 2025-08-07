<template>
    <div class="page">
        <h2 class="text-center">Chi tiết đơn nhập</h2>
        <LoadingScreen :is-loading="isLoading">
            <div class="col-12">
                <div class="float-right">
                    <button class="btn btn-outline-success" 
                        @click="printPDF"
                        style="max-width: fit-content;"
                    >
                        Xuất PDF
                        <i class="fa-solid fa-file-pdf"></i>
                    </button>
                </div>
            </div>

            <div class="row mt-5">
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
                    :total="total"
                    :total-columns="totalColumns"
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
import { shipmentPdfExport } from '@/utils/PDF_export';
const importShipmentsController = new ShipmentsController(true);

const props = defineProps({
    id: { type: String, required: true }
});

const importShipment = ref(null);
const isLoading = ref(true);
const tableHeaders = [
    { name: "Sản phẩm", key: "product_name" },
    { name: "Số lượng", key: "quantity" },
    { name: "Ngày sản xuất", key: "text_mfg" },
    { name: "Hạn sử dụng", key: "text_exp" },
    { name: "Tồn kho", key: "stoke" },
    { name: "Giá nhập", key: "formatted_price" },
];
const totalColumns = [5];
const total = { 5: ref(0) }
async function getShipments() {
    try {
        importShipment.value = await importShipmentsController.queryById(props.id, true);
    } catch (error) {
        error.showAlert();
    } finally {
        isLoading.value = false;
    }
}

function printPDF() {
    shipmentPdfExport(importShipment.value, [
                { name: 'Sản phẩm', key: 'product_name' },
                { name: 'Số lượng', key: 'quantity' },
                { name: 'Tồn kho', key: 'stoke' },
                { name: 'Ngày sản xuất', key: 'text_mfg' },
                { name: 'Hạn sử dụng', key: 'text_exp' },
                { name: 'Giá mua', key: 'formatted_price' },
            ], true);
}

onMounted(async () => {
    await getShipments();
    total[5].value = importShipment.value.formatted_total;
})
</script> 