export default {
    startingDays: 365 * 14,
    startingCoins: 0,
    gameSpeed: 400,
    lifespan: 365 * 70,
    advancement: [
        {name: "Shop",              requirement: [{coins: 50}]},
        {name: "Automation",        requirement: [{age: 20}]},
        {name: "Rebirth tab",       requirement: [{age: 25}]},
        {name: "Rebirth note 1",    requirement: [{age: 45}]},
        {name: "Rebirth note 2",    requirement: [{age: 65}]},
        {name: "Rebirth note 3",    requirement: [{age: 200}]},
        {name: "Time warping info", requirement: [{job: "Mage", level: 10}]},
        {name: "Evil info",         requirement: [{evil: 1}]},
    ]
}