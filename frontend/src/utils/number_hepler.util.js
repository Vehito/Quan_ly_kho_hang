export default {
    getCurrencyFormat(num) {
        return new Intl.NumberFormat("vn-VN", { style: 'currency', currency: 'VND' }).format(num);
    },

    getFormattedNumber(num) {
        return num.toLocaleString('vi-VN');
    }
}