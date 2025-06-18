export default {
    getStringDate(isoDate) {
        const date = new Date(isoDate);
        const stringDate = date.getDate().toString().padStart(2, '0') + "/" +
                           (date.getMonth() + 1).toString().padStart(2, '0') + "/" +
                           date.getFullYear().toString();
        return stringDate;
    },

    getStringDateTime(isoDate) {
        const date = new Date(isoDate);
        const stringDateTime = date.getDate().toString().padStart(2, '0') + "/" +
                           (date.getMonth() + 1).toString().padStart(2, '0') + "/" +
                           date.getFullYear().toString() + " " +
                           date.getHours().toString().padStart(2, '0') + ":" +
                           date.getMinutes().toString().padStart(2, '0')
        return stringDateTime;
    },

    getModelValue(isoDate) {
        const date = new Date(isoDate);
        const stringDate = date.getFullYear().toString() + "-" + 
                           (date.getMonth() + 1).toString().padStart(2, '0') + "-" +
                           date.getDate().toString().padStart(2, '0');
        return stringDate;
    },

    formatDateForMySQL(date) {
        const d = new Date(date);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },

    isOverdue(isoDate) {
        const deadline = new Date(isoDate);
        const today = new Date();
        if(deadline.getTime() < today.getTime()) {
            return true;
        }
        return false;
    }
}