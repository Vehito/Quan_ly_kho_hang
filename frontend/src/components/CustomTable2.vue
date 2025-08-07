<template>
    <div class="table-container mt-1 shadow">
        <div v-if="tableContent.data.length===0" class="text-center">
            <h5>Không có thông tin</h5>
        </div>
        <table v-else class="table table-sm table-bordered table-hover bordered">
            <thead class="thead-light">
                <tr class="thead-light align-items-center">
                    <th 
                        scope="col"
                        v-for="(tableHeader, index) in tableContent.tableHeaders.upper"
                        :key="index"
                        :rowspan="tableHeader.rowspan"
                        :colspan="tableHeader.colspan"
                        class="text-center" 
                    >
                        {{ tableHeader.name }}
                    </th>
                </tr>
                <tr class="thead-light">
                    <th
                        scope="col"
                        v-for="(tableHeader, index) in tableContent.tableHeaders.lower"
                        :key="index"
                        :rowspan="tableHeader.rowspan"
                        :colspan="tableHeader.colspan"
                        class="text-center"
                    >
                        {{ tableHeader.name }}
                    </th>
                </tr>
            </thead>

            <tbody>
                    <template v-for="(cellValue, index) in tableContent.data" :key="index">
                    <tr>
                        <td
                            v-for="({key, colspan, rowspan}, i) in tableContent.tableRows.upper"
                            :key="i" :colspan="colspan" :rowspan="rowspan" class="hai-ben" 
                            :class="{'text-center': rowspan>1, lower: rowspan>1}">
                            <span :class="checkCondition(key, cellValue[key])">
                                {{ cellValue[key] }}
                            </span>
                        </td>
                        <slot name="custom" :row="cellValue"></slot>
                    </tr>
                    <tr v-if="tableContent.tableRows.lower">
                        <td
                            v-for="({key, colspan, rowspan}, j) in tableContent.tableRows.lower"
                            :key="j" :colspan="colspan" :rowspan="rowspan" class="lower hai-ben"
                        >
                            <span :class="checkCondition(key, cellValue[key])">
                                {{ cellValue[key] }}
                            </span>
                        </td>
                    </tr>
                </template>
                <tr v-if="totalColumns?.length>0">
                    <th scope="row" class="text-center lower hai-ben">
                        <strong>Tổng cộng</strong>
                    </th>

                    <td v-for="cell_number in tableContent.tableHeaders?.upper.length-1"
                        class="lower hai-ben text-center"
                    >
                        <strong>{{ total[cell_number] ?? '' }}</strong>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    tableContent: { type: Object, required: true },
    // const tableContent = {
    //     tableHeaders: {
    //         upper: [
    //             {name: 'Mã mặt hàng', colspan: 1, rowspan: 2},
    //             {name: 'Tên mặt hàng', colspan: 1, rowspan: 2},
    //             {name: 'Bán hàng', colspan: 3, rowspan: 1},
    //             {name: 'Giá vốn', colspan: 2, rowspan: 1}, 
    //             {name: 'Lợi nhuận', colspan: 2, rowspan: 1},
    //             {name: 'Tỷ suất lợi nhuận', colspan: 1, rowspan: 2},
    //         ],
    //         lower: [
    //             {name: 'Số lượng', colspan: 1, rowspan: 1},
    //             {name: 'Đơn giá T.Bình', colspan: 1, rowspan: 1},
    //             {name: 'Số tiền', colspan: 1, rowspan: 1},
    //             {name: 'Đơn giá T.Bình', colspan: 1, rowspan: 1},
    //             {name: 'Số tiền', colspan: 1, rowspan: 1},
    //             {name: 'Đơn giá', colspan: 1, rowspan: 1},
    //             {name: 'Số tiền', colspan: 1, rowspan: 1},
    //         ]
    //     },
    //     tableRows: {
    //          upper: ['id', 'name', 'ex_quantity', 'ex_average_price', 'ex_total',
    //              'im_average_price', 'im_total', 'profit_price', 'profit_total', 'rate_of_profit'],
    //          lower: ['sad', ...]
    //      }
    //     data: ref([])
    // };

    changeColumns: { type: Array, required: false, default: [] },
    changingCondition: { type: Function, required: false },

    //      totalColumns: [1, 2, 6]
    totalColumns: { type: Array, required: false },
    total: { type: Object, required: false },
});
function checkCondition(key, cellValue) {
    if(props.changeColumns.find((col) => col === key) === undefined) return;
    return props.changingCondition(key, cellValue);
}
</script>

<style scoped>
.table-container {
    border: 1px rgb(128, 128, 128, .5) solid;
    padding: 10px;
    border-radius: 10px;
}

.lower {
    border-bottom: 0.5px black solid;
}
.hai-ben{
    border-right: 0.5px black solid;
    border-left: 0.5px black solid;
}
</style>