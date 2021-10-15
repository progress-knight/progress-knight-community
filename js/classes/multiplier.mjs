
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

export default class Multiplier {
    static getMultiplier(name, object) {
        return effectMultipliers[name].bind(object);
    }

    static createMultiplier(list) {
        var multiplierList = list;

        return function(value, decimal = 0) {
            let finalMultiplier = 1;
            multiplierList.forEach(function(multiplierFunction) {
                let multiplier = multiplierFunction();
                finalMultiplier *= multiplier;
            });
            let powerOfTen = Math.pow(10, decimal);
            let finalValue = Math.round(value * finalMultiplier * powerOfTen) / powerOfTen;
            return finalValue;
        }
    }
};
