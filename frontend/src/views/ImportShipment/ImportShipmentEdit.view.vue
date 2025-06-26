<template>
    <div class="page">
        <h4 class="text-center">
            Tạo đơn nhập
        </h4>
        <ImportShipmentForm 
            @submit:importShipment="createImportShipment"
        />
    </div>
</template>

<script setup>
import ImportShipmentForm from '@/components/forms/ImportShipmentForm.vue';
import ShipmentsController from '@/controllers/shipments.controller';
const importShipmentsController = new ShipmentsController(true);
import router from '@/router';

async function createImportShipment(data) {
    try {
        await importShipmentsController.insert(data);
        router.push({ name: "import_shipments" });
    } catch (error) {
        error.showAlert();
    }
}
</script>