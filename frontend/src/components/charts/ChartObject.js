export class ChartObject {
    constructor(data) {
        this.labels = data?.labels ?? [];
        this.datasets = data?.dataset ?? [new DataSets()];
    }
}

export class DataSets {
    constructor(data) {
        this.label = data?.label ?? '';
        this.data = data?.data ?? [];
        this.backgroundColor = data?.backgroundColor ?? 'blue';
    }
}