import Game from "./classes/game.mjs";
import gameData from "./data/game.mjs";
import Job from "./classes/job.mjs";
import jobData from "./data/job.mjs";
import Skill from "./classes/skill.mjs";
import skillData from "./data/skill.mjs";
import Item from "./classes/item.mjs";
import itemData from "./data/item.mjs";
import Category from "./classes/category.mjs";
import categoryData from "./data/category.mjs";
import Effect from "./classes/effect.mjs";
import Multiplier from "./classes/multiplier.mjs"

export default function init() {
    let newGame = new Game(gameData);
    newGame.jobMap = createData(Job, jobData);
    newGame.skillMap = createData(Skill, skillData);
    newGame.itemMap = createData(Item, itemData);

    newGame.entityMap = mergeMap(newGame.jobMap, newGame.skillMap, newGame.itemMap);
    newGame.taskMap = mergeMap(newGame.jobMap, newGame.skillMap);

    newGame.categoryMap = createData(Category, categoryData);
    newGame.jobCategoryMap = createCategoryMap(newGame.categoryMap, newGame.jobMap, "job");
    newGame.skillCategoryMap = createCategoryMap(newGame.categoryMap, newGame.skillMap, "skill");
    newGame.itemCategoryMap = createCategoryMap(newGame.categoryMap, newGame.itemMap, "item");

    newGame.currentJob = newGame.jobMap.get("Beggar");
    newGame.currentSkill = newGame.skillMap.get("Concentration");
    newGame.putItem(newGame.itemMap.get("Homeless"));

    createMulipliers(newGame);

    return newGame;
};

function createData(clazz, data) {
    var map = new Map();

    for (let name in data) {
        var value = data[name];
        var entity = createEntity(clazz, name, value)
        map.set(name, entity);
    }

    return map;
}

function createEntity(clazz, name, value) {
    var entity = new clazz(value, name);
    return entity;
}

function createCategoryMap(categoryMap, entityMap, categoryType) {
    var map = new Map();

    for (let category of categoryMap.values()) {
        var list = [];

        for (let entity of entityMap.values()) {
            if (category.name == entity.base.category) {
                entity.category = category;
                list.push(entity);
            }
        }
        if (list.length > 0) {
            category.type = categoryType;
            category.list = list;
            map.set(category.name, category);
        }
    }

    return map;
}

function createMulipliers(game) {
    let happiness = Effect.createMultiplierList(game.entityMap.values(), "happiness");
    let allXp = Effect.createMultiplierList(game.entityMap.values(), "all_xp");
    let allSkillXp = Effect.createMultiplierList(game.entityMap.values(), "all_skill_xp");
    let allJobXp = Effect.createMultiplierList(game.entityMap.values(), "all_job_xp");
    let allJobPay = Effect.createMultiplierList(game.entityMap.values(), "all_job_pay");

    game.happinessMultiplier = Multiplier.createMultiplier(happiness);
    game.lifespanMultiplier = Effect.createMultiplier(game.entityMap.values(), "lifespan");
    game.gamespeedMultiplier = Effect.createMultiplier(game.entityMap.values(), "gamespeed");
    game.evilMultiplier = Effect.createMultiplier(game.entityMap.values(), "evil");

    let categoryXpDict = {};
    let categoryPayDict = {};

    for (let category of game.categoryMap.values()) {
        let categoryXp = Effect.createMultiplierList(game.entityMap.values(), "category_xp", category);
        
        if (categoryXp.length > 0) {
            categoryXpDict[category.name] = categoryXp;
        }

        let categoryPay = Effect.createMultiplierList(game.entityMap.values(), "category_pay", category);
        
        if (categoryPay.length > 0) {
            categoryPayDict[category.name] = categoryPay;
        }
    }

    for (let skill of game.skillMap.values()) {
        var list = allXp.concat(happiness, allSkillXp);

        if (categoryXpDict[skill.category.name] !== undefined) {
            list = list.concat(categoryXpDict[skill.category.name]);
        }

        let skillXp = Effect.createMultiplierList(game.entityMap.values(), "skill_xp", skill);
        list = list.concat(skillXp);

        skill.xpMultiplier = Multiplier.createMultiplier(list);
    }

    for (let job of game.jobMap.values()) {
        var list = allXp.concat(happiness, allJobXp);

        if (categoryXpDict[job.category.name] !== undefined) {
            list = list.concat(categoryXpDict[job.category.name]);
        }

        job.xpMultiplier = Multiplier.createMultiplier(list);
    }

    for (let job of game.jobMap.values()) {
        var list = allJobPay;

        if (categoryPayDict[job.category.name] !== undefined) {
            list = list.concat(categoryPayDict[job.category.name]);
        }

        let payMultiplier = Multiplier.getMultiplier("log", {job: job, value: 10, get level() { return this.job.level }, });
        list = list.concat([payMultiplier]);
        
        job.payMultiplier = Multiplier.createMultiplier(list);
    }

    let expense = Effect.createMultiplierList(game.entityMap.values(), "expense");

    for (let item of game.itemMap.values()) {
        item.expenseMultiplier = Multiplier.createMultiplier(expense);
    }
}

function mergeMap() {
    var merge = new Map();

    for (const map of arguments) {
        for (const [key, value] of map) {
            merge.set(key, value);
        }
    }

    return merge;
}