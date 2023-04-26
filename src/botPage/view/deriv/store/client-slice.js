import { createSlice, current } from '@reduxjs/toolkit';

const initial_state = {
    active_token: '',
    account_list: [],
    active_account_name: '',
    account_balance: {},
    token_list: [],
    balance: 0,
    currency: 'USD',
    is_virtual: false,
    login_id: '',
    total_deriv: {},
    total_demo: {},
    is_eu: false,
    is_logged: false,
    is_gd_logged_in: !!localStorage.getItem('access_token'),
    accounts: {},
    account_type: {},
};

export const clientSlice = createSlice({
    name: 'client',
    initialState: initial_state,
    reducers: {
        updateAccountType: (state, action) => {
            console.log(action)
            state.account_type = {
                ...state.account_type,
                high_risk: action.payload.high_risk,
                high_risk_or_eu: action.payload.high_risk_or_eu,
                low_risk: action.payload.low_risk,
                low_risk_without_account: action.payload.low_risk_without_account,
                high_risk_without_account: action.payload.high_risk_without_account,
                is_multiplier: action.payload.is_multiplier,
                country_code: action.payload.country_code,
            };
        },
        updateIsLogged: (state, action) => {
            state.is_logged = action.payload;
        },
        resetClient: () => initial_state,
        updateActiveAccount: (state, action) => {
            state.active_account_name = action.payload.loginid;
            state.account_list = [...action.payload.account_list];
            state.is_virtual = !!action.payload.is_virtual;
            state.currency = action.payload.currency;
            state.balance = action.payload.balance;
        },
        updateActiveToken: (state, action) => {
            state.active_token = action.payload;
        },
        setGdLoggedIn: (state, action) => {
            state.is_gd_logged_in = action.payload;
        },
        updateBalance: (state, action) => {
            if (action.payload.loginid === state.active_account_name) {
                state.balance = action.payload.balance;
                state.currency = action.payload.currency;
            }
            if (action.payload.total?.deriv) {
                state.total_deriv = action.payload.total.deriv;
            }
            if (action.payload.accounts) {
                state.accounts = { ...action.payload.accounts };
                return;
            }
            if (action.payload.loginid in current(state.accounts)) {
                const account = state.accounts[action.payload.loginid];
                account.balance = action.payload.balance;
                state.account_balance = {
                    ...state.account_balance,
                    [action.payload.loginid]: account,
                };
            }
        },
    },
});

export const {
    updateIsLogged,
    resetClient,
    updateActiveToken,
    updateActiveAccount,
    updateBalance,
    updateAccountType,
    setGdLoggedIn,
} = clientSlice.actions;

export default clientSlice.reducer;
