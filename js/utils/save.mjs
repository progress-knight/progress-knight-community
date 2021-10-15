import settings from "../settings.mjs";

export function writeSave(game) {
    let json = JSON.stringify(game.save());
    localStorage.setItem(settings.saveKey, json);
}

export function readSave(game) {
    let json = localStorage.getItem(settings.saveKey);
    let save = JSON.parse(json);

    if (save != null) {
        game.load(save);
    }
}

export function importSave() {
    var data = JSON.parse(window.atob(save));
    writeSave(data);
    location.reload();
}

export function exportSave() {
    return window.btoa(JSON.stringify(gameData))
}

export function resetSave() {
    localStorage.clear();
    location.reload();
}