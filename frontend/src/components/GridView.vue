<script setup>

const props = defineProps({
    listItems: {required: true, type: Array},
    activeIndex: { type: Number, default: -1 }
});

const model = defineModel('activeIndex');

const emits = defineEmits(["update:activeIndex"]);

function updateActiveIndex(index) {
    emits('update:activeIndex', index);
};

</script>

<template>
    <div class="grid-view d-flex align-content-between flex-wrap">
        <h5
            v-if="listItems.length===0"
            class="text-center"
        >Không tồn tại thông tin nào</h5>
        <div v-else>
            <div
                v-for="(item, index) in listItems"
                :key="index"
                @click="model = index"
            >
                <slot
                    name="custom"
                    :key="index"
                    :data="item"
                    :isActive="index === activeIndex"
                ></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.grid-view {
    padding: 10px;
    border: solid 1px rgb(128, 128, 128, 0.2);
    border-radius: 20px;
}
</style>