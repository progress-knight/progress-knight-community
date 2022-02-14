import Multiplier from "./multiplier.mjs"

let filterCategory = function (entity) {
    if (entity === undefined 
        || (entity.name != this.base.category &&
            entity.group != this.base.category)) {
        return true;
    }
    return false;
};

let filterSkill = function (entity) {
    if (entity === undefined || entity.name != this.base.skill) {
        return true;
    }
    return false;
};

let filterJob = function (entity) {
    if (entity === undefined || entity.name != this.base.job) {
        return true;
    }
    return false;
};

const effectDescriptors = {
    "happiness": {
        "namer": "Happiness",
    },
    "expense": {
        "namer": "Expense",
    },
    "all_xp": {
        "namer": "All xp",
    },
    "all_skill_xp": {
        "namer": "Skill xp",
    },
    "all_job_xp": {
        "namer": "Job xp"
    },
    "category_xp": {
        "namer": function () {
            return this.base.category + " xp";
        },
        "filter": filterCategory,
    },
    "skill_xp": {
        "namer": function () {
            return this.base.skill + " xp";
        },
        "filter": filterSkill,
    },
    "job_xp": {
        "namer": function () {
            return this.base.job + " xp";
        },
        "filter": filterJob,
    },
    "all_job_pay": {
        "namer": "Job pay",
    },
    "category_pay": {
        "namer": function () {
            return this.base.category + " pay";
        },
        "filter": filterCategory,
    },
    "lifespan": {
        "namer": "Longer lifespan",
    },
    "gamespeed": {
        "namer": "Gamespeed",
    },
    "evil": {
        "namer": "Evil",
    },
}

export default class Effect {

    static createMultiplier(entityList, type, targetEntity) {
        let multiplier;

        for (let entity of entityList) {
            if (entity.effect !== undefined && entity.effect.type == type) {

                var filter = false;

                if (entity.effect.filter !== undefined) {
                    filter = entity.effect.filter(targetEntity);
                }

                if (filter) {
                    continue;
                }

                multiplier = Multiplier.concat(multiplier, entity.effect.multiplier);
            }
        }

        return multiplier;
    }

    constructor(base, parent) {
        this.base = base;
        this.parent = parent;
        this.type = this.base.type;

        if (effectDescriptors[this.type] !== undefined) {
            if (effectDescriptors[this.type].namer !== undefined) {
                this.namer = effectDescriptors[this.type].namer;
            }
            if (effectDescriptors[this.type].filter !== undefined) {
                this.filter = effectDescriptors[this.type].filter;
            }
        }
        
        this.multiplier = new Multiplier(this.base.multiplier, this);

        this.descriptionMultiplier = this.multiplier;
    }

    get value() {
        return this.base.value;
    }

    get level() {
        return this.parent.level;
    }

    get description() {
        var name = (typeof this.namer === 'function') ? this.namer() : this.namer;

        var text = "x" + String(this.descriptionMultiplier(1, 2).toFixed(2)) + " " + name;
        return text;
    }
}


