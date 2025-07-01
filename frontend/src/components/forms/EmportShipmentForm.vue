<template>
    <div class="form-container">
        <Form @submit="submitExportShipment" :validation-schema="validationSchema">
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
                    <ExportItemField v-model="localItems" />
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
import { ExportShipment } from '@/models/shipments.model';
import { ExportItem } from '@/models/shipment_items.model';
import router from '@/router/index.js';
import { onMounted, ref } from 'vue';
import ExportItemField from './ItemShipmentForm/ExportItemField.vue';
import customersController from '@/controllers/customers.controller';
import LoadingButton from '../loading/LoadingButton.vue';

const emits = defineEmits(['submit:exportShipment']);

let localExportShipment = new ExportShipment({});
const customers = ref([]);
const isLoading = ref(true);
const isLoadingSubmit = ref(false);
const localItems = ref([]);

const fields = [
    {
        label: 'Khách hàng:',
        type: "select",
        options: customers,
        isLoading: isLoading,
        modelValue: localExportShipment.customer_id,
        placeholder: "Chọn khách hàng",
        name: "customer_id",
        updateModelValue: (value) => {
            localExportShipment.customer_id = value;
        }
    },
    {
        label: 'Mô tả:',
        type: 'textarea',
        modelValue: localExportShipment.description,
        placeholder: "Nhập mô tả",
        name: "description",
        updateModelValue: (value) => {
            localExportShipment.description = value;
        }
    },
]

const validationSchema = yup.object().shape({
    customer_id: yup
        .string()
        .required("Khách hàng phải có giá trị"),
    description: yup
        .string()
        .notRequired()
        .max(100, "Mô tả tối đa có 100 ký tự"),
    items: yup.array().of(
        yup.object().shape({
            product_id: yup
                .string()
                .required("Vui lòng chọn sản phẩm"),
            import_shipment_id: yup
                .string()
                .required("Phải chọn lô hàng"),
            quantity: yup
                .number()
                .typeError("Số lượng phải là số")
                .required("Vui lòng nhập số lượng")
                .min(1, "Số lượng phải lớn hơn 0")
                .test("max-stoke", "Số lượng vượt quá tồn kho", function (value) {
                    const { stoke } = this.parent;
                    if (typeof stoke === "number" && typeof value === "number") {
                        return value <= stoke;
                    }
                    return true;
                }),
            price: yup
                .number()
                .typeError("Đơn giá phải là số")
                .required("Vui lòng nhập đơn giá")
                .min(0, "Đơn giá không được âm"),
            stoke: yup
                .number()
                .required("Thiếu số lượng tồn kho để kiểm tra")
                .typeError("Số lượng tồn kho không hợp lệ"),
        })
    )
});

function submitExportShipment() {
    isLoadingSubmit.value = true;
    localExportShipment.listItem = localItems.value;
    localExportShipment.created_by = 1;
    localExportShipment.formatDateForMySql();
    emits('submit:exportShipment', localExportShipment);
    isLoadingSubmit.value = false;
}

async function getCustomer() {
    try {
        customers.value = await customersController.queryAll();
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
    await getCustomer();
})
</script>

<style>
@import "@/assets/form.css";
</style>