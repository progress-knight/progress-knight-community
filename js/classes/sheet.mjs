import Effect from "./effect.mjs"
import Multiplier from "./multiplier.mjs"

export default class Sheet {

    multiplierMap = new Map();

    createMultipliers(game) {
        this.multiplierMap.set('happiness', Effect.createMultiplier(game.entityMap.values(), "happiness"))
        this.multiplierMap.set('all_xp', Effect.createMultiplier(game.entityMap.values(), "all_xp"));
        this.multiplierMap.set('all_skill_xp', Effect.createMultiplier(game.entityMap.values(), "all_skill_xp"));
        this.multiplierMap.set('all_job_xp', Effect.createMultiplier(game.entityMap.values(), "all_job_xp"));
        this.multiplierMap.set('all_job_pay', Effect.createMultiplier(game.entityMap.values(), "all_job_pay"));
        this.multiplierMap.set('lifespan', Effect.createMultiplier(game.entityMap.values(), "lifespan"));
        this.multiplierMap.set('gamespeed', Effect.createMultiplier(game.entityMap.values(), "gamespeed"));
        this.multiplierMap.set('evil', Effect.createMultiplier(game.entityMap.values(), "evil"));
        this.multiplierMap.set('expense', Effect.createMultiplier(game.entityMap.values(), "expense"));

        for (let category of game.categoryMap.values()) {
            let paramsXp = ["category_xp", category.name];
            let categoryXp = Effect.createMultiplier(game.entityMap.values(), "category_xp", category);
            this.multiplierMap.set(paramsXp, categoryXp);

            let paramsPay = ["category_pay", category.name];
            let categoryPay = Effect.createMultiplier(game.entityMap.values(), "category_xp", category);
            this.multiplierMap.set(paramsPay, categoryPay);
        }

        for (let skill of game.skillMap.values()) {
            let paramsXp = ["skill_xp", skill.name];
            let skillXp = Effect.createMultiplier(game.entityMap.values(), "skill_xp", skill);
            this.multiplierMap.set(paramsXp, skillXp);
        }

        for (let job of game.jobMap.values()) {
            let paramsXp = ["job_xp", job.name];
            let jobXp = Effect.createMultiplier(game.entityMap.values(), "job_xp", job);
            this.multiplierMap.set(paramsXp, jobXp);

            let paramsPay = ["job_pay", job.name];
            let jobPay = Effect.createMultiplier(game.entityMap.values(), "job_pay", job);
            this.multiplierMap.set(paramsPay, jobPay);
        }
    }

    getMultiplier(type, entity) {
        var multiplier;

        if (entity === undefined) {
            multiplier = this.multiplierMap.get(type);
        } else {
            if (type.includes("_xp")) {
                multiplier = Multiplier.concat(multiplier, this.multiplierMap.get("happiness"), this.multiplierMap.get("all_xp"));

                if (type === "skill_xp") {
                    multiplier = Multiplier.concat(multiplier, this.multiplierMap.get("all_skill_xp"));
                }
    
                if (type === "job_xp") {
                    multiplier = Multiplier.concat(multiplier, this.multiplierMap.get("all_job_xp"));
                }

                if (entity !== undefined) {
                    if (entity.category !== undefined) {
                        multiplier = Multiplier.concat(multiplier, this.multiplierMap.get(["category_xp", entity.category.name]));
                    }

                    if (type === "skill_xp") {
                        multiplier = Multiplier.concat(multiplier, this.multiplierMap.get(["skill_xp", entity.name]));
                    }

                    if (type === "job_xp") {
                        multiplier = Multiplier.concat(multiplier, this.multiplierMap.get(["job_xp", entity.name]));
                    }
                } 
            }

            if (type === "job_pay") {
    
                multiplier = Multiplier.concat(multiplier, this.multiplierMap.get("all_job_pay"));

                if (entity !== undefined) {
                    if (entity.category !== undefined) {
                        multiplier = Multiplier.concat(multiplier, this.multiplierMap.get(["category_pay", entity.category.name]));
                    }
                        
                    multiplier = Multiplier.concat(multiplier, this.multiplierMap.get(["job_pay", entity.name]));
                } 
            }
        }

        return multiplier;
    }
}