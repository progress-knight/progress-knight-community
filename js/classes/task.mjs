import Base from "./base.mjs"

export default class Task extends Base {

    constructor(base, name) {
        super(base, name);

        this.level = 0;
        this.maxLevel = 0;
        this.xp = 0;
    }

    getMaxXp() {
        var maxXp = Math.round(this.base.maxXp * (1 + 0.5 * this.level) * Math.pow(1.01, this.level))
        return maxXp
    }

    getXpLeft() {
        return Math.round(this.getMaxXp() - this.xp)
    }

    getMaxLevelMultiplier() {
        var maxLevelMultiplier = 1 + this.maxLevel / 10
        return maxLevelMultiplier
    }

    getXpGain() {
        return this.xpMultiplier(10);
    }

    increaseXp(delta) {
        this.xp += delta * this.getXpGain();
        if (this.xp >= this.getMaxXp()) {
            var excess = this.xp - this.getMaxXp()
            while (excess >= 0) {
                this.level += 1
                excess -= this.getMaxXp()
            }
            this.xp = this.getMaxXp() + excess
        }
    }

    load(save) {
        this.level = save["level"];
        this.maxLevel = save["maxLevel"];
        this.xp = save["xp"];
    }

    save() {
        return {
            "level": this.level,
            "maxLevel": this.maxLevel,
            "xp": this.xp,
        }
    }
}
