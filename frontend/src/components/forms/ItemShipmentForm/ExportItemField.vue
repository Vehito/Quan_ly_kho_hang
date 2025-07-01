<script setup>
import { ref, onMounted } from 'vue';
import { ErrorMessage } from 'vee-validate';
import { ExportItem } from '@/models/shipment_items.model';
import FormFields from '../FormFields.vue';
import productsController from '@/controllers/products.controller';
import ShipmentsController from '@/controllers/shipments.controller';

const importShipmentController = new ShipmentsController(true);

// Props
const localItems = defineModel({ required: true, type: Array });
const emits = defineEmits(['submit:item']);

// Refs
const headerTitles = ref([]);
const products = ref([]);
const productLoading = ref(true);
const importShipmentLoading = ref([]);
const defaultPrices = ref([]);
const shipmentOptions = ref([]);
const stokes = ref([]);
let selectedItems = [];

// Load product list
async function getProducts() {
    try {
        products.value = await productsController.queryAll();
    } catch (error) {
        error.showError?.();
    } finally {
        productLoading.value = false;
    }
}

// Load shipment options by product ID (only if not already cached)
async function getShipmentOptionsByProduct(product_id) {
    const existing = shipmentOptions.value.find(
        (list) => list?.[0]?.product_id === product_id
    );
    if (existing) return existing;

    try {
        const shipment = await importShipmentController.queryAllShipmentItems({
            product_id,
            available: true
        });
        return shipment;
    } catch (error) {
        error.showAlert?.();
        return [];
    }
}

// Handle when user selects a product
async function handleProductChange(index, productId) {
    localItems.value[index].product_id = productId;
    defaultPrices.value[index] = null;
    const product = products.value.find(p => p.id === productId);
    headerTitles.value[index] = product?.name ?? 'Chọn sản phẩm';

    importShipmentLoading.value[index] = true;
    try {
        const shipments = await getShipmentOptionsByProduct(productId);
        shipmentOptions.value[index] = shipments;
    } catch (error) {
        shipmentOptions.value[index] = [];
    } finally {
        importShipmentLoading.value[index] = false;
    }
    defaultPrices.value[index] = product?.sale_price ?? 0;
    localItems.value[index].price = defaultPrices.value[index];
}

// Add a new export item row
function addLocalItem() {
    localItems.value.push(new ExportItem({}));
    headerTitles.value.push("Chọn sản phẩm");
    importShipmentLoading.value.push(false);
    defaultPrices.value.push(null);
    shipmentOptions.value.push([]);
    stokes.value.push(0);
    selectedItems.push(null);
}

// Remove export item row
function deleteLocalItem(index) {
    localItems.value.splice(index, 1);
    headerTitles.value.splice(index, 1);
    importShipmentLoading.value.splice(index, 1);
    defaultPrices.value.splice(index, 1);
    shipmentOptions.value.splice(index, 1);
    stokes.value.splice(index, 1);
}

// Product select field
const productField = {
    label: 'Sản phẩm:',
    type: 'select',
    isLoading: productLoading,
    placeholder: "Chọn sản phẩm",
    options: products,
    name: "product_id",
};

// Dynamic fields for each item
const fields = [
    {
        label: 'Lô hàng nhập:',
        type: 'select',
        isLoading: importShipmentLoading,
        placeholder: "Chọn lô hàng",
        options: shipmentOptions,
        name: "import_shipment_id",
        updateModelValue: (index, value) => {
            localItems.value[index].import_shipment_id = value;
            selectedItems[index] = shipmentOptions.value[index].find(
                (opt) => opt.shipment_id === value
            );
            stokes.value[index] = selectedItems[index].stoke;
        }
    },
    {
        label: 'Số lượng:',
        type: 'number',
        modelValue: null,
        placeholder: "Nhập số lượng",
        name: "quantity",
        updateModelValue: (index, value) => {
            localItems.value[index].quantity = value;
        }
    },
    {
        type: "hidden",
        name: "stoke",
        modelValue: stokes
    }
];

const priceField = {
    label: 'Giá bán:',
    type: 'number',
    modelValue: defaultPrices,
    placeholder: "Nhập giá nhập",
    name: "price",
    updateModelValue: (index, value) => {
        localItems.value[index].price = value;
    }
};

onMounted(() => {
    getProducts();
});
</script>


<template>
<div class="accordion" id="accordionExample">
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
                        :label="productField.label"
                        :type="productField.type"
                        :options="productField.options.value"
                        :is-loading="productField.isLoading.value"
                        :model-value="item.product_id ?? ''"
                        :name="`items[${index}].${productField.name}`"
                        :placeholder="productField.placeholder"
                        @update:model-value="(value) => handleProductChange(index, value)"
                    />
                    <ErrorMessage :name="`items[${index}].${productField.name}`" class="error-feedback" />
                </div>
                <div v-if="priceField.modelValue.value[index]" class="form-group">
                    <FormFields
                        :label="priceField.label"
                        :type="priceField.type"
                        :name="`items[${index}].${priceField.name}`"
                        :model-value="priceField.modelValue.value[index]"
                        :placeholder="priceField.placeholder"
                        @update:model-value="(value) => priceField.updateModelValue(index, value)"
                    />
                    <ErrorMessage :name="`items[${index}].${priceField.name}`" class="error-feedback" />
                </div>
                <div v-for="field in fields"
                    class="form-group">
                    <FormFields
                        :label="field.label"
                        :type="field.type"
                        :options="field.options?.value[index]"
                        :is-loading="field.isLoading?.value[index]"
                        :model-value="field.modelValue?.value[index] ?? field.modelValue?.value ?? field.modelValue"
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