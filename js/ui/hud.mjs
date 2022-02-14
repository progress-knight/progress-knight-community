import {daysToYears, days, } from "../utils/days.mjs"
import {importSave, exportSave, resetSave, } from "../utils/save.mjs"
import {formatCoins, formatNumber, } from "./format.mjs"

export default function HUD(document, game) {

    document.getElementById("pauseButton").addEventListener("click", function() { setPause(game); });
    document.getElementById("timeWarpingButton").addEventListener("click", function() { setTimeWarping(game); });
    document.getElementById("autoPromote").addEventListener("click", function() { autoPromote(game, this.checked); });
    document.getElementById("autoLearn").addEventListener("click", function() { autoLearn(game, this.checked); });
    document.getElementById("LightDarkModeButton").addEventListener("click", function() { setLightDarkMode(game); });
    document.getElementById("rebirthOne").addEventListener("click", function() { rebirthOne(game); });
    document.getElementById("rebirthTwo").addEventListener("click", function() { rebirthTwo(game); });

    document.getElementById("importSave").addEventListener("click", function() { domImportSave(document); });
    document.getElementById("exportSave").addEventListener("click", function() { domExportSave(document); });
    document.getElementById("resetSave").addEventListener("click", function() { resetSave(); });

    return function() {
        document.getElementById("ageDisplay").textContent = daysToYears(game.days);
        document.getElementById("dayDisplay").textContent = days(game.days);
        document.getElementById("lifespanDisplay").textContent = daysToYears(game.lifespan);
        document.getElementById("pauseButton").textContent = game.paused ? "Play" : "Pause"
    
        formatCoins(game.coins, document.getElementById("coinDisplay"))
        formatCoins(game.net, document.getElementById("netDisplay"))
        formatCoins(game.income, document.getElementById("incomeDisplay"))
        formatCoins(game.expense, document.getElementById("expenseDisplay"))
    
        formatNumber(game.happiness, document.getElementById("happinessDisplay"));
        formatNumber(game.evil, document.getElementById("evilDisplay"));
        formatNumber(game.evilGain, document.getElementById("evilGainDisplay"));
    
        document.getElementById("timeWarpingDisplay").textContent = "x" + game.timeWarpingSpeed;
        document.getElementById("timeWarpingButton").textContent = game.timeWarpingEnabled ? "Disable warp" : "Enable warp"
    
        updateSignDisplay(document, game);
        updateQuickTaskDisplay("job", game.currentJob);
        updateQuickTaskDisplay("skill", game.currentSkill);
    }
}

function updateSignDisplay(document, game) {
    var signDisplay = document.getElementById("signDisplay");
    if (game.income > game.expense) {
        signDisplay.textContent = "+"
        signDisplay.style.color = "green"
    } else if (game.expense > game.income) {
        signDisplay.textContent = "-"
        signDisplay.style.color = "red"
    } else {
        signDisplay.textContent = ""
        signDisplay.style.color = "gray"
    }

    var deathText = document.getElementById("deathText");
    if (!game.alive) {
        deathText.classList.remove("hidden");
    } else {
        deathText.classList.add("hidden");
    }
}

function updateQuickTaskDisplay(taskType, currentTask) {
    var quickTaskDisplayElement = document.getElementById("quickTaskDisplay");
    var progressBar = quickTaskDisplayElement.getElementsByClassName(taskType)[0];
    progressBar.getElementsByClassName("name")[0].textContent = currentTask.name + " lvl " + currentTask.level;
    progressBar.getElementsByClassName("progressFill")[0].style.width = currentTask.xp / currentTask.getMaxXp() * 100 + "%";
}

function setPause(game) {
    game.paused = !game.paused;
}

function setTimeWarping(game) {
    game.timeWarpingEnabled = !game.timeWarpingEnabled;
}

function setLightDarkMode() {
    var body = document.getElementById("body")
    body.classList.contains("dark") ? body.classList.remove("dark") : body.classList.add("dark");
}

function autoPromote(game, value) {
    game.automation.autoPromote = value;
}

function autoLearn(game, value) {
    game.automation.autoLearn = value;
}

function rebirthOne() {
    game.rebirth();
}

function rebirthTwo() {
    game.rebirthEvil();   
}

function domImportSave(document) {
    var importExportBox = document.getElementById("importExportBox");
    importSave(importExportBox.value);
}

function domExportSave(document) {
    var importExportBox = document.getElementById("importExportBox");
    importExportBox.value = exportSave();
}