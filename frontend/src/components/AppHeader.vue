<template>
<ul class="nav nav-tabs p-3 d-flex justify-content-between align-items-center">
    <div v-if="userStore.isLoggedIn" class="d-flex">
        <li v-for="(item, index) in listItem" 
            :key="index"
            class="nav-item"
        >
            <RouterLink :to="{ name: item.name }"
                class="nav-link" :class="{ active: index === active }"
                @click="onClick(index)"
            >
                <strong>{{ item.label }} <i :class="item.icon"></i></strong>
            </RouterLink>
        </li>
    </div>
    
    <div>
        <AvatarBtn/>
    </div>
</ul>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/utils/pinia.util';
const userStore = useUserStore();
import AvatarBtn from './AvatarBtn.vue';

const props = defineProps({
    listItem: { type: Array, default: [] }
});

const active = ref(0);

function onClick(index) {
    active.value = index;
}

watch(
    () => props.listItem,
    () => {
        active.value = 0;
    },
    { immediate: false, deep: false }
);

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
        color: rgb(79, 135, 255);
    }
}
</style>