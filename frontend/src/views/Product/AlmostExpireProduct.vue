<template>
    <div class="page">
        <h4 class="text-center">Danh sách sản phẩm</h4>
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
                <CustomTable
                    :table-headers="tableHeaders"
                    :table-rows="tableRows"
                />
            </loading-screen>
        </div>
    </div>
</template>

<script setup>
// components
import CustomTable from '@/components/CustomTable.vue';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import FormFields from '@/components/forms/FormFields.vue';

// controllers
import ShipmentsController from '@/controllers/shipments.controller';
import { ImportShipment } from '@/models/shipments.model';
const importShipmentController = new ShipmentsController(true);

// more
import { ref, onMounted, computed } from 'vue';

// ref
const period = {start: ref(new Date()), end: ref(new Date())};
const isLoading = ref(true);
const importShipments = ref([new ImportShipment({})]);

// var
const tableHeaders = [
    { name: "Mã đơn hàng", key: "shipment_id" },
    { name: "Sản phẩm", key: "product_name" },
    { name: "Tồn kho", key: "stoke" },
    { name: "Hạn sử dụng", key: "text_exp" },
];
const tableRows = computed(() => {
    return importShipments.value.map((shipment) => {
        const {shipment_id, product_name, stoke, text_exp} = shipment.listItem[0];
        return {shipment_id, product_name, stoke, text_exp};
    })
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
            {exp : {start: period.start.value, end: period.end.value}, available: true},
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
    handlePeriodSelect(0);
    await getImportShipment();
});
</script>