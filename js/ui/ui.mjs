import HUD from "./hud.mjs";
import Tab from "./tab.mjs";

export default function UI(document, game) {
    let hudUpdate = HUD(document, game);
    let tabUpdate = Tab(document, game);

    return function() {
        hudUpdate();
        tabUpdate();
        updateAdvancement(document, game);
    }
}

function updateAdvancement(document, game) {
    const elements = {
        "Home": document.getElementById("homeTabButton"),
        "Automation": document.getElementById("automation"),
        "Rebirth tab": document.getElementById("rebirthTabButton"),
        "Rebirth note 1": document.getElementById("rebirthNote1"),
        "Rebirth note 2": document.getElementById("rebirthNote2"),
        "Rebirth note 3": document.getElementById("rebirthNote3"),
        "Time warping info": document.getElementById("timeWarping"),
        "Evil info": document.getElementById("evilInfo"),
        "Evil tab": document.getElementById("evilTabButton"),
    }

    for (let [name, requirement] of game.advancementMap) {
        let element = elements[name];

        if (requirement.checkCompleted(game)) {
            element.classList.remove("hidden");
        } else {
            element.classList.add("hidden");
        }
    }
}