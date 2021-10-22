import {daysToYears, } from "../utils/days.mjs"

export default class Requirement {
    constructor(base) {
        this.base = base;
        this.completed = false;
    }

    checkCompleted(game) {
        if (this.completed) { return true; }
        if (this.base === undefined) { return true; }

        for (var requirement of this.base) {
            if (!this.getCondition(requirement, game)) {
                return false
            }
        }

        this.completed = true
        return true
    }

    getCondition(requirement, game) {
        if (requirement.job !== undefined) {
            return game.jobMap.get(requirement.job).level >= requirement.level;
        }
        if (requirement.skill !== undefined) {
            return game.skillMap.get(requirement.skill).level >= requirement.level;
        }
        if (requirement.mutation !== undefined) {
            return game.mutationMap.get(requirement.mutation).level >= requirement.level;
        }
        if (requirement.coins !== undefined) {
            return game.coins >= requirement.coins;
        }
        if (requirement.age !== undefined) {
            return daysToYears(game.days) >= requirement.age;
        }
        if (requirement.evil !== undefined) {
            return game.evil >= requirement.evil;
        }
        if (requirement.rebirthEvil !== undefined) {
            return game.rebirthEvilCount >= requirement.rebirthEvil;
        }
    }
}
