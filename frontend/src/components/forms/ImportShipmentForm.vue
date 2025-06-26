<template>
    <div class="form-container">
        <Form @submit="submitImportShipment" :validation-schema="validationSchema">
            <div class="row">
                <div class="col-lg-6 col-12">
                    <div
                        v-for="field in fields"
                        :key="field.name"
                        class="form-group"
                    >
                        <FormFields 
                            :label="field.label"
                            :type="field.type"
                            :model-value="field.modelValue"
                            :options="field.options?.value ?? field.options"
                            :is-loading="field.isLoading?.value"
                            :name="field.name"
                            :placeholder="field.placeholder"
                            @update:model-value="field.updateModelValue"
        
                        />
                        <ErrorMessage :name="field.name" class="error-feedback" />
                    </div>
                </div>
                <div class="col-lg-6 mt-3 col-12 d-flex flex-column align-items-center">
                    <ImportItemField v-model="localItems" />
                </div>
            </div>
            <div class="form-group">
                <LoadingButton :is-loading="isLoadingSubmit" btn-text="Lưu">
                    <template #custom-btn>
                        <button class="btn btn-primary" type="submit">
                            Lưu
                        </button>
                    </template>
                </LoadingButton>
                <button
                    class="btn btn-warning ml-2"
                    type="button"
                    @click="cancel"
                >
                    Thoát
                </button>
            </div>
        </Form>
    </div>
</template>

<script setup>
import * as yup from 'yup';
import FormFields from './FormFields.vue';
import { Form, ErrorMessage } from 'vee-validate';
import { ImportShipment } from '@/models/shipments.model';
import { ImportItem } from '@/models/shipment_items.model';
import router from '@/router/index.js';
import { onMounted, ref } from 'vue';
import ImportItemField from './ItemShipmentForm/ImportItemField.vue';
import suppliersController from '@/controllers/suppliers.controller';
import LoadingButton from '../loading/LoadingButton.vue';

const emits = defineEmits(['submit:importShipment']);

let localImportShipment = new ImportShipment({});
const suppliers = ref([]);
const isLoading = ref(true);
const isLoadingSubmit = ref(false);
const localItems = ref([new ImportItem({})]);

const fields = [
    {
        label: 'Nhà cung cấp:',
        type: "select",
        options: suppliers,
        isLoading: isLoading,
        modelValue: localImportShipment.supplier_id,
        placeholder: "Chọn nhà cung cấp",
        name: "supplier_id",
        updateModelValue: (value) => {
            localImportShipment.supplier_id = value;
        }
    },
    {
        label: 'Mô tả:',
        type: 'textarea',
        modelValue: localImportShipment.description,
        placeholder: "Nhập mô tả",
        name: "description",
        updateModelValue: (value) => {
            localImportShipment.description = value;
        }
    },
]

const validationSchema = yup.object().shape({
    supplier_id: yup
        .string()
        .required("Nhà cung cấp phải có giá trị"),
    description: yup
        .string()
        .notRequired()
        .max(100, "Mô tả tối đa có 100 ký tự"),
    items: yup.array().of(
        yup.object().shape({
            product_id: yup
                .string()
                .required("Vui lòng chọn sản phẩm"),
            quantity: yup
                .number()
                .typeError("Số lượng phải là số")
                .required("Vui lòng nhập số lượng")
                .min(1, "Số lượng phải lớn hơn 0"),
            price: yup
                .number()
                .typeError("Đơn giá phải là số")
                .required("Vui lòng nhập đơn giá")
                .min(0, "Đơn giá không được âm"),
            mfg: yup
                .date()
                .typeError("Ngày sản xuất không hợp lệ")
                .required("Vui lòng chọn ngày sản xuất"),
            exp: yup
                .date()
                .typeError("Ngày hết hạn không hợp lệ")
                .required("Vui lòng chọn ngày hết hạn")
                .min(yup.ref("mfg"), "Ngày hết hạn phải sau ngày sản xuất"),
        })
    )
});

function submitImportShipment() {
    isLoadingSubmit.value = true;
    for (const item of localItems.value) {
        item.formatDateForMySql();
    }
    localImportShipment.listItem = localItems.value;
    localImportShipment.created_by = 1;
    localImportShipment.formatDateForMySql();
    emits('submit:importShipment', localImportShipment);
    isLoadingSubmit.value = false;
}

async function getSupplier() {
    try {
        suppliers.value = await suppliersController.queryAll();
    } catch (error) {
        error.showAlert();
    } finally {
        isLoading.value = false;
    }
}

function cancel() {
    const reply = window.confirm('You have unsaved changes! Do you wanna leave?');
    if(!reply) {
        return false;
    } else {
        router.push({ name: 'import_shipments' });
    }
}

onMounted(async () => {
    await getSupplier();
})
</script>

<style>
@import "@/assets/form.css";
</style>