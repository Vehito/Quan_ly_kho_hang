<script setup>

const props = defineProps({
    id: {required: true, type: Number},
    name: {required: true, type: String},
    position_name: {required: true, type: String},
    index: { required: true, type: Number }
});

const emits = defineEmits(['onClick']);

function onClick() {
    emits('onClick', props.id);
}

</script>

<template>
    <div class="card m-2" @click="onClick">
        <img src="../assets/imgs/default-avatar.jpg" alt="Image" class="card-img-top">
        <div class="card-body">
            <h6 class="card-title">{{ name }}</h6>
            <p class="card-text">{{ position_name }}</p>
        </div>
    </div>
</template>

<style scoped>
.card {
    display: flex;
    align-items: center;
    width: 175px;
    height: min-content;
    border: solid 2px;
    border-radius: 10px;
    cursor: pointer;

    img {
        width: 150px;
        align-items: center;
        display: inherit;
    }
    .card-body {
        background-color: rgb(128, 128, 128, 0.3);
        width: 100%;
    }
}

.active {
    border: solid rgb(30, 30, 253);

    .card-body {
        background-color: rgb(75, 75, 255, 0.2);
    }
}
</style>