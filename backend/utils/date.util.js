export default {
    countWeekdaysInMonth(weekdays, month, year) {
        const weekdayMap = {
            'CN': 0,
            'T2': 1,
            'T3': 2,
            'T4': 3,
            'T5': 4,
            'T6': 5,
            'T7': 6
        };

        const weekdayNumbers = weekdays.map(wd => weekdayMap[wd]);
        let count = 0;

        const daysInMonth = new Date(year, month, 0).getDate(); // Số ngày trong tháng

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const weekday = date.getDay(); // 0 (CN) đến 6 (T7)
            if (weekdayNumbers.includes(weekday)) {
                count++;
            }
        }

        return count;
    }
}