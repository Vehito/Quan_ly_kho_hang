<template>
    <div v-if="id" class="page">
        <h4 class="text-center">
            Hiệu chỉnh sản phẩm
        </h4>
        <ProductForm 
            v-if="product"
            :product="product"
            @submit:product="updateProduct"
            @delete:product="deleteProduct"
        />
    </div>

    <div v-else class="page">
        <h4 class="text-center">
            Tạo sản phẩm
        </h4>
        <ProductForm 
            :product="null"
            @submit:product="createProduct"
        />
    </div>
</template>

<script setup>
import ProductForm from '@/components/forms/ProductForm.vue';
import productsController from '@/controllers/products.controller';
import router from '@/router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    id: { required: false, type: String }
});

const product = ref(null);

async function getProduct(id) {
    try {
        product.value = await productsController.queryById(Number(id));
    } catch (error) {
        console.log(error);
        const route = useRoute();
        router.push({
            name: "notfound",
            params: {
                pathMatch: route.path.split("/").slice(1)
            },
            query: route.query,
            hash: route.hash
        });
    }
}

async function createProduct(data) {
    try {
        await productsController.insert(data);
        router.push({ name: "products" });
    } catch (error) {
        error.showAlert();
    }
}

async function updateProduct(data) {
    try {
        await productsController.update(product.id, data);
        router.push({ name: "products" });
    } catch (error) {
        error.showAlert();
    }   
}

async function deleteProduct() {
    if(confirm("Bạn có muốn xóa sản phẩm này?")) {
        try {
            await productsController.delete(props.id);
            router.push({ name: "products" });
        } catch (error) {
            error.showAlert();
        }
    }
}

onMounted(async () => {
    if(props.id) await getProduct(props.id);
});
</script>