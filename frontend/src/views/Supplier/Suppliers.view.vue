<template>
    <div class="page row">
        <div class="col">
            <InputSearch v-model="searchText" v-on:submit="searchSubmit"/>
        </div>
        <div class="col-12 mt-1">
                <div class="float-right">
                    <PDF_Btn
                        :table-headers="PDF_Btn_content.tableHeaders"
                        :load-func="PDF_Btn_content.loadFunc"
                        :file-name="PDF_Btn_content.fileName"
                        :table-title="PDF_Btn_content.tableTitle"
                    />
                </div>
            </div>
        <div class="col-12 mt-3">
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
            <Pagination :is-loading="quantityIsLoading"
                :item-quantity="numOfItem" @on-click:index="changePage" />
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
import Pagination from '@/components/Pagination.vue';
import PDF_Btn from '@/components/PDF_Btn.vue';

const tableHeaders = [
    { name: "Mã hiệu", key: "id"},
    { name: "Tên nhà cung cấp", key: "name"},
    { name: "Địa chỉ", key: "address"},
    { name: "Số điện thoại", key: "phone"},
];

const isLoading = ref(true);
const quantityIsLoading = ref(true);
const numOfItem = ref(0);
const searchText = ref('');
const suppliers = ref([]);

async function searchSubmit(text) {
    conditions.offset = 0;
    conditions.name = text;
    await getQuantity();
    await getSuppliers();
}

const PDF_Btn_content = {
    tableHeaders: tableHeaders,
    fileName: 'Danh_sach_nha_cung_cap.pdf',
    tableTitle: 'Danh sách nhà cung cấp',
    loadFunc: async () => await suppliersController
        .queryAll()
}
const conditions = {name: '', limit: 10, offset: 0};

async function changePage(index) {
    conditions.offset = 10 + (index-1);
    await getSuppliers();
}
async function getQuantity() {
    try {
        quantityIsLoading.value = true;
        numOfItem.value = (await suppliersController.queryCount(
            {name: conditions.name}
        ));
    } catch (error) {
        error.showAlert();
    } finally {
        quantityIsLoading.value = false;
    }
}
async function getSuppliers() {
    try {
        isLoading.value = true;
        suppliers.value = (await suppliersController.queryAll(conditions));
    } catch (error) {
        error.showAlert();
    } finally {
        isLoading.value = false
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
    await getQuantity();
    await getSuppliers();
})

</script>