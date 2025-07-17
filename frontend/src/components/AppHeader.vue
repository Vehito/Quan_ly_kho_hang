<template>
    <nav class="navbar navbar-expand navbar-dark bg-light">
        <div class="mr-auto navbar-nav">
            <li v-for="item in menuItems" class="nav-item text-center">
                <RouterLink :to="{ name: item.name}" class="nav-link">
                    <strong>{{ item.label }}</strong>
                </RouterLink>
                <i :class="item.icon"></i>
            </li>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    sidebarIndex: { type: Number, default: 0 }
});

const menuItems = computed(() => {
    const listItems = [
        [
            {label: 'Sản phẩm hết hạn', icon: 'fa-solid fa-clock', name: 'product.expire'},
            {label: 'Sản phẩm hết hạn', icon: 'fa-solid fa-clock', name: 'product.expire'},
            {label: 'Sản phẩm hết hạn', icon: 'fa-solid fa-clock', name: 'product.expire'},
        ]
    ];

    return listItems[props.sidebarIndex];
});
</script>

<style scoped>
nav {
    margin-left: 200px;
    height: 80px;
}
</style>