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

    isOverdue(isoDate) {
        const deadline = new Date(isoDate);
        const today = new Date();
        if(deadline.getTime() < today.getTime()) {
            return true;
        }
        return false;
    }
}