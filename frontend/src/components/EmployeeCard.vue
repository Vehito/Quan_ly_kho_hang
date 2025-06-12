<script setup>
import { Employee } from '@/models/employees.model';
import { DropdownBtn } from '@/utils/buttons.util';
import date_helperUtil from '@/utils/date_helper.util';

const props = defineProps({
    employee: { required: true, type: Employee }
});
const data = [
    {key: 'position_name', value: 'Vị trí'},
    {key: 'username', value: 'Tên đăng nhập'},
    {key: 'phone', value: 'Số điện thoại'},
    {key: 'address', value: 'Địa chỉ'}
];

const emits = defineEmits(['select']);

function select(selectedOption) {
    emits('select', selectedOption, props.employee.id);
}
</script>

<template>
    <div class="card">
        <h5 class="card-header text-center">Chi tiết Nhân viên</h5>
        <div class="card-body">
            <h5 class="card-title">
                <div class="d-flex justify-content-between">
                    <span>{{ employee.name }}</span>
                    <span>#{{ employee.id }}</span>
                </div>
            </h5>
            <div class="card-text">
                <strong>Sinh nhật: </strong>
                {{ date_helperUtil.getStringDate(employee.birth) }}
            </div>
            <div
                v-for="({key, value}) in data"
                :key="key"
                class="card-text"
            >
                <strong>{{ value }}:</strong> {{ employee[key] }}
            </div>
            <div class="text-center mt-1">
                <DropdownBtn
                    :dropdown-items="['Thay đổi', 'Xóa nhân viên']"
                    @select:value="select"
                    >
                    <template #label>
                        Chi tiết
                    </template>
                </DropdownBtn>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-header {
    background-color: rgb(75, 75, 255, 0.2);
}
.card {
    border: solid 1px rgba(0, 0, 255);
}
</style>