<script setup>
import { ImportItem } from '@/models/shipment_items.model';
import { onMounted, ref } from 'vue';
import FormFields from '../FormFields.vue';
import { ErrorMessage } from 'vee-validate';
import productsController from '@/controllers/products.controller';
import date_helperUtil from '@/utils/date_helper.util';

const localItems = defineModel({ required: true, type: Array })

const emits = defineEmits(['submit:item']);

// const localItems = ref(...props.localItems);
const headerTitles = ref(["Chọn sản phẩm"]);
const products = ref([]);
const isLoading = ref(true);

async function getProducts() {
    try {
        products.value = await productsController.queryAll();
    } catch (error) {
        error.showError();
    } finally {
        isLoading.value = false;
    }
}

function addLocalItem() {
    localItems.value.push(new ImportItem({}));
    headerTitles.value.push("Chọn sản phẩm");
};

function deleteLocalItem(index) {
    localItems.value.splice(index, 1);
    headerTitles.value.splice(index, 1);
}

const headerFields = {
    label: 'Sản phẩm:',
    type: 'select',
    isLoading: isLoading,
    placeholder: "Chọn sản phẩm",
    options: products,
    name: "product_id",
    updateModelValue: (itemIndex, value) => {
        localItems.value[itemIndex].product_id = value;
        headerTitles.value[itemIndex] = (products.value.find(
            (pro) => pro.id === localItems.value[itemIndex].product_id
        )).name;
    }
};

const upperFields = [
    {
        label: 'Số lượng:',
        type: 'number',
        modelValue: null,
        placeholder: "Nhập số lượng",
        name: "quantity",
        updateModelValue: (itemIndex, value) => {
            localItems.value[itemIndex].quantity = value;
        }
    },
    {
        label: 'Giá nhập:',
        type: 'number',
        modelValue: null,
        placeholder: "Nhập giá nhập",
        name: "price",
        updateModelValue: (itemIndex, value) => {
            localItems.value[itemIndex].price = value;
        }
    },
];

const lowerFields = [
    {
        label: 'Ngày sản xuất:',
        type: 'date',
        modelValue: null,
        placeholder: "Chọn ngày sản xuất",
        name: "mfg",
        updateModelValue: (itemIndex, value) => {
            localItems.value[itemIndex].mfg = date_helperUtil.formatDateForMySQL(value);
        }
    },
    {
        label: 'Ngày hết hạn:',
        type: 'date',
        modelValue: null,
        placeholder: "Chọn ngày hết hạn",
        name: "exp",
        updateModelValue: (itemIndex, value) => {
            localItems.value[itemIndex].exp = date_helperUtil.formatDateForMySQL(value);
        }
    },
];

onMounted(async () => {
    await getProducts();
})

</script>

<template>
<div class="accordion" id="accordionExample" @submit="submitItem">
    <div v-for="(item, index) in localItems"
        :key="index" class="card"
    >
        <div class="card-header" :id="`heading${index}`">
            <h2 class="mb-0">
                <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" 
                    :data-target="`#collapse${index}`" aria-expanded="true" :aria-controls="`collapse${index}`"
                >
                    {{ headerTitles[index] }} #{{ index+1 }}
                </button>
            </h2>
        </div>
        <div :id="`collapse${index}`" class="collapse show" 
            :aria-labelledby="`heading${index}`" data-parent="#accordionExample"
        >
            <div class="card-body">
                <div class="form-group">
                    <FormFields
                        :label="headerFields.label"
                        :type="headerFields.type"
                        :options="headerFields.options.value"
                        :is-loading="headerFields.isLoading.value"
                        :model-value="item.product_id ?? ''"
                        :name="`items[${index}].${headerFields.name}`"
                        :placeholder="headerFields.placeholder"
                        @update:model-value="(value) => headerFields.updateModelValue(index, value)"
                    />
                    <ErrorMessage :name="`items[${index}].${headerFields.name}`" class="error-feedback" />
                </div>
                        <div
                            v-for="field in upperFields"
                            :key="field.name"
                            class="form-group"
                        >
                            <FormFields
                                :label="field.label"
                                :type="field.type"
                                :model-value="field.modelValue"
                                :name="`items[${index}].${field.name}`"
                                :placeholder="field.placeholder"
                                @update:model-value="(value) => field.updateModelValue(index, value)"
                            />
                            <ErrorMessage :name="`items[${index}].${field.name}`" class="error-feedback" />
                        </div>
                        <div
                            v-for="field in lowerFields"
                            :key="field.name"
                            class="form-group"
                        >
                            <FormFields
                                :label="field.label"
                                :type="field.type"
                                :model-value="field.modelValue"
                                :name="`items[${index}].${field.name}`"
                                :placeholder="field.placeholder"
                                @update:model-value="(value) => field.updateModelValue(index, value)"
                            />
                            <ErrorMessage :name="`items[${index}].${field.name}`" class="error-feedback" />
                        </div>
                <button type="button" 
                    class="btn btn-danger btn-sm btn-block"
                    @click="deleteLocalItem(index)"
                >
                    <i class="fa-solid fa-minus"></i>
                    Xóa
                </button>
            </div>
        </div>
    </div>
</div>
<button type="button"
    class="btn btn-success btn-block mt-3"
    @click="addLocalItem"
>
    <i class="fa-solid fa-plus"></i>
    Thêm chi tiết đơn hàng
</button>
</template>

<style scoped>
#accordionExample {
    min-width: 300px;
}
</style>