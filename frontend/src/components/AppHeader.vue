<template>
    <ul class="nav nav-tabs p-3">
        <li v-for="(item, index) in menuItems" 
            :key="index"
            class="nav-item"
        >
            <RouterLink :to="{ name: item.name}"
                class="nav-link" :class="{active: index===active}"
                @click="onClick(index)"
            >
                <strong>{{ item.label }} <i :class="item.icon"></i></strong>
            </RouterLink>
        </li>
    </ul>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    sidebarIndex: { type: Number, default: 0 }
});
const active = ref(0);
const menuItems = computed(() => {
    const listItems = [
        [
            {label: 'Danh sách SP', icon: 'fa-solid fa-box', name: 'products'},
            {label: 'Sản phẩm hết hạn', icon: 'fa-solid fa-clock', name: 'product.expire'},
        ]
    ];
    active.value = 0;
    return listItems[props.sidebarIndex];
});

function onClick(index) {
    active.value = index;
}

onMounted(() => {
    active.value = 0;
});
</script>

<style scoped>
.nav {
    margin-left: 220px;
    /* height: 80px; */
    /* background-color: rgb(128, 128, 128, .1); */
}
.nav-tabs {
    border-bottom: 1px gray solid;
    min-height: 60px;
    background-color: rgb(128, 128, 128, .1);
}
li.nav-item {
    .nav-link {
        color: gray;
    }
    .active {
        border: 1px gray solid;
        border-bottom: none;
        color: rgb(79, 255, 79);
    }
}
</style>