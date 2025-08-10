<template>
    <h4 class="text-center">Đăng nhập hệ thống</h4>
    <LoginForm
        @submit:login="login"
    />
</template>

<script setup>
import LoginForm from '@/components/forms/LoginForm.vue';
import authController from '@/controllers/auth.controller';
// import { useUserStore } from '@/utils/pinia.util';
// const userStore = useUserStore();
import local_storageUtil from '@/utils/local_storage.util';
import router from '@/router';

async function login(data) {
    try {
        const { success, user } = await authController.login(data);
        if(success && user) {
            local_storageUtil.setUser(user);
            router.push({ name: "products" });
        }
    } catch (error) {
        error?.showAlert();
    }
}
</script>