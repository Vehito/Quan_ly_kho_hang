<template>
    <div class="page row">
        <div class="col">
            <InputSearch v-model="searchText" v-on:submit="searchSubmit"/>
        </div>

        <div class="col-12 text-center mt-3">
            <CustomTable 
                :table-headers="tableHeaders"
                :table-rows="products"
            />
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

onMounted(async () => {
    await getProducts();
})

</script>