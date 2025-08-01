<template>
    <div v-if="id" class="page">
        <h4 class="text-center">
            Hiệu chỉnh nhân viên
        </h4>
        <EmployeeForm 
            v-if="employee && departments"
            :employee="employee"
            :departments="departments"
            @submit:employee="updateEmployee"
            @delete:employee="deleteEmployee"
        />
    </div>

    <div v-else class="page">
        <h4 class="text-center">
            Tạo nhân viên
        </h4>
        <EmployeeForm 
            v-if="departments"
            :employee="null"
            :departments="departments"
            @submit:employee="createEmployee"
        />
    </div>
</template>

<script setup>
import EmployeeForm from '@/components/forms/EmployeeForm.vue';
import employeesController from '@/controllers/employees.controller';
import departmentController from '@/controllers/department.controller';
import router from '@/router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    id: { required: false, type: String }
});

const route = useRoute();

const employee = ref(null);
const departments = ref(null);

async function getEmployee(id) {
    try {
        employee.value = await employeesController.queryById(Number(id));
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

async function getPostions() {
    try {
        departments.value = await departmentController.queryAll();
    } catch (error) {
        error.showAlert();
        router.push({
            name: "employees",
        });
    }
}

async function createEmployee(data) {
    try {
        await employeesController.insert(data);
        router.push({ name: "employees" });
    } catch (error) {
        error.showAlert();
    }
}

async function updateEmployee(data) {
    try {
        await employeesController.update(employee.value.id, data);
        router.push({ name: "employees" });
    } catch (error) {
        error.showAlert();
    }   
}

async function deleteEmployee() {
    if(confirm("Bạn có muốn xóa nhân viên này?")) {
        try {
            await employeesController.delete(props.id);
            router.push({ name: "employees" });
        } catch (error) {
            error.showAlert();
        }
    }
}

onMounted(async () => {
    await getPostions();
    if(props.id) await getEmployee(props.id);
});
</script>