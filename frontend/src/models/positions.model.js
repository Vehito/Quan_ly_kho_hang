import Model from "./model";

class PositionsModel extends Model {
    constructor() {
        super("/api/positions");
    }

    createIntance(data) {
        return new Position(data);
    }
}

export default new PositionsModel();

export class Position {
    constructor(data) {
        this.id = data.id ?? null,
        this.name = data.name,
        this.level = data.level,
        this.description = data.description ?? null
    }
}