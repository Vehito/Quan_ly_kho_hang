<script setup>
const searchText = defineModel();

const props = defineProps({
    placeholder: { type:String, default: 'Nhập thông tin cần tìm' }
})

const emit = defineEmits(['submit']);

function submit() {
    emit('submit', searchText.value);
}
</script>

<template>
    <div class="input-group d-flex justify-content-center">
        <input 
            type="text"
            class="form-control"
            :placeholder="placeholder"
            v-model="searchText"
            @keyup.enter="submit"
        />
        <div class="input-group-append">
            <button 
                class="btn btn-outline-secondary"
                type="button"
                @click="submit"
            >
                <i class="fas fa-search"></i> Tìm kiếm
            </button>
        </div>
    </div>
</template>

<style scoped>
.form-control {
    max-width: 400px;
}
</style>