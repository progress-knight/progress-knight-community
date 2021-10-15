import Requirement from "./requirement.mjs"

export default class Base {

    constructor(base, name) {
        this.base = base;
        this.name = name;

        this.requirement = new Requirement(this.base.requirement);
    }

    get tooltip() {
        return this.base.tooltip ? this.base.tooltip : "";
    }

    load(save) { }

    save() { return {}; }
}