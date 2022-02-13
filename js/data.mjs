import Game from "./classes/game.mjs";
import gameData from "./data/game.mjs";
import Job from "./classes/job.mjs";
import jobData from "./data/job.mjs";
import Skill from "./classes/skill.mjs";
import skillData from "./data/skill.mjs";
import HomeItem from "./classes/item.mjs";
import homeItemData from "./data/home.mjs";
import Mutation from "./classes/mutation.mjs";
import mutationData from "./data/mutation.mjs";
import Category from "./classes/category.mjs";
import categoryData from "./data/category.mjs";
import Sheet from "./classes/sheet.mjs";
import Multiplier from "./classes/multiplier.mjs"

export default function init() {
    let newGame = new Game(gameData);
    newGame.jobMap = createData(Job, jobData);
    newGame.skillMap = createData(Skill, skillData);
    newGame.itemMap = createData(HomeItem, homeItemData);
    newGame.mutationMap = createData(Mutation, mutationData);

    newGame.entityMap = mergeMap(newGame.jobMap, newGame.skillMap, newGame.itemMap, newGame.mutationMap);
    newGame.taskMap = mergeMap(newGame.jobMap, newGame.skillMap);

    newGame.categoryMap = createData(Category, categoryData);
    newGame.jobCategoryMap = createCategoryMap(newGame.categoryMap, newGame.jobMap, "job");
    newGame.skillCategoryMap = createCategoryMap(newGame.categoryMap, newGame.skillMap, "skill");
    newGame.homeCategoryMap = createCategoryMap(newGame.categoryMap, newGame.itemMap, "home");
    newGame.mutationCategoryMap = createCategoryMap(newGame.categoryMap, newGame.mutationMap, "mutation");

    newGame.currentJob = newGame.jobMap.get("Beggar");
    newGame.currentSkill = newGame.skillMap.get("Concentration");
    newGame.putItem(newGame.itemMap.get("Homeless"));

    setMulipliers(newGame);

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

function setMulipliers(game) {
    let sheet = new Sheet();
    sheet.createMultipliers(game);

    game.happinessMultiplier = sheet.getMultiplier("happiness");
    game.lifespanMultiplier =  sheet.getMultiplier("lifespan");
    game.gamespeedMultiplier = sheet.getMultiplier("gamespeed");
    game.evilMultiplier = sheet.getMultiplier("evil");

    for (let skill of game.skillMap.values()) {
        skill.xpMultiplier = sheet.getMultiplier("skill_xp", skill);
    }

    for (let job of game.jobMap.values()) {
        job.xpMultiplier = sheet.getMultiplier("job_xp", job);
    }

    for (let job of game.jobMap.values()) {
        let payMultiplier = new Multiplier("log", {job: job, value: 10, get level() { return this.job.level }, });
        
        let jobPay = sheet.getMultiplier("job_pay", job);
        payMultiplier = Multiplier.concat(payMultiplier, jobPay);

        job.payMultiplier = payMultiplier;
    }

    for (let item of game.itemMap.values()) {
        item.expenseMultiplier = sheet.getMultiplier("expense");
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