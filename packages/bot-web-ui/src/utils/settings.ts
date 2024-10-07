const getSettingsFromLocal = () => {
    return JSON.parse(localStorage.getItem('dbot_settings'));
};

export const getSetting = (key: string) => {
    const settings = getSettingsFromLocal();
    if (!settings) return null;
    return settings[key];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const storeSetting = (key: string, value: any) => {
    const settings = getSettingsFromLocal() || {};
    settings[key] = value;
    localStorage.setItem('dbot_settings', JSON.stringify(settings));
};

export const removeKeyValue = (key: string) => {
    const settings = getSettingsFromLocal() || {};
    delete settings[key];

    localStorage.setItem('dbot_settings', JSON.stringify(settings));
};
