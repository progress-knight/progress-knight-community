import settings from "./settings.mjs";
import initGame from "./data.mjs";
import {writeSave, readSave, } from "./utils/save.mjs";
import UI from "./ui/ui.mjs";

globalThis.main = function() {
    mainInit();
    mainUpdate();
    setInterval(mainUpdate, getGameTimeDelta());
    setInterval(mainAutoSave, 3000);
}

function mainInit() {
    globalThis.game = initGame();
    readSave(game);
}

function mainUpdate() {
    game.update(getGameTimeDelta() / 1000);
    UI(globalThis.document, game);
}

function mainAutoSave() {
    writeSave(game);
}

function getGameTimeDelta() {
    return 1000 / settings.updateSpeed;
}