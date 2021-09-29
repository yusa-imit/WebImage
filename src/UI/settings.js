import settings from 'electron-settings';

class SettingObject {
    constructor(value, format) {
        this.value = value;
        this.format = format;
    }
}

export const set = async (key, value) => {
    await settings.set(key, value);
}

export const get = async (key) => {
    var value = await settings.get(key);
    return value;
}

export const setSync = (key, value) => {
    settings.setSync(key, value);
}

export const getSync = (key) => {
    return settings.getSync(key)
}

const INITIAL_STATE = {
    postFix: new SettingObject('__Converted_by_WebImage', [String]),
    backgroundAnimation: new SettingObject(true, [Boolean]),
    defaultStorage: new SettingObject("Default", [String]),
}

export const initialize = () => {
    checkFileExists();
    checkInitProperties();
    checkInitTypes();
    removeUnappropriateProperties();
}

const checkFileExists = () => {
    const fs = require('fs');
    const path = settings.file();
    if (fs.existsSync(path)) {
        return;
    }
    else {
        settings.setSync("init", "init");
        settings.unsetSync("init");
    }

}

const checkInitProperties = () => {
    for (var key in INITIAL_STATE) {
        if (!settings.hasSync(key)) {
            settings.setSync(key, INITIAL_STATE[key].value);
        }
    }
}

const checkInitTypes = () => {
    for (var key in INITIAL_STATE) {
        if (!INITIAL_STATE[key].format.includes(typeof (settings.getSync(key)))) {
            settings.setSync(key, INITIAL_STATE[key].value)
        }
    }
}

const removeUnappropriateProperties = () =>{
    for (var key of Object.keys(settings.getSync())){
        if(!Object.keys(INITIAL_STATE).includes(key)){
            settings.unsetSync(key);
        }
    }
}