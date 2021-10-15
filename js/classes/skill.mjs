import Task from "./task.mjs"
import Effect from "./effect.mjs";

export default class Skill extends Task {

    constructor(base, name) {
        super(base, name);
        this.type = "skill";

        if (base.effect !== undefined) {
            if (base.effect.multiplier === undefined) {
                base.effect.multiplier = "arithmetic";
            }

            this.effect = new Effect(base.effect, this);
        }
    }
}