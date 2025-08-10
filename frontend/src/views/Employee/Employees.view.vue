<template>
    <div class="page row">
        <div class="col-12">
            <InputSearch v-model="searchText" v-on:submit="searchSubmit"/>
        </div>

        <div class="mt-3 col-12 col-md-8">
            <ScrollableArea :height="500">
                <GridView
                    v-if="filteredEmployees"
                    :list-items="filteredEmployees"
                    v-model:active-index="activeIndex"
                >
                    <template #custom="{ data, key, isActive }">
                        <EmployeeGridSlot 
                            :class="{ active: isActive }"
                            :id="data.id" :name="data.name"
                            :department_name="data.department_name"
                            :text_position="data.text_position" :index="key"
                        />
                    </template>
                </GridView>
            </ScrollableArea>
        </div>
        <div class="mt-3 col-12 col-md-4">
            <EmployeeCard
                class="sticky-top"
                v-if="filteredEmployees[activeIndex]"
                :employee="activeEmployee()"
                @select="onSelect"
            />
        </div>
    </div>

</template>

<script setup>
import GridView from '@/components/GridView.vue';
import EmployeeCard from '@/components/EmployeeCard.vue';
import EmployeeGridSlot from '@/components/EmployeeGridSlot.vue';
import InputSearch from '@/components/InputSearch.vue';
import employeesController from '@/controllers/employees.controller';
import router from '@/router';
import ScrollableArea from '@/components/ScrollableArea.vue';
import { computed, onMounted, ref, watch } from 'vue';

const searchText = ref('');
const employees = ref([]);
const activeIndex = ref(-1);

watch(searchText, () => activeIndex.value = -1) ;

function searchSubmit(text) {
    console.log(text);
}

async function getEmployees() {
    try {
        employees.value = (await employeesController.queryAll());
    } catch (error) {
        error.showAlert();
    }
}

function employeeStrings() {
    return employees.value.map((employee) => {
        const { id, name, phone, address, department_name } = employee;
        return [id, name, phone, address, department_name].join("");
    });
}

const filteredEmployees = computed(() => {
    if (!searchText.value) return employees.value;

    const search = searchText.value.trim().toLocaleLowerCase();
    const employeeStrs = employeeStrings();

    return employees.value.filter((_employee, index) =>
        employeeStrs[index].toLocaleLowerCase().includes(search)
    );
})

function activeEmployee() {
    if (activeIndex.value < 0) return null;
    const e = filteredEmployees.value[activeIndex.value];
    return filteredEmployees.value[activeIndex.value];
}

async function onSelect(selectedOption, employee) {
    switch(selectedOption) {
        case 'Thay đổi':
            router.push({name: 'employee.edit', params: {id: employee.id}});
        break;
        case "Xóa nhân viên":
            const reply = window.confirm(`Bạn có muốn xóa nhân viên ${employee.name}?`);
            if(!reply) {
                return false;
            } else {
                await employeesController.delete(employee.id);
                await getEmployees();
            }
        break;
    }
}


onMounted(async () => {
    await getEmployees();
    filteredEmployees;
})

</script>