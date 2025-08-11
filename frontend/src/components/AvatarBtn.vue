<template>
        <DropdownBtn
            v-if="userStore.isLoggedIn"
            :dropdown-items="dropdownBtnContent.dropdownItems"
            @select:value="(selectedAction) => dropdownBtnContent.selectValue(selectedAction)"
            id="avatar-btn"
        >
            <template #label>
                <img src="../assets/imgs/default-avatar.jpg" class="rounded-circle" alt="Avatar">
                {{ local_storageUtil.getUser.name }}
            </template>
        </DropdownBtn>
</template>

<script setup>
import { useUserStore } from '@/utils/pinia.util';
const userStore = useUserStore();
import local_storageUtil from '@/utils/local_storage.util';
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
                router.push({name: 'change_password', params: { id: local_storageUtil.getUser.id }});
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