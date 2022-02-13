
const effectMultipliers = {
    "constant": function () {
        return this.value;
    },
    "arithmetic": function () {
        var effect = 1 + this.value * this.level;
        return effect;
    },
    "inverse": function () {
        return 1 / (1 + this.value * this.level);
    },
    "log": function () {
        var multiplier = 1 + Math.log(this.level + 1) / Math.log(this.value); 
        return multiplier
    },
}

export default class Multiplier extends Function {

    static concat(...multipliers) {
        let n = new Multiplier();

        for (let m of multipliers) {
            if (m !== undefined) {
                n.functions = n.functions.concat(m.functions);
            }
        }

        return n;
    }

    functions = [];

    constructor(name, object) {
        super();

        if (name !== undefined) {
            this.functions.push(effectMultipliers[name].bind(object));
        }

        return new Proxy(this, {
            apply: (target, thisArg, args) => target.process(...args)
        });
    }

    process(value, decimal = 0) {
        var finalMultiplier = 1;
        this.functions.forEach((func) => {
            let multiplier = func();
            finalMultiplier *= multiplier;
        });
        let powerOfTen = Math.pow(10, decimal);
        let finalValue = Math.round(value * finalMultiplier * powerOfTen) / powerOfTen;
        return finalValue;
    }

    wrap(func) {
        let wrapper = new Multiplier();
        wrapper.functions.push(() => func(this));
        return wrapper;
    }
};
