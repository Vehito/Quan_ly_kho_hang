<template>
        <DropdownBtn
            v-if="userStore.isLoggedIn"
            :dropdown-items="dropdownBtnContent.dropdownItems"
            @select:value="(selectedAction) => dropdownBtnContent.selectValue(selectedAction)"
            id="avatar-btn"
        >
            <template #label>
                <img src="../assets/imgs/default-avatar.jpg" class="rounded-circle" alt="Avatar">
                {{ userStore.name }}
            </template>
        </DropdownBtn>
</template>

<script setup>
import { useUserStore } from '@/utils/pinia.util';
const userStore = useUserStore();
import router from '@/router';
import { DropdownBtn } from '@/utils/buttons.util';
import authController from '@/controllers/auth.controller';

const dropdownBtnContent = {
    dropdownItems: ['Đăng xuất', 'Đổi mật khẩu'],
    selectValue: async (selectedAction) => {
        switch(selectedAction) {
            case "Đăng xuất":
                try {
                    const result = await authController.logout();
                    if(result) {
                        userStore.logout();
                        router.push({ name: 'login'});
                    }
                } catch (error) {
                    error?.showAlert();
                }
            break;
            case "Đổi mật khẩu":
            break;
        }
    }
}
</script>

<style scoped>
#avatar-btn {
    width: fit-content;

    img.rounded-circle {
        width: 30px;
    }
}
</style>