import settings from 'electron-settings';

export const set = async (key, value) =>{
    await settings.set(key, value);
}

export const get = async (key) =>{
    var value = await settings.get(key);
    return value;
}

export const setSync = (key, value) =>{
    settings.setSync(key, value);
}

export const getSync = (key) =>{
    return settings.getSync(key)
}