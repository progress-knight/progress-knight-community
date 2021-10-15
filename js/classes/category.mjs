import Base from "./base.mjs"

export default class Category extends Base {

    constructor(base, name) {
        super(base, name);
    }

    get color() {
        return this.base.color;
    }

    get group() {
        return this.base.group;
    }

    get unique() {
        return this.base.unique !== undefined ? this.base.unique : false;
    }
}