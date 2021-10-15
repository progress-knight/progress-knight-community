import Task from "./task.mjs"

export default class Job extends Task {

    constructor(base, name) {
        super(base, name);
        this.type = "job";
    }
    
    get income() {
        return this.payMultiplier(this.base.income);
    }
}