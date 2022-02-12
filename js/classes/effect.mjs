import Multiplier from "./multiplier.mjs"

const effectNamers = {
    "happiness":    "Happiness",
    "expense":      "Expense",
    "all_xp":       "All xp",
    "all_skill_xp": "Skill xp",
    "all_job_xp":   "Job xp",
    "category_xp": function () {
        return this.base.category + " xp";
    },
    "skill_xp": function () {
        return this.base.skill + " xp";
    },
    "all_job_pay":  "Job pay",
    "category_pay": function () {
        return this.base.category + " pay";
    },
    "lifespan":     "Longer lifespan",
    "gamespeed":    "Gamespeed",
    "evil":         "Evil",
}

export default class Effect {

    static createMultiplier(entityList, type, targetEntity) {
        return Multiplier.createMultiplier(this.createMultiplierList(entityList, type, targetEntity));
    }

    static createMultiplierList(entityList, type, targetEntity) {
        let multiplierList = [];

        for (let entity of entityList) {
            if (entity.effect !== undefined && entity.effect.type == type) {
                if (entity.effect.type.indexOf("skill") == 0) {
                    if (targetEntity === undefined
                        || targetEntity.name != entity.effect.base.skill) {
                        continue;
                    }
                }

                if (entity.effect.type.indexOf("job") == 0) {
                    if (targetEntity === undefined
                        || targetEntity.name != entity.effect.base.job) {
                        continue;
                    }
                }

                if (entity.effect.type.indexOf("category") == 0) {
                    if (targetEntity === undefined 
                        || (targetEntity.name != entity.effect.base.category &&
                            targetEntity.group != entity.effect.base.category)) {
                        continue;
                    }
                }

                multiplierList.push(entity.effect.multiplier);
            }
        }

        return multiplierList;
    }

    constructor(base, parent) {
        this.base = base;
        this.parent = parent;
        this.type = this.base.type;

        this.namer =  effectNamers[this.type];
        this.multiplier = Multiplier.getMultiplier(this.base.multiplier, this);
        this.descriptionMultiplier = this.multiplier;
    }

    get value() {
        return this.base.value;
    }

    get level() {
        return this.parent.level;
    }

    get description() {
        var name;
        if (typeof this.namer === 'function') {
            name = this.namer();
        } else {
            name = this.namer;
        }
        var text = "x" + String(this.descriptionMultiplier().toFixed(2)) + " " + name;
        return text;
    }
}


