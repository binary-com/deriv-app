/**
 * Gets the active `loginid` for the current user from the `localStorage`.
 */
const getActiveLoginIDFromLocalStorage = (customLoginIDKey?: string) => {
    const active_loginid = localStorage.getItem(customLoginIDKey ?? 'active_loginid');

    // If there is no active loginid, return undefined.
    if (!active_loginid) return;

    return active_loginid;
};

export default getActiveLoginIDFromLocalStorage;
