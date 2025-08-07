<template>
    <div class="page">
        <h2 class="text-center">Chi tiết đơn xuất</h2>
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
                        <strong>Mã đơn hàng:</strong> {{ exportShipment.id }}
                    </div>
                    <div class="col-lg-4 col-md-6 col-12">
                        <strong>Được tạo vào:</strong> {{ exportShipment.text_created_at }}
                    </div>
                    <div class="col-lg-4 col-md col-12">
                        <strong>Người tạo:</strong> {{ exportShipment.employee_name }}
                    </div>
                    <div v-if="exportShipment.description" class="col">
                        <strong>Mô tả:</strong> {{ exportShipment.description }}
                    </div>
                </div>
                <div class="mt-3">
                    <CustomTable
                        v-if="exportShipment.listItem"
                        :table-headers="tableHeaders"
                        :table-rows="exportShipment.listItem"
                        :total="total" :total-columns="totalColumns"
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
const exportShipmentsController = new ShipmentsController(false);

const props = defineProps({
    id: { type: String, required: true }
});

const exportShipment = ref(null);
const isLoading = ref(true);
const tableHeaders = [
    { name: "Sản phẩm", key: "product_name" },
    { name: "Ngày sản xuất", key: "text_mfg" },
    { name: "Hạn sử dụng", key: "text_exp" },
    { name: "Số lượng", key: "quantity" },
    { name: "Giá bán", key: "formatted_price" },
];
const totalColumns = [4];
const total = { 4: ref(0) }

async function getShipments() {
    try {
        exportShipment.value = await exportShipmentsController.queryById(props.id, true);
    } catch (error) {
        error.showAlert();
    } finally {
        isLoading.value = false;
    }
}

function printPDF() {
    shipmentPdfExport(exportShipment.value, [
                { name: 'Sản phẩm', key: 'product_name' },
                { name: 'Số lượng', key: 'quantity' },
                { name: 'Ngày sản xuất', key: 'text_mfg' },
                { name: 'Hạn sử dụng', key: 'text_exp' },
                { name: 'Giá bán', key: 'formatted_price' },
            ], false);
}

onMounted(async () => {
    await getShipments();
    total[4].value = exportShipment.value.formatted_total;
})
</script>