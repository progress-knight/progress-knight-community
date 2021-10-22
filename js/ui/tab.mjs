import {formatCoins, formatNumber, formatLargeNumber, } from "./format.mjs"

var init = false;

export default function Tab(document, game) {
    if (!init) {
        document.getElementById("jobTabButton").addEventListener("click", function() { setTab(this, 'jobs'); });
        document.getElementById("skillTabButton").addEventListener("click", function() { setTab(this, 'skills'); });
        document.getElementById("homeTabButton").addEventListener("click", function() { setTab(this, 'home'); });
        document.getElementById("evilTabButton").addEventListener("click", function() { setTab(this, 'evil'); });
        document.getElementById("rebirthTabButton").addEventListener("click", function() { setTab(this, 'rebirth'); });
        document.getElementById("settingsTabButton").addEventListener("click", function() { setTab(this, 'settings'); });
        
        createAllRows(document, game, game.jobCategoryMap, "jobTable");
        createAllRows(document, game, game.skillCategoryMap, "skillTable");
        createAllRows(document, game, game.homeCategoryMap, "homeTable");
        createAllRows(document, game, game.mutationCategoryMap, "evilTable")

        setTab(jobTabButton, "jobs");
        init = true;
    }

    updateHeaderRows(document, game, game.jobCategoryMap);
    updateHeaderRows(document, game, game.skillCategoryMap);

    updateTaskRows(document, game, game.jobMap);
    updateTaskRows(document, game, game.skillMap);
    updateItemRows(document, game, game.itemMap);
    updateMutationRows(document, game, game.mutationMap);

    updateRequiredRows(document, game, game.jobCategoryMap);
    updateRequiredRows(document, game, game.skillCategoryMap);
    updateRequiredRows(document, game, game.homeCategoryMap);
    updateRequiredRows(document, game, game.mutationCategoryMap);
}

function setTab(element, selectedTab) {

    let tabs = Array.prototype.slice.call(document.getElementsByClassName("tab"));
    tabs.forEach(function(tab) {
        tab.style.display = "none"
    });
    document.getElementById(selectedTab).style.display = "block";

    let tabButtons = document.getElementsByClassName("tabButton");
    for (let tabButton of tabButtons) {
        tabButton.classList.remove("w3-blue-gray");
    }
    element.classList.add("w3-blue-gray");
}

function createAllRows(document, game, categoryMap, tableId) {
    
    let categoryType = categoryMap.values().next().value.type;
    var templates;
    if (categoryType == "home") {
        templates = {
            headerRow: document.getElementsByClassName("headerRowItemTemplate")[0],
            row: document.getElementsByClassName("rowItemTemplate")[0],
        };
    } else if (categoryType == "mutation") {
        templates = {
            headerRow: document.getElementsByClassName("headerRowMutationTemplate")[0],
            row: document.getElementsByClassName("rowMutationTemplate")[0],
        };
    } else {
        templates = {
            headerRow: document.getElementsByClassName("headerRowTaskTemplate")[0],
            row: document.getElementsByClassName("rowTaskTemplate")[0],
        };
    }

    let table = document.getElementById(tableId);

    for (let category of categoryMap.values()) {
        let headerRow = createHeaderRow(templates.headerRow, category);
        table.appendChild(headerRow);
        
        category.list.forEach(function(entity) {
            let row = createRow(templates.row, game, category, entity);
            table.appendChild(row);
        });

        let requiredRow = createRequiredRow(category);
        table.append(requiredRow);
    }
}

function createHeaderRow(template, category) {
    var headerRow = template.content.firstElementChild.cloneNode(true)
    headerRow.getElementsByClassName("category")[0].textContent = category.name

    if (category.type == "job") {
        headerRow.getElementsByClassName("valueType")[0].textContent = "Income/day";
    } else if (category.type == "skill") {
        headerRow.getElementsByClassName("valueType")[0].textContent = "Effect";
    }

    headerRow.style.backgroundColor = category.color;
    headerRow.style.color = "#ffffff";
    headerRow.classList.add(removeSpaces(category.name));
    headerRow.classList.add("headerRow");
    
    return headerRow
}

