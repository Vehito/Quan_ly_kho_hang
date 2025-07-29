<template>
    <div class="row mt-1">
        <InputSearch placeholder="Nhập tên, nguồn gốc sản phẩm,..."
            v-model="searchText" @submit="updateValues"/>
        <hr>
        <div class="col-12 mt-3">
            <ButtonCollapse
                :btn-texts="collapses.btnTexts"
                :btn-classes="collapses.btnClasses"
                :ids="collapses.ids">
                <template #default="{ index }">
                    <FormFields
                        :label="checkboxField[index].label"
                        :type="checkboxField[index].type"
                        :name="checkboxField[index].name"
                        :options="checkboxField[index].options"
                        @update:model-value="checkboxField[index].updateModelValue"
                    />
                </template>
            </ButtonCollapse>
        </div>
    </div>
</template>

<script setup>
// component
import FormFields from '@/components/forms/FormFields.vue';
import ButtonCollapse from '@/components/ButtonCollapse.vue';
import InputSearch from './InputSearch.vue';

// models
import { Product } from '@/models/products.model';

// more
import { computed } from 'vue';
// setup
const props = defineProps({
    inputSearch: {type: Boolean, default: false},
    types: {type: Boolean, default: false},
});
const emits = defineEmits(['update:values']);

// var
const searchText = '';
const checkboxField = props.types
    ? [{
        label: 'Loại sản phẩm',
        type: 'checkbox',
        name: 'products',
        options: [
            {id: -1, name: 'Tất cả', checked: true},
            ...Product.types.map((type) => {return {id: type, name: type}})
        ],
        updateModelValue(selectedValue) {
            const {value, index} = selectedValue;
            filteredTypes[index] = value;
        }
    }] : [{}];
const collapses = computed(() => {
    const result = {
        btnTexts: [],
        btnClasses: [],
        ids: []
    };

    if (props.types) {
        result.btnTexts.push('Chọn loại sản phẩm');
        result.btnClasses.push('btn-outline-dark w-25');
        result.ids.push('types');
    }

    return result;
});
let filteredTypes = [];

// func
function updateValues() {
    const values = {
        searchText: undefined, types: undefined
    }
    values.searchText = searchText;
    if(filteredTypes[0]!==-1 && filteredTypes.length>0) {
        values.types = filteredTypes;
    }
    emits('update:values', values);
}

</script>

<style scoped>
.fields {
    border: .5px solid rgb(128, 128, 128, .5);
    border-radius: 10px;
    padding: 10px;
    width: fit-content;
}
.lietke {
    height: 50px;
    width: 80px;
}
</style>