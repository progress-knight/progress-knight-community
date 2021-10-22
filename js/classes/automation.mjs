
export default class Automation {

    constructor(game) {
        this.game = game;

        this.autoPromote = false;
        this.autoLearn = false;
        this.autoInterval = 1;

        this.skipSkillSet = new Set();

        this.currentDelta = 0;
    }

    update(delta) {
        this.currentDelta += delta;

        if (this.currentDelta > this.autoInterval) {
            this.currentDelta = 0;

            if (this.autoPromote) this.doAutoPromote(this.game);
            if (this.autoLearn) this.doAutoLearn(this.game);
        }
    }

    skipSkill(skill, value) {
        if (value) {
            this.skipSkillSet.add(skill.name);
        } else {
            this.skipSkillSet.delete(skill.name);
        }
    }

    doAutoPromote(game) {
        let category = game.currentJob.category;
        let nextIndex = category.list.indexOf(game.currentJob) + 1;
    
        if (nextIndex > category.list.length - 1)
            return;

        let nextEntity = category.list[nextIndex];

        if (nextEntity == null) 
            return;

        if (nextEntity.requirement.completed)
            game.currentJob = nextEntity;
    }

    doAutoLearn(game) {
        var nextSkill = null;
        var nextMaxXp = null;

        for (let skill of game.skillMap.values()) {
            if (skill.requirement.completed && !this.skipSkillSet.has(skill.name)) {
                let maxXp = skill.getMaxXp() / skill.getXpGain();

                if (nextMaxXp === null || nextMaxXp > maxXp) {
                    nextSkill = skill;
                    nextMaxXp = maxXp;
                }
            }
        }

        if (nextSkill != null)
            game.currentSkill = nextSkill;
    }
}
