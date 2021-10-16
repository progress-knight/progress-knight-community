import Requirement from "./requirement.mjs"
import Automation from "./automation.mjs"

export default class Game {

    constructor(base) {
        this.base = base;

        this.days = this.base.startingDays;
        this.coins = this.base.startingCoins;
        this.evil = 0;

        this.paused = true;
        this.autoLearned = false;
        this.timeWarpingEnabled = false;
    
        this.rebirthCount = 0;
        this.rebirthEvilCount = 0;
    
        this.currentJob = null;
        this.currentSkill = null;
        this.currentItems = [];

        this.advancementMap = new Map();
        for (let advancement of base.advancement) {
            this.advancementMap.set(advancement.name, new Requirement(advancement.requirement));
        }

        this.automation = new Automation(this);
    }

    get happiness() {
        return this.happinessMultiplier(1, 1);
    }

    get net() {
        return this.income - this.expense;
    }

    get income() {
        var income = 0
        income += this.currentJob.income;
        return income
    }

    get expense() {
        var expense = 0;
        for (let item of this.currentItems) {
            expense += item.expense;
        }
        return expense;
    }

    get lifespan() {
        return this.lifespanMultiplier(this.base.lifespan);
    }

    get evilGain() {
        return this.evilMultiplier(1, 1);
    }

    get alive() {
        return this.days < this.lifespan;
    }

    get timeWarpingSpeed() {
        var speed = game.gamespeedMultiplier ? game.gamespeedMultiplier(1) : 1;
        return speed ? speed : 1;
    }

    update(delta) {
        delta = this.applySpeed(delta);

        this.increaseDays(delta);
        this.currentJob.increaseXp(delta);
        this.currentSkill.increaseXp(delta);
        this.increaseCoins(delta);

        this.automation.update(delta);
    }

    applySpeed(delta) {
        let timeWarpingSpeed = this.timeWarpingEnabled ? this.timeWarpingSpeed : 1;
        let mustIncrease = !this.paused && this.alive ? 1 : 0;

        let gameSpeed = mustIncrease * this.base.gameSpeed * timeWarpingSpeed;
        return delta * gameSpeed;
    }

    increaseDays(delta) {
        this.days += delta;
    }

    increaseCoins(delta) {
        var coins = delta * this.net;
        this.coins += coins;

        this.checkBankrupt();
    }
    
    checkBankrupt() {
        if (this.coins < 0) {    
            this.coins = 0;
            this.clearItems();
            this.putItem(this.itemMap.get("Homeless"));
        }
    }

    putItem(item) {
        this.currentItems.push(item);
        item.active = true;

        if (item.category.unique) {
            this.currentItems = this.currentItems.filter((filtered) => {
                if (filtered !== item && filtered.category.name == item.category.name) {
                    filtered.active = false;
                    return false;
                }
                return true;
            });  
        }
    }

    removeItem(item) {
        if (item.category.unique) return;

        const index = this.currentItems.indexOf(item);
        if (index > -1) {
            this.currentItems.splice(index, 1);
        }

        item.active = false;
    }

    clearItems() {
        for (let item of this.currentItems) {
            item.active = false;
        }

        this.currentItems = [];
    }

    reset(max) {
        this.coins = 0
        this.days = 365 * 14
        this.currentJob = this.jobMap.get("Beggar");
        this.currentSkill = this.skillMap.get("Concentration");
        this.clearItems();
        this.putItem(this.itemMap.get("Homeless"));
    
        for (let task of this.taskMap.values()) {
            if (max) {
                task.maxLevel = task.level > task.maxLevel ? task.level : task.maxLevel;
            } else {
                task.maxLevel = 0;
            }
            task.level = 0;
            task.xp = 0;

            if (!task.permanent) {
                task.requirement.completed = false;
            }
        }
    
        for (let item of this.itemMap.values()) {
            if (!item.permanent) {
                item.requirement.completed = false;
            }
        }

        for (let category of this.categoryMap.values()) {
            if (!category.permanent) {
                category.requirement.completed = false;
            }
        }

        for (let advancement of this.advancementMap) {
            if (!advancement.permanent) {
                advancement.completed = false;
            }
        }
    }

    rebirth() {
        this.rebirthCount += 1;
        this.reset(true);
    }
    
    rebirthEvil() {
        gameData.rebirthEvilCount += 1;
        gameData.evil += this.evilGain;
    
        this.reset(false);
    }

    load(save) {
        this.days = save["days"];
        this.coins = save["coins"];
        this.evil = save["evil"];

        this.rebirthCount = save["rebirth"];
        this.rebirthEvilCount = save["rebirthEvil"];

        if (this.jobMap.has(save["currentJob"]))
            this.currentJob = this.jobMap.get(save["currentJob"]);
        if (this.skillMap.has(save["currentSkill"]))
            this.currentSkill = this.skillMap.get(save["currentSkill"]);
        this.currentItems = this.loadItemList(this.itemMap, save['currentItems']);

        this.loadEntityList(this.entityMap, save["entitySave"]);
    }

    loadItemList(itemMap, itemList) {
        let list = [];
        for (let name of itemList) {
            let item = itemMap.get(name);

            if (item !== undefined) {
                item.active = true;
                list.push(item);
            }
        }
        return list;
    }

    loadEntityList(entityMap, dict) {
        for (let name in dict) {
            if (dict[name] !== undefined) {
                let entity = entityMap.get(name);

                if (entity !== undefined) {
                    entity.load(dict[name]);
                }
            }
        }
    }

    save() {
        return {
            "days": this.days,
            "coins": this.coins,
            "evil": this.evil,

            "rebirth": this.rebirthCount,
            "rebirthEvil": this.rebirthEvilCount,

            "currentJob": this.currentJob.name,
            "currentSkill": this.currentSkill.name,
            "currentItems": this.saveItemList(this.currentItems),

            "entitySave": this.saveEntityDict(this.entityMap),
        }
    }

    saveItemList(itemList) {
        let list = [];
        for (let item of itemList) {
            list.push(item.name);
        }
        return list;
    }

    saveEntityDict(entityMap) {
        let dict = {};
        for (let entity of entityMap.values()) {
            dict[entity.name] = entity.save();
        }
        return dict;
    }
}