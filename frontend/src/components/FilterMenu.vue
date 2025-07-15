<template>
    <div class="row mt-1">
        <div v-for="field in timeFields" class="col-lg-3 col shadow-sm fields mr-3 mt-2">
            <FormFields
                :label="field.label"
                :type="field.type"
                :model-value="field.modelValue"
                :placeholder="field.placeholder"
                :options="field.options"
                :disabled="field.disabled?.value"
                :name="field.name"
                @update:model-value="field.updateModelValue"
            />
        </div>
        <button @click="updateValues"
                class="btn btn-outline-success mt-2 lietke col-lg-2 col" type="button">
            Liệt kê
        </button>
        <hr>
        <div class="col-12 mt-3">
            <ButtonCollapse
                :btn-texts="collapses.btnTexts"
                :btn-classes="collapses.btnClasses"
                :ids="collapses.ids">
                <template #default="{ index }">
                    <FormFields
                        :label="checkboxFields[index].label"
                        :type="checkboxFields[index].type"
                        :is-loading="checkboxFields[index].isLoading.value"
                        :name="checkboxFields[index].name"
                        :options="checkboxFields[index].options.value"
                        @update:model-value="checkboxFields[index].updateModelValue"
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

// controller
import suppliersController from '@/controllers/suppliers.controller';
import productsController from '@/controllers/products.controller';
import customersController from '@/controllers/customers.controller';

// more
import date_helperUtil from '@/utils/date_helper.util';
import { computed, ref, onMounted } from 'vue';
// setup
const props = defineProps({
    timeFields: {type: Boolean, default: false},
    customerFields: {type: Boolean, default: false},
    supplierFields: {type: Boolean, default: false},
    productFields: {type: Boolean, default: false},
});
const emits = defineEmits(['update:values']);

// ref
const period = {start: ref(new Date()), end: ref(new Date()), range: ref([])};
const products = ref([]);
const customers = ref([]);
const suppliers = ref([]);
const isLoading = {
    product: ref(true),
    customer: ref(true),
    supplier: ref(true)
};

// var
const periods = [
    {id: 'month', name: "Tháng hiện tại"},
    {id: 'quarter', name: "Quý hiện tại"},
    {id: 'year', name: "Năm hiện tại"},
    {id: 'custom', name: "--Tự chọn--"},
];
const timeFields = props.timeFields 
?   [
        { 
            label: 'Khoảng thời gian',
            type: "select",
            modelValue: 'month',
            placeholder: 'Chọn khoảng thời gian',
            options: periods,
            name: "period",
            updateModelValue: (value) => {
                handlePeriodField(value);
            }
        },
        {
            label: 'Thời gian bắt đầu',
            type: "date",
            modelValue: null,
            placeholder: 'Chọn thời gian bắt đầu',
            name: "start",
            disabled: ref(true),
            updateModelValue: (value) => {
                period.start.value = value;
            }
            
        },
        {
            label: 'Thời gian kết thúc',
            type: "date",
            modelValue: null,
            placeholder: 'Chọn thời gian kết thúc',
            name: "end",
            disabled: ref(true),
            updateModelValue: (value) => {
                period.end.value = value;
            }
            
    }] 
: [];
const checkboxFields = [
    ...(props.productFields
    ? [{
        label: 'Sản phẩm',
        type: 'checkbox',
        isLoading: isLoading.product,
        name: 'products',
        options: products,
        updateModelValue(selectedValue) {
            const {value, index} = selectedValue;
            filteredProductIds[index] = value;
        }
    }] : []),
    ...(props.customerFields
    ? [{
        label: 'Khách hàng',
        type: 'checkbox',
        isLoading: isLoading.customer,
        name: 'customers',
        options: customers,
        updateModelValue(selectedValue) {
            const {value, index} = selectedValue;
            filteredCustomerIds[index] = value;
        }
    }] : []),
    ...(props.supplierFields
    ? [{
        label: 'Nhà cung cấp',
        type: 'checkbox',
        isLoading: isLoading.supplier,
        name: 'suppliers',
        options: suppliers,
        updateModelValue(selectedValue) {
            const {value, index} = selectedValue;
            filteredSupplierIds[index] = value;
        }
    }] : []),
];
const collapses = computed(() => {
    const result = {
        btnTexts: [],
        btnClasses: [],
        ids: []
    };

    if (props.productFields) {
        result.btnTexts.push('Sản phẩm');
        result.btnClasses.push('btn-outline-dark');
        result.ids.push('products');
    }

    if (props.customerFields) {
        result.btnTexts.push('Khách hàng');
        result.btnClasses.push('btn-outline-danger');
        result.ids.push('customers');
    }

    if (props.supplierFields) {
        result.btnTexts.push('Nhà cung cấp');
        result.btnClasses.push('btn-outline-success');
        result.ids.push('suppliers');
    }

    return result;
});
let filteredProductIds = [];
let filteredCustomerIds = [];
let filteredSupplierIds = [];

// func
function handlePeriodField(value) {
    if(value !== 'custom') {
        const { start, end, range } = date_helperUtil.getPeriod(value);
        period.start.value = start;
        period.end.value = end;
        period.range.value = range;
        timeFields[1].disabled.value = true;
        timeFields[2].disabled.value = true;
    } else {
        timeFields[1].disabled.value = false;
        timeFields[2].disabled.value = false;
    }
}
function updateValues() {
    const checkboxKey = ['product_id', 'customer_id', 'supplier_id'];
    const checkboxValue = [filteredProductIds, filteredCustomerIds, filteredSupplierIds];
    const values = {
        start: undefined,
        end: undefined,
        product_id: undefined,
        customer_id: undefined,
        supplier_id: undefined
    }
    values.start = date_helperUtil.formatDateForMySQL(period.start.value);
    values.end = date_helperUtil.formatDateForMySQL(period.end.value);
    for(let i = 0; i <= 2; i++) {
        if(checkboxValue[i].length > 0) {
            checkboxValue[i][0]===-1
                ? values[checkboxKey[i]] = undefined
                : values[checkboxKey[i]] = checkboxValue[i];
        }
    }
    emits('update:values', values);
}

// func loading
async function getProducts() {
    try {
        isLoading.product.value = true;
        const result = await productsController.queryAll({});
        products.value = [{id: -1, name: 'Tất cả', checked: true}, ...result];
    } catch (error) {
        error?.showError();
    } finally {
        isLoading.product.value = false;
    }
}
async function getCustomers() {
    try {
        isLoading.customer.value = true;
        const result = await customersController.queryAll({});
        customers.value = [{id: -1, name: 'Tất cả', checked: true}, ...result]
    } catch (error) {
        error?.showError();
    } finally {
        isLoading.customer.value = false;
    }
}
async function getSuppliers() {
    try {
        isLoading.supplier.value = true;
        const result = await suppliersController.queryAll({});
        suppliers.value = [{id: -1, name: 'Tất cả', checked: true}, ...result];
    } catch (error) {
        error?.showError();
    } finally {
        isLoading.supplier.value = false;
    }
}

onMounted(async () => {
    const { start, end, range } = date_helperUtil.getPeriod('month');
    period.start.value = start;
    period.end.value = end;
    period.range.value = range;
    if(props.productFields) {
        await getProducts();
        filteredProductIds[0] = -1;
    }
    if(props.customerFields) {
        await getCustomers();
        filteredCustomerIds[0] = -1;
    }
    if(props.supplierFields) {
        await getSuppliers();
        filteredSupplierIds[0] = -1;
    }
});
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