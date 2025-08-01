<template>
    <div class="page row">
        <div class="col -12">
             <ProductFilterMenu :input-search="true" :types="true" @update:values="searchSubmit"/>
        </div>

        <div class="col-12">
            <div class="float-right">
                <PDF_Btn
                    :table-headers="PDF_Btn_content.tableHeaders"
                    :load-func="PDF_Btn_content.loadFunc"
                    :file-name="PDF_Btn_content.fileName"
                    :table-title="PDF_Btn_content.tableTitle"
                />
            </div>
        </div>
        <div class="col-12 mt-3">
            <LoadingScreen :is-loading="isLoading">
                <CustomTable 
                    :table-headers="tableHeaders"
                    :table-rows="products"
                >
                    <template #custom="{ row }">
                        <DropdownBtn
                            :dropdown-items="['Chi tiết', 'Thay đổi sản phẩm', 'Xóa sản phẩm']"
                            @select:value="(selectedAction) => handleAction(selectedAction, row)"
                        >
                            <template #label>
                                <i class="fa-solid fa-bars"></i>
                            </template>
                        </DropdownBtn>
                    </template>
                </CustomTable>
            </LoadingScreen>
            <Pagination :is-loading="pageLoading" :item-quantity="numberOfItems" @on-click:index="changePage" />
        </div>
    </div>
</template>

<script setup>
import CustomTable from '@/components/CustomTable.vue';
import { DropdownBtn } from '@/utils/buttons.util';
import Pagination from '@/components/Pagination.vue';
import PDF_Btn from '@/components/PDF_Btn.vue';
import ProductFilterMenu from '@/components/ProductFilterMenu.vue';

import productsController from '@/controllers/products.controller';
import router from '@/router';
import { onMounted, ref } from 'vue';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';

const tableHeaders = [
    { name: "Mã sản phẩm", key: "id"},
    { name: "Hình ảnh sản phẩm", key: "img_url", type: 'img'},
    { name: "Tên sản phẩm", key: "name"},
    { name: "Đơn giá bán", key: "formatted_sale_price"},
    { name: "Loại sản phẩm", key: "type"},
    { name: "Nhà sản xuất", key: "manufacturer"},
    { name: "Đơn vị", key: "unit"},
    { name: "Nguồn gốc", key: "origin"},
    { name: "Tồn kho", key: "quantity"}
];
const PDF_Btn_content = {
    tableHeaders: [
        { name: "Mã sản phẩm", key: "id"},
        { name: "Tên sản phẩm", key: "name"},
        { name: "Đơn giá bán", key: "formatted_sale_price"},
        { name: "Loại sản phẩm", key: "type"},
        { name: "Nhà sản xuất", key: "manufacturer"},
        { name: "Đơn vị", key: "unit"},
        { name: "Nguồn gốc", key: "origin"},
        { name: "Tồn kho", key: "quantity"}
    ],
    fileName: 'Danh_sach_san_pham.pdf',
    tableTitle: 'Danh sách sản phẩm',
    loadFunc: async () => await productsController
        .queryAll({name: conditions.name})
}

const products = ref([]);
const isLoading = ref(true);
const numberOfItems = ref(0);
const pageLoading = ref(true);

const conditions = {id: undefined, name: undefined, origin: undefined, manufacturer: undefined, type: [], limit: 10, offset: 0};

async function searchSubmit(values) {
    conditions.offset = 0;
    conditions.name = values.name;
    conditions.origin = values.origin;
    conditions.manufacturer = values.manufacturer;
    if(Array.isArray(values.types)) {
        conditions.type = values.types;
    }
    await getCount();
    await getProducts();
}
async function changePage(index) {
    conditions.offset = 10 * (index-1);
    await getProducts();
}
async function getProducts() {
    try {
        isLoading.value = true;
        products.value = (await productsController.queryAll(conditions));
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.value = false;
    }
}
async function getCount() {
    try {
        pageLoading.value = false;
        numberOfItems.value = (await productsController.queryCount(
            {name: conditions.name, origin: conditions.origin,
                manufacturer: conditions.manufacturer, type: conditions.type}
        ));
    } catch (error) {
        error?.showAlert();
    } finally {
        pageLoading.value = false;
    }
}

async function handleAction(selectedAction, row) {
    switch(selectedAction) {
        case "Chi tiết":
            router.push({ name: 'product.detail', params: {id: row.id}})
        break;
        case "Thay đổi sản phẩm":
            router.push({ name: 'product.edit', params: {id: row.id}})
        break;
        case "Xóa sản phẩm":
            const reply = window.confirm(`Bạn có muốn xóa sản phẩm ${row.name}?`);
            if(!reply) {
                return false;
            } else {
                await productsController.delete(row.id);
                await getProducts();
            }
        break;
    }
}

onMounted(async () => {
    await getProducts();
    await getCount();
})

</script>