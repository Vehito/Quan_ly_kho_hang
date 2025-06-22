<template>
    <div class="page row">
        <div class="col">
            <InputSearch v-model="searchText" v-on:submit="searchSubmit"/>
        </div>

        <div class="col-12 text-center mt-3">
            <CustomTable 
                :table-headers="tableHeaders"
                :table-rows="shipments"
            >
                <template #custom="{ row }">
                    <DropdownBtn
                        :dropdown-items="['Thay đổi đơn hàng', 'Xóa đơn hàng']"
                        @select:value="(selectedAction) => handleAction(selectedAction, row)"
                    >
                        <template #label>
                            <i class="fa-solid fa-bars"></i>
                        </template>
                    </DropdownBtn>
                </template>
            </CustomTable>
        </div>

        <div class="d-flex">
            <button
                class="btn btn-success"
                @click="router.push({ name: 'import_shipment.create' })">
                Thêm đơn hàng
            </button>
        </div>
    </div>
</template>

<script setup>
import CustomTable from '@/components/CustomTable.vue';
import InputSearch from '@/components/InputSearch.vue';
import { DropdownBtn } from '@/utils/buttons.util';
import ShipmentsController from '@/controllers/shipments.controller';
const shipmentsController = new ShipmentsController(true);
import router from '@/router';
import { onMounted, ref } from 'vue';

const tableHeaders = [
    { name: "Mã đơn hàng", key: "id" },
    { name: "Nhà cung cấp", key: "supplier_name" },
    { name: "Người tạo", key: "employee_name" },
    { name: "Ngày tạo", key: "created_at" },
]

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
    }
}

async function handleAction(selectedAction, shipment) {
    switch(selectedAction) {
        case"Thay đổi đơn hàng":
            router.push({ name: 'import_shipment.edit', params: {id: shipment.id}})
        break;
        case "Xóa đơn hàng":
            const reply = window.confirm(`Bạn có muốn xóa đơn hàng ${shipment.name}?`);
            if(!reply) {
                return false;
            } else {
                await shipmentsController.delete(shipment.id);
                await getShipments();
            }
        break;
    }
}

onMounted(async () => {
    await getShipments();
})

</script>