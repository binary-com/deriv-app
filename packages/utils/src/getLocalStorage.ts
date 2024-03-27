/** check is stringified object or not */
const checkIsStringifiedObject = (s: string) => {
    try {
        return JSON.parse(s);
    } catch (error) {
        return s;
    }
};

/**
 * Retrieves the value stored in localStorage for the given key.
 * @param {string} key - The localStorage key.
 * @returns {any} - The value stored in localStorage for the given key, or null if the key does not exist or has no value.
 */
/**
 * @deprecated Please use 'LocalStorageUtils.getValue' from '@deriv-com/utils' instead of this.
 */
export const getLocalStorage = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? checkIsStringifiedObject(data) : null;
};
