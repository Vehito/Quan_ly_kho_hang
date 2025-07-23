<template>
    <div class="page row">
        <div class="col">
            <InputSearch v-model="searchText" v-on:submit="searchSubmit"/>
        </div>

        <div class="col-12">
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
            <LoadingScreen :is-loading="isLoading">
                <CustomTable 
                    :table-headers="tableHeaders"
                    :table-rows="customers"
                    :change-columns="changeColumns"
                    :changing-condition="checkCondition"
                >
                    <template #custom="{ row }">
                        <DropdownBtn
                            :dropdown-items="['Thay đổi khách hàng', 'Xóa khách hàng']"
                            @select:value="(selectedAction) => handleAction(selectedAction, row)"
                        >
                            <template #label>
                                <i class="fa-solid fa-bars"></i>
                            </template>
                        </DropdownBtn>
                    </template>
                </CustomTable>
            </LoadingScreen>
            <Pagination :is-loading="pageLoading" :item-quantity="numberOfItems" @on-click:index="changePage" />
        </div>
    </div>
</template>

<script setup>
import CustomTable from '@/components/CustomTable.vue';
import InputSearch from '@/components/InputSearch.vue';
import { DropdownBtn } from '@/utils/buttons.util';
import router from '@/router';
import { onMounted, ref } from 'vue';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import Pagination from '@/components/Pagination.vue';
import PDF_Btn from '@/components/PDF_Btn.vue';

import customersController from '@/controllers/customers.controller';

const tableHeaders = [
    { name: "Mã khách hàng", key: "id"},
    { name: "Tên khách hàng", key: "name"},
    { name: "Công ty", key: "company"},
    { name: "Địa chỉ", key: "address"},
    { name: "Số nợ", key: "debt"},
    { name: "Ngày trả", key: "text_due_date"},
    { name: "Tình trạng", key: "text_status"},
]

const customers = ref([]);
const isLoading = ref(true);
const numberOfItems = ref(0);
const pageLoading = ref(true);
const PDF_Btn_content = {
    tableHeaders: tableHeaders,
    fileName: 'Danh_sach_khach_hang.pdf',
    tableTitle: 'Danh sách khách hàng',
    loadFunc: async () => await customersController
        .queryAll({name: conditions.name})
}


const searchText = ref('');
const changeColumns = ['text_status'];
const conditions = {name: '', limit: 10, offset: 0};

function checkCondition(key, cellValue) {
    switch(key) {
        case 'text_status':
            if(cellValue==='Kích hoạt') {
                return "text-success";
            }
            return "text-warning";
    }
}

async function searchSubmit(text) {
    conditions.offset = 0;
    conditions.name = text;
    await getCount();
    await getCustomers();
}

async function changePage(index) {
    conditions.offset = 10 * (index-1);
    await getCustomers();
}
async function getCustomers() {
    try {
        isLoading.value = true;
        customers.value = (await customersController.queryAll(conditions));
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.value = false;
    }
}
async function getCount() {
    try {
        pageLoading.value = true;
        numberOfItems.value = (await customersController.queryCount({name: conditions.name}));
    } catch (error) {
        error?.showAlert();
    } finally {
        pageLoading.value = false;
    }
}
async function handleAction(selectedAction, customer) {
    switch(selectedAction) {
        case"Thay đổi khách hàng":
            router.push({ name: 'customer.edit', params: {id: customer.id}})
        break;
        case "Xóa khách hàng":
            const reply = window.confirm(`Bạn có muốn xóa khách hàng ${customer.name}?`);
            if(!reply) {
                return false;
            } else {
                await customersController.delete(customer.id);
                await getCustomers();
            }
        break;
    }
}

onMounted(async () => {
    await getCount();
    await getCustomers();
})

</script>