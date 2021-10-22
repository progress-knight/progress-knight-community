import Base from "./base.mjs"
import Effect from "./effect.mjs";

export default class Mutation extends Base {
    constructor(base, name) {  
        super(base, name);
        this.type = "mutation";

        this.level = 0;

        if (base.effect !== undefined) {
            if (base.effect.multiplier === undefined) {
                base.effect.multiplier = "arithmetic";
            }

            this.effect = new Effect(base.effect, this);
        }
    }

    get cost() {
        return this.base.cost * (1 + this.level * 0.1);
    }

    load(save) {
        this.level = save["level"] !== undefined ? save["level"] : 0;
    }

    save() {
        return {
            "level": this.level,
        }
    }
}