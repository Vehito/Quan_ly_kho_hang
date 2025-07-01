<template>
    <div class="page">
        <h4 class="text-center">
            Tạo đơn xuất
        </h4>
        <ExportShipmentForm 
            @submit:exportShipment="createExportShipment"
        />
    </div>
</template>

<script setup>
import ExportShipmentForm from '@/components/forms/EmportShipmentForm.vue';
import ShipmentsController from '@/controllers/shipments.controller';
const exportShipmentsController = new ShipmentsController(false);
import router from '@/router';

async function createExportShipment(data) {
    try {
        await exportShipmentsController.insert(data);
        router.push({ name: "export_shipments" });
    } catch (error) {
        error.showAlert();
    }
}
</script>