function createRow(template, game, category, entity) {
    var row = template.content.firstElementChild.cloneNode(true);
    row.id = "row " + entity.name;

    row.classList.add(removeSpaces(category.name));


    row.getElementsByClassName("name")[0].textContent = entity.name;
    row.getElementsByClassName("tooltipText")[0].textContent = entity.tooltip;

    if (category.type == "job" || category.type == "skill") {
        row.getElementsByClassName("progressBar")[0].onclick = function() { setTask(game, entity); }
    } else if (category.type == "home") {
        row.getElementsByClassName("button")[0].onclick = function() { setItem(game, entity); }
    } else if (category.type == "mutation") {
        row.getElementsByClassName("button")[0].onclick = function() { buyMutation(game, entity); }
    }

    return row
}

function createRequiredRow(category) {
    let requiredRow = document.getElementsByClassName("requiredRowTemplate")[0].content.firstElementChild.cloneNode(true);
    requiredRow.classList.add("requiredRow");
    requiredRow.classList.add(removeSpaces(category.name));
    requiredRow.id = "required " + category.name;
    return requiredRow;
}

function updateHeaderRows(document, game, categoryMap) {
    for (let category of categoryMap.values()) {
        let className = removeSpaces(category.name);
        let headerRow = document.getElementsByClassName(className)[0];
        
        let maxLevelElement = headerRow.getElementsByClassName("maxLevel")[0];
        category.type != "home" && game.rebirthCount > 0 ? maxLevelElement.classList.remove("hidden") : maxLevelElement.classList.add("hidden")
        
        let skipSkillElement = headerRow.getElementsByClassName("skipSkill")[0]
        skipSkillElement.style.display = category.type == "skill" && game.automation.autoLearn ? "block" : "none"
    }
}

function updateTaskRows(document, game, taskMap) {
    for (let task of taskMap.values()) {
        var row = document.getElementById("row " + task.name);

        if (!task.requirement.checkCompleted(game)) {
            row.classList.add("hidden");
            continue;
        }
        row.classList.remove("hidden");

        row.getElementsByClassName("level")[0].textContent = task.level;

        formatLargeNumber(task.getXpGain(), row.getElementsByClassName("xpGain")[0]);
        formatLargeNumber(task.getXpLeft(), row.getElementsByClassName("xpLeft")[0]);

        var maxLevel = row.getElementsByClassName("maxLevel")[0];
        maxLevel.textContent = task.maxLevel;
        game.rebirthCount > 0 ? maxLevel.classList.remove("hidden") : maxLevel.classList.add("hidden");

        var progressFill = row.getElementsByClassName("progressFill")[0];
        progressFill.style.width = task.xp / task.getMaxXp() * 100 + "%";
        (task == game.currentJob || task == game.currentSkill) ? progressFill.classList.add("current") : progressFill.classList.remove("current");

        var valueElement = row.getElementsByClassName("value")[0];
        valueElement.getElementsByClassName("income")[0].style.display = task.type == "job";
        valueElement.getElementsByClassName("effect")[0].style.display = task.type == "skill";

        var skipSkillElement = row.getElementsByClassName("skipSkill")[0];

        if (task.type == "skill") {
            skipSkillElement.style.display = game.automation.autoLearn ? "block" : "none";

            let checkbox = row.getElementsByClassName("checkbox")[0];
            checkbox.addEventListener("change", function() { skipSkill(game, task, this.checked); });
        } else {
            skipSkillElement.style.display = "none";
        }

        if (task.type == "job") {
            formatCoins(task.income, valueElement.getElementsByClassName("income")[0]);
        } else {
            valueElement.getElementsByClassName("effect")[0].textContent = task.effect.description;
        }
    }
}

function updateItemRows(document, game, itemMap) {
    for (let item of itemMap.values()) {
        let row = document.getElementById("row " + item.name);

        if (!item.requirement.checkCompleted(game)) {
            row.classList.add("hidden");
            continue;
        }
        row.classList.remove("hidden");

        let button = row.getElementsByClassName("button")[0];
        button.disabled = game.coins < item.expense;

        let active = row.getElementsByClassName("active")[0];
        let color = item.category.color ? item.category.color : "white";
        active.style.backgroundColor = item.active ? color : "";

        row.getElementsByClassName("effect")[0].textContent = item.effect.description;
        formatCoins(item.expense, row.getElementsByClassName("expense")[0]);
        
    }
}


