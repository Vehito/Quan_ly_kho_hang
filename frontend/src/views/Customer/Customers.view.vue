<template>
    <div class="page row">
        <div class="col">
            <InputSearch v-model="searchText" v-on:submit="searchSubmit"/>
        </div>

        <div class="col-12 text-center mt-3">
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
        </div>

        <div class="d-flex">
            <button
                class="btn btn-success"
                @click="router.push({ name: 'customer.create' })">
                Thêm khách hàng
            </button>
        </div>
    </div>
</template>

<script setup>
import CustomTable from '@/components/CustomTable.vue';
import InputSearch from '@/components/InputSearch.vue';
import { DropdownBtn } from '@/utils/buttons.util';
import customersController from '@/controllers/customers.controller';
import router from '@/router';
import { onMounted, ref } from 'vue';

const tableHeaders = [
    { name: "Mã khách hàng", key: "id"},
    { name: "Tên khách hàng", key: "name"},
    { name: "Công ty", key: "company"},
    { name: "Địa chỉ", key: "address"},
    { name: "Số nợ", key: "debt"},
    { name: "Ngày trả", key: "text_due_date"},
    { name: "Tình trạng", key: "text_status"},
]

const searchText = ref('');
const customers = ref([]);
const changeColumns = ['text_status']

function checkCondition(key, cellValue) {
    switch(key) {
        case 'text_status':
            if(cellValue==='Kích hoạt') {
                return "text-success";
            }
            return "text-warning";
        break;
    }
}

function searchSubmit(text) {
    console.log(text);
}

async function getCustomers() {
    try {
        customers.value = (await customersController.queryAll());
    } catch (error) {
        error.showAlert();
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
    await getCustomers();
})

</script>