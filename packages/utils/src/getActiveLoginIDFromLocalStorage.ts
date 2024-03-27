/**
 * Gets the active `loginid` for the current user from the `localStorage`.
 */
/**
 * @deprecated Please use 'WebSocketUtils.getActiveLoginid' from '@deriv-com/utils' instead of this.
 */
const getActiveLoginIDFromLocalStorage = (loginIDKey?: string) => {
    const active_loginid = localStorage.getItem('active_loginid');
    const active_custom_loginid = loginIDKey ? localStorage.getItem(loginIDKey) : undefined;

    return active_custom_loginid ?? active_loginid ?? undefined;
};

export default getActiveLoginIDFromLocalStorage;
