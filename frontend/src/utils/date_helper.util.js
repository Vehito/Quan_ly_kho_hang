export default {
    getStringDate(isoDate) {
        const date = new Date(isoDate);
        const stringDate = date.getDate().toString().padStart(2, '0') + "/" +
                           (date.getMonth() + 1).toString().padStart(2, '0') + "/" +
                           date.getFullYear().toString();
        return stringDate;
    },

    getStringMonth(isoDate) {
        const date = new Date(isoDate);
        const stringDate = (date.getMonth() + 1).toString().padStart(2, '0') + "/" +
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

    getFirstOfMonth(isoDate) {
        const date = new Date(isoDate);
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    formatDateForMySQL(date) {
        // if(!date) return null;
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
    },

    getPeriod(text_peroid) {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const date = today.getDate();
        switch (text_peroid) {
            case 'year':
                return {
                    start: new Date(year, 0, 1),
                    end: new Date(year, 11, 31),
                    range: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                };
            case 'month':
                const endMonth = new Date(year, month + 1, 0, 23, 59, 59, 999)
                return {
                    start: new Date(year, month, 1),
                    end: endMonth,
                    range: Array.from({length: endMonth.getDate()}, (_, i)=>i+1)
                };
            case 'week': {
                const dayOfWeek = today.getDay(); // 0 (Sun) → 6 (Sat)
                const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                const monday = new Date(today);
                monday.setDate(date + diffToMonday);
                monday.setHours(0, 0, 0, 0);

                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                sunday.setHours(23, 59, 59, 999);

                return {
                    start: monday, end: sunday,
                    range: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
                 }
            }
            case 'quarter': {
                const quarter = Math.floor(month / 3); // 0: Q1, 1: Q2...
                const startMonth = quarter * 3;
                const endMonth = startMonth + 2;

                return {
                    start: new Date(year, startMonth, 1),
                    end: new Date(year, endMonth + 1, 0, 23, 59, 59, 999), // ngày cuối của endMonth
                    range: Array.from({length: 3}, (_, i) => 
                        startMonth + i
                    )
                };
            }
            default:
                return null;
        }
    },

    getDataSetByRange(
        data = [],
        start,
        end,
        valueAttributeName = 'price',
        timeAttributeName = 'created_at'
    ) {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const sameMonth = startDate.getFullYear() === endDate.getFullYear() &&
                        startDate.getMonth() === endDate.getMonth();
        const sameYear = startDate.getFullYear() === endDate.getFullYear();

        let range = [];
        let dataSets = [];

        if (sameMonth) {
            const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
            range = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            dataSets = Array(daysInMonth).fill(0);

            data.forEach(item => {
                const itemDate = new Date(item[timeAttributeName]);
                if (
                    itemDate.getFullYear() === startDate.getFullYear() &&
                    itemDate.getMonth() === startDate.getMonth()
                ) {
                    const day = itemDate.getDate();
                    dataSets[day - 1] += Number(item[valueAttributeName]) || 0;
                }
            });
        } else if (sameYear) {
            range = Array.from({ length: 12 }, (_, i) => i + 1);
            dataSets = Array(12).fill(0);

            data.forEach(item => {
                const itemDate = new Date(item[timeAttributeName]);
                if (itemDate.getFullYear() === startDate.getFullYear()) {
                    const month = itemDate.getMonth(); // 0-11
                    dataSets[month] += Number(item[valueAttributeName]) || 0;
                }
            });
        } else {
            const startYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();
            const yearCount = endYear - startYear + 1;

            range = Array.from({ length: yearCount }, (_, i) => startYear + i);
            dataSets = Array(yearCount).fill(0);

            data.forEach(item => {
                const itemDate = new Date(item[timeAttributeName]);
                const year = itemDate.getFullYear();
                if (year >= startYear && year <= endYear) {
                    const index = year - startYear;
                    dataSets[index] += Number(item[valueAttributeName]) || 0;
                }
            });
        }

        return { dataSets, range };
    }

}