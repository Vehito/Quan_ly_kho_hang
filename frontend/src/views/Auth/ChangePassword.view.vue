<template>
    <ChangePasswordForm :id="id" @submit="submit"/>
</template>

<script setup>
import ChangePasswordForm from '@/components/forms/ChangePasswordForm.vue';
import authController from '@/controllers/auth.controller';
import router from '@/router';
import { useUserStore } from '@/utils/pinia.util';
const userStore = useUserStore();

const props = defineProps({
    id: { type: String, required: true }
});

async function submit(data) {
    try {
        const result = await authController.changePassword(props.id, userStore.username, data.old_password, data.new_password);
        if(result) {
            router.push({ name: 'products' });
        }
    } catch (error) {
        error?.showAlert();
    }

}
</script>