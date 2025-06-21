<template>
    <div class="page row">
        <div class="col">
            <InputSearch v-model="searchText" v-on:submit="searchSubmit"/>
        </div>

        <div class="col-12 text-center mt-3">
            <CustomTable 
                :table-headers="tableHeaders"
                :table-rows="suppliers"
            >
                <template #custom="{ row }">
                    <DropdownBtn
                        :dropdown-items="['Thay đổi nhà cung cấp', 'Xóa nhà cung cấp']"
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
                @click="router.push({ name: 'supplier.create' })">
                Thêm nhà cung cấp
            </button>
        </div>
    </div>
</template>

<script setup>
import CustomTable from '@/components/CustomTable.vue';
import InputSearch from '@/components/InputSearch.vue';
import { DropdownBtn } from '@/utils/buttons.util';
import suppliersController from '@/controllers/suppliers.controller';
import router from '@/router';
import { onMounted, ref } from 'vue';

const tableHeaders = [
    { name: "Mã nhà cung cấp", key: "id"},
    { name: "Tên nhà cung cấp", key: "name"},
    { name: "Địa chỉ", key: "address"},
    { name: "Số điện thoại", key: "phone"},
]

const searchText = ref('');
const suppliers = ref([]);

function searchSubmit(text) {
    console.log(text);
}

async function getSuppliers() {
    try {
        suppliers.value = (await suppliersController.queryAll());
    } catch (error) {
        error.showAlert();
    }
}

async function handleAction(selectedAction, supplier) {
    switch(selectedAction) {
        case"Thay đổi nhà cung cấp":
            router.push({ name: 'supplier.edit', params: {id: supplier.id}})
        break;
        case "Xóa nhà cung cấp":
            const reply = window.confirm(`Bạn có muốn xóa nhà cung cấp ${supplier.name}?`);
            if(!reply) {
                return false;
            } else {
                await suppliersController.delete(supplier.id);
                await getSuppliers();
            }
        break;
    }
}

onMounted(async () => {
    await getSuppliers();
})

</script>