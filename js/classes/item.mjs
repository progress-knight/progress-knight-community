import Base from "./base.mjs"
import Effect from "./effect.mjs";
import Multiplier from "./multiplier.mjs";

export default class Item extends Base {
    constructor(base, name) {  
        super(base, name);
        this.type = "item";

        this.active = false;

        if (base.effect !== undefined) {
            if (base.effect.multiplier === undefined) {
                base.effect.multiplier = "constant";
            }

            this.effect = new Effect(base.effect, this);
            this.effect.multiplier = this.effect.multiplier.wrap((wrapped) => this.active ? wrapped(1) : 1);
        }

        if (this.requirement.base === undefined) {
            this.requirement.base = [{"coins": this.expense * 100}];
        }
    }

    get expense() {
        return this.expenseMultiplier ? this.expenseMultiplier(this.base.expense) : this.base.expense;
    }


    load(save) {
        this.active = save["active"];
    }

    save() {
        return {
            "active": this.active,
        };
    }
}