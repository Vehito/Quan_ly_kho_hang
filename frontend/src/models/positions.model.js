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
    #id;
    #name;
    #level;
    #description;

    constructor(data) {
        this.#id = data.id ?? null,
        this.#name = data.name,
        this.#level = data.level,
        this.#description = data.description ?? null
    }

    get id() { 
        return this.#id; 
    }
    get name() {
        return this.#name;
    }
    get level() {
        return this.#level;
    }
    get description() {
        return this.#description;
    }
}