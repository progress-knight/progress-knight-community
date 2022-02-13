import Effect from "./effect.mjs"
import Multiplier from "./multiplier.mjs"

export default class Sheet {

    multiplierMap = new Map();

    createMultipliers(game) {
        this.multiplierMap.set('happiness', Effect.createMultiplierList(game.entityMap.values(), "happiness"))
        this.multiplierMap.set('all_xp', Effect.createMultiplierList(game.entityMap.values(), "all_xp"));
        this.multiplierMap.set('all_skill_xp', Effect.createMultiplierList(game.entityMap.values(), "all_skill_xp"));
        this.multiplierMap.set('all_job_xp', Effect.createMultiplierList(game.entityMap.values(), "all_job_xp"));
        this.multiplierMap.set('all_job_pay', Effect.createMultiplierList(game.entityMap.values(), "all_job_pay"));
        this.multiplierMap.set('lifespan', Effect.createMultiplierList(game.entityMap.values(), "lifespan"));
        this.multiplierMap.set('gamespeed', Effect.createMultiplierList(game.entityMap.values(), "gamespeed"));
        this.multiplierMap.set('evil', Effect.createMultiplierList(game.entityMap.values(), "evil"));
        this.multiplierMap.set('expense', Effect.createMultiplierList(game.entityMap.values(), "expense"));

        for (let category of game.categoryMap.values()) {
            let paramsXp = ["category_xp", category.name];
            let categoryXp = Effect.createMultiplierList(game.entityMap.values(), "category_xp", category);
            this.multiplierMap.set(paramsXp, categoryXp);

            let paramsPay = ["category_pay", category.name];
            let categoryPay = Effect.createMultiplierList(game.entityMap.values(), "category_xp", category);
            this.multiplierMap.set(paramsPay, categoryPay);
        }

        for (let skill of game.skillMap.values()) {
            let paramsXp = ["skill_xp", skill.name];
            let skillXp = Effect.createMultiplierList(game.entityMap.values(), "skill_xp", skill);
            this.multiplierMap.set(paramsXp, skillXp);
        }

        for (let job of game.jobMap.values()) {
            let paramsXp = ["job_xp", job.name];
            let jobXp = Effect.createMultiplierList(game.entityMap.values(), "job_xp", job);
            this.multiplierMap.set(paramsXp, jobXp);

            let paramsPay = ["job_pay", job.name];
            let jobPay = Effect.createMultiplierList(game.entityMap.values(), "job_pay", job);
            this.multiplierMap.set(paramsPay, jobPay);
        }
    }

    getMultiplierList(type, entity) {
        var list;

        if (entity === undefined) {
            list = this.multiplierMap.get(type);
        } else {
            list = [];

            if (type.includes("_xp")) {
                list = list.concat(this.multiplierMap.get("happiness"), this.multiplierMap.get("all_xp"));

                if (type === "skill_xp") {
                    list = list.concat(this.multiplierMap.get("all_skill_xp"));
                }
    
                if (type === "job_xp") {
                    list = list.concat(this.multiplierMap.get("all_job_xp"));
                }

                if (entity !== undefined) {
                    if (entity.category !== undefined) {
                        var tempList = this.multiplierMap.get(["category_xp", entity.category.name]);

                        if (tempList !== undefined) {
                            list = list.concat(tempList);
                        }
                    }

                    if (type === "skill_xp") {
                        var tempList = this.multiplierMap.get(["skill_xp", entity.name]);

                        if (tempList !== undefined) {
                            list = list.concat(tempList);
                        }
                    }

                    if (type === "job_xp") {
                        var tempList = this.multiplierMap.get(["job_xp", entity.name]);

                        if (tempList !== undefined) {
                            list = list.concat(tempList);
                        }
                    }
                } 
            }

            if (type === "job_pay") {
    
                list = list.concat(this.multiplierMap.get("all_job_pay"));

                if (entity !== undefined) {
                    if (entity.category !== undefined) {
                        var tempList = this.multiplierMap.get(["category_pay", entity.category.name]);

                        if (tempList !== undefined) {
                            list = list.concat(tempList);
                        }
                    }
                        
                    var tempList = this.multiplierMap.get(["job_pay", entity.name]);

                    if (tempList !== undefined) {
                        list = list.concat(tempList);
                    }
                } 
            }
        }

        return list;
    }

    getMultiplier(type, entity) {
        return Multiplier.createMultiplier(this.getMultiplierList(type, entity));
    }

}