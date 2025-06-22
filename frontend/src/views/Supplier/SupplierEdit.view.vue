<template>
    <div v-if="id" class="page">
        <h4 class="text-center">
            Hiệu chỉnh nhà cung cấp
        </h4>
        <SupplierForm 
            v-if="supplier"
            :supplier="supplier"
            @submit:supplier="updateSupplier"
            @delete:supplier="deleteSupplier"
        />
    </div>

    <div v-else class="page">
        <h4 class="text-center">
            Tạo nhà cung cấp
        </h4>
        <SupplierForm 
            :supplier="null"
            @submit:supplier="createSupplier"
        />
    </div>
</template>

<script setup>
import SupplierForm from '@/components/forms/SupplierForm.vue';
import suppliersController from '@/controllers/suppliers.controller';
import router from '@/router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    id: { required: false, type: String }
});

const route = useRoute();

const supplier = ref(null);

async function getSupplier(id) {
    try {
        supplier.value = await suppliersController.queryById(Number(id));
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

async function createSupplier(data) {
    try {
        await suppliersController.insert(data);
        router.push({ name: "suppliers" });
    } catch (error) {
        error.showAlert();
    }
}

async function updateSupplier(data) {
    try {
        await suppliersController.update(supplier.value.id, data);
        router.push({ name: "suppliers" });
    } catch (error) {
        error.showAlert();
    }   
}

async function deleteSupplier() {
    if(confirm("Bạn có muốn xóa nhà cung cấp này?")) {
        try {
            await suppliersController.delete(props.id);
            router.push({ name: "suppliers" });
        } catch (error) {
            error.showAlert();
        }
    }
}

onMounted(async () => {
    if(props.id) await getSupplier(props.id);
});
</script>