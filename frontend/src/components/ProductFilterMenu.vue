<template>
    <div class=" mt-1">
        <ButtonCollapse
            :btn-texts="['Bộ lọc']"
            :btn-classes="['btn btn-outline-dark']"
            :ids="['filter_collapse']"
        >
            <template #default="{index}">
                <div class="row">
                    <div v-for="field in searchFields" class="col-md mt-2">
                        <FormFields
                            :label="field.label"
                            :name="field.name"
                            :model-value="field.modelValue"
                            :placeholder="field.placeholder"
                            @update:model-value="field.updateModelValue"
                        />
                    </div>
                </div>
                <hr>
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
            </template>
        </ButtonCollapse>
        <button @click="updateValues"
                class="btn btn-outline-success mt-2 lietke col-lg-2 col" type="button">
            Liệt kê
        </button>
        <div class="col-12 mt-3">
            
        </div>
    </div>
</template>

<script setup>
// component
import FormFields from '@/components/forms/FormFields.vue';
import ButtonCollapse from '@/components/ButtonCollapse.vue';

// models
import { Product } from '@/models/products.model';

// more
import { computed, ref } from 'vue';
// setup
const props = defineProps({
    inputSearch: {type: Boolean, default: false},
    types: {type: Boolean, default: false},
});
const emits = defineEmits(['update:values']);

// var
// const searchFields = [
//     { placeholder: 'Nhập tên sản phẩm', searchText: '' },
//     { placeholder: 'Nhập tên nhà sản xuất', searchText: '' },
//     { placeholder: 'Nhập nguồn gốc', searchText: '' }
// ];
const searchText = {name: ref(''), origin: ref(''), manufacturer: ref('')};
const searchFields = [
    {
        label: 'Tên sản phẩm',
        modelValue: null,
        placeholder: 'Nhập tên sản phẩm',
        name: "product_name",
        updateModelValue: (value) => {
            searchText.name.value = value;
        }
    },
    {
        label: 'Nguồn gốc sản phẩm',
        modelValue: null,
        placeholder: 'Nhập nguồn gốc sản phẩm',
        name: "product_origin",
        updateModelValue: (value) => {
            searchText.origin.value = value;
        }
    },
    {
        label: 'Nhà sản xuất sản phẩm',
        modelValue: null,
        placeholder: 'Nhập tên nhà sản xuất',
        name: "product_manufacturer",
        updateModelValue: (value) => {
            searchText.manufacturer.value = value;
        }
    },
];
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
    const keys = ['name', 'origin', 'manufacturer'];
    const values = {
        name: '', origin: '',
        manufacturer: '', types: undefined,
    };
    keys.forEach((key) => {
        if(searchText[key].value) {
            values[key] = searchText[key].value;
        }
    });
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