function updateMutationRows(document, game, mutationMap) {
    for (let mutation of mutationMap.values()) {
        let row = document.getElementById("row " + mutation.name);

        if (!mutation.requirement.checkCompleted(game)) {
            row.classList.add("hidden");
            continue;
        }
        row.classList.remove("hidden");

        let button = row.getElementsByClassName("button")[0];

        if (game.evil < mutation.cost) {
            button.disabled = true;
            button.style.backgroundColor = "red";
        } else {
            button.disabled = false;
            button.style.backgroundColor = "black";
        }
        
        row.getElementsByClassName("level")[0].textContent = mutation.level;
        row.getElementsByClassName("effect")[0].textContent = mutation.effect.description;

        formatNumber(mutation.cost, row.getElementsByClassName("cost")[0], "Evil");
    }
}

function updateRequiredRows(document, game, categoryMap) {
    for (let category of categoryMap.values()) {

        if (!category.requirement.checkCompleted(game)) {
            for (let elem of document.getElementsByClassName(removeSpaces(category.name))) {
                elem.classList.add("hiddenTask");  
            }
            continue;
        } else {
            for (let elem of document.getElementsByClassName(removeSpaces(category.name))) {
                elem.classList.remove("hiddenTask");  
            }
        }

        var requiredEntity = undefined;

        for (let entity of category.list) {
            let requirement = entity.requirement;

            if (!requirement.checkCompleted(game)) {
                requiredEntity = entity;
                break
            }
        }

        let requiredRow = document.getElementById("required " + category.name);

        if (requiredEntity === undefined) {
            requiredRow.classList.add("hiddenTask");          
        } else {
            requiredRow.classList.remove("hiddenTask");

            var parent = requiredRow.getElementsByClassName("value")[0];
            var coinElement = requiredRow.getElementsByClassName("coins")[0];
            var levelElement = requiredRow.getElementsByClassName("levels")[0];
            var evilElement = requiredRow.getElementsByClassName("evil")[0];
            var separatorElement = requiredRow.getElementsByClassName("separator")[0];

            for (let removed of Array.from(parent.getElementsByClassName("requirement"))) {
                removed.remove();
            }

            var first = true;

            for (let requirement of requiredEntity.requirement.base) {
                var element = undefined;

                if (requirement.job !== undefined) {
                    element = levelElement.content.firstElementChild.cloneNode(true);
                    element.textContent = requirement.job + " level " + requirement.level;
                }
                if (requirement.skill !== undefined) {
                    element = levelElement.content.firstElementChild.cloneNode(true);
                    element.textContent = requirement.skill + " level " + requirement.level;
                }
                if (requirement.mutation !== undefined) {
                    element = levelElement.content.firstElementChild.cloneNode(true);
                    element.textContent = requirement.mutation + " level " + requirement.level;
                }
                if (requirement.coins !== undefined) {
                    element = coinElement.content.firstElementChild.cloneNode(true);
                    formatCoins(requirement.coins, element);
                }
                if (requirement.evil !== undefined) {
                    element = evilElement.content.firstElementChild.cloneNode(true);
                    element.textContent = requirement.evil + " evil";
                }

                if (element !== undefined) {
                    if (first) {
                        first = false;
                    } else {
                        let separator = separatorElement.content.firstElementChild.cloneNode(true);
                        separator.classList.add("requirement");
                        parent.append(separator);
                    }

                    element.classList.add("requirement");
                    parent.append(element);
                }                
            }
        }
    }
}

function setTask(game, task) {
    task.type == "job" ? game.currentJob = task : game.currentSkill = task
}

function setItem(game, item) {
    if (item.active) {
        game.removeItem(item);
    } else {
        game.putItem(item);
    }
}

function skipSkill(game, skill, value) {
    game.automation.skipSkill(skill, value);
}

function buyMutation(game, mutation) {
    game.buyMutation(mutation);
}

function removeSpaces(string) {
    var string = string.replace(/[ ']/g, "");
    return string;
}