<script setup>

const props = defineProps({
    listItems: {required: true, type: Array},
    activeIndex: { type: Number, default: -1 }
});

const model = defineModel('activeIndex');

</script>

<template>
    <h5
        v-if="listItems.length===0"
        class="text-center"
    >Không tồn tại thông tin nào</h5>
    <div class="grid-view shadow d-flex justify-content-center align-content-between flex-wrap scrollspy-example" 
        data-spy="scroll"
        data-offset="0"
        v-else
    >
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
</template>

<style scoped>
.grid-view {
    padding: 10px;
    border: solid 1px rgb(128, 128, 128, 0.2);
    border-radius: 20px;
}
</style>