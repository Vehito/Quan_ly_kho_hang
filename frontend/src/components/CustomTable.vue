<script setup>
    const props = defineProps({
        name: { type: String, default: "" },

//      tableHeaders: [
//          { name: "ID", key: "id", type: 'img' },
//          { name: "Tên sản phẩm", key: "name" },
//          { name: "Giá", key: "price" }
//      ]
        tableHeaders: { type: Array, required: true, default: [] },
        tableRows: { type: Array, required: true, default: [] },

//      changeContents: { keyA: 'valueA', keyB: 'valueB',... }
        changeColumns: { type: Array, required: false, default: [] },
        changingCondition: { type: Function, required: false }
    });
    const emits = defineEmits(['clickBtn']);

    function checkCondition(key, cellValue) {
        if(props.changeColumns.find((col) => col === key) === undefined) return;
        return props.changingCondition(key, cellValue);
    }
</script>

<template>
    <div class="table-container shadow">
        <div v-if="tableRows.length===0" class="text-center">
            <h5>Không có thông tin</h5>
        </div>
        <table v-else class="table table-sm table-bordered table-hover">
            <thead class="thead-light">
                <th
                    scope="col"
                    v-for="(tableHeader, index) in tableHeaders"
                    :key="index"
                >
                    {{ tableHeader.name }}
                </th>
            </thead>

            <tbody>
                <tr
                    v-for="(tableRow, index) in tableRows"
                    :key="index"
                >
                    <th scope="row" class="text-center">
                        {{ tableRow[Object.values(tableHeaders)[0].key] }}
                    </th>

                    <td
                        v-for="(header, index) in tableHeaders.slice(1)"
                        :key="index"
                    >
                        <div v-if="header.type==='img'" class="text-center">
                            <img  :src="tableRow[header.key]" alt="Ảnh"
                                style="max-height: 100px; max-width: 150px;"
                            >
                        </div>
                        <span 
                            v-else :class="checkCondition(header.key, tableRow[header.key])"
                        >
                            {{ tableRow[header.key] }}
                        </span>
                    </td>

                    <slot name="custom" :row="tableRow"></slot>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.table-container {
    border: 1px rgb(128, 128, 128, .5) solid;
    padding: 10px;
    border-radius: 10px;
}
</style>
