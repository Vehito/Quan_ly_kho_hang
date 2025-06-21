<template>
    <div v-if="id" class="page">
        <h4 class="text-center">
            Hiệu chỉnh khách hàng
        </h4>
        <CustomerForm 
            v-if="customer"
            :customer="customer"
            @submit:customer="updateCustomer"
            @delete:customer="deleteCustomer"
        />
    </div>

    <div v-else class="page">
        <h4 class="text-center">
            Tạo khách hàng
        </h4>
        <CustomerForm 
            :customer="null"
            @submit:customer="createCustomer"
        />
    </div>
</template>

<script setup>
import CustomerForm from '@/components/forms/CustomerForm.vue';
import customersController from '@/controllers/customers.controller';
import router from '@/router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    id: { required: false, type: String }
});

const route = useRoute();

const customer = ref(null);

async function getCustomer(id) {
    try {
        customer.value = await customersController.queryById(Number(id));
    } catch (error) {
        console.log(error);
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

async function createCustomer(data) {
    try {
        await customersController.insert(data);
        router.push({ name: "customers" });
    } catch (error) {
        error.showAlert();
    }
}

async function updateCustomer(data) {
    try {
        await customersController.update(customer.value.id, data);
        router.push({ name: "customers" });
    } catch (error) {
        error.showAlert();
    }   
}

async function deleteCustomer() {
    if(confirm("Bạn có muốn xóa khách hàng này?")) {
        try {
            await customersController.delete(props.id);
            router.push({ name: "customers" });
        } catch (error) {
            error.showAlert();
        }
    }
}

onMounted(async () => {
    if(props.id) await getCustomer(props.id);
});
</script>