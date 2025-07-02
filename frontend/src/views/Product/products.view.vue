<template>
    <div class="page row">
        <div class="col">
            <InputSearch v-model="searchText" v-on:submit="searchSubmit"/>
        </div>

        <div class="col-12 mt-3">
            <CustomTable 
                :table-headers="tableHeaders"
                :table-rows="products"
            >
                <template #custom="{ row }">
                    <DropdownBtn
                        :dropdown-items="['Thay đổi sản phẩm', 'Xóa sản phẩm']"
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
                @click="router.push({ name: 'product.create' })">
                Thêm sản phẩm
            </button>
        </div>
    </div>
</template>

<script setup>
import CustomTable from '@/components/CustomTable.vue';
import InputSearch from '@/components/InputSearch.vue';
import { DropdownBtn } from '@/utils/buttons.util';
import productsController from '@/controllers/products.controller';
import router from '@/router';
import { onMounted, ref } from 'vue';

const tableHeaders = [
    { name: "Mã sản phẩm", key: "id"},
    { name: "Tên sản phẩm", key: "name"},
    { name: "Giá bán", key: "sale_price"},
    { name: "Tồn kho", key: "quantity"}
]

const searchText = ref('');
let products = ref([]);

function searchSubmit(text) {
    console.log(text);
}

async function getProducts() {
    try {
        products.value = (await productsController.queryAll());
    } catch (error) {
        error.showAlert();
    }
}

async function handleAction(selectedAction, row) {
    switch(selectedAction) {
        case "Thay đổi sản phẩm":
            router.push({ name: 'product.edit', params: {id: row.id}})
        break;
        case "Xóa sản phẩm":
            const reply = window.confirm(`Bạn có muốn xóa sản phẩm ${row.name}?`);
            if(!reply) {
                return false;
            } else {
                await productsController.delete(row.id);
                await getProducts();
            }
        break;
    }
}

onMounted(async () => {
    await getProducts();
})

</script>