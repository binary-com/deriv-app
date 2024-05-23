import { Context } from '@deriv/integration/src/utils/mocks/mocks';

const TEMP_DATA = {
    accounts: {
        CR90000243: {
            balance: 11.11,
            converted_amount: 11.11,
            currency: 'USD',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        CR90000256: {
            balance: 10,
            converted_amount: 0,
            currency: 'BTC',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        CRW1003: {
            balance: 9988000.89,
            converted_amount: 9988000.89,
            currency: 'USD',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        CRW1017: {
            balance: 10,
            converted_amount: 0,
            currency: 'BTC',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        CRW1036: {
            balance: 0,
            converted_amount: 0,
            currency: 'ETH',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        VRTC90000115: {
            balance: 0,
            converted_amount: 0,
            currency: 'USD',
            demo_account: 1,
            status: 1,
            type: 'deriv',
        },
        VRW1004: {
            balance: 10000,
            converted_amount: 10000,
            currency: 'USD',
            demo_account: 1,
            status: 1,
            type: 'deriv',
        },
    },
    balance: 11.11,
    currency: 'USD',
    id: '88790cc1-7281-6a55-936e-c3de3d67c022',
    loginid: 'CR90000243',
    total: {
        deriv: {
            amount: 10000,
            currency: 'USD',
        },
        deriv_demo: {
            amount: 10000,
            currency: 'USD',
        },
        mt5: {
            amount: 0,
            currency: 'USD',
        },
        mt5_demo: {
            amount: 0,
            currency: 'USD',
        },
    },
};

export function mockBalance(context: Context) {
    if (!('balance' in context.request)) {
        return;
    }

    if (!context.request.account && !context.request.loginid) {
        return;
    }

    if (context.request.account === 'all') {
        context.response = {
            balance: TEMP_DATA,
            echo_req: context.request,
            msg_type: 'balance',
            req_id: context.req_id,
        };
        return;
    }

    if (context.request.subscribe === 1) {
        context.response = {
            balance: TEMP_DATA.accounts[context.request.loginid],
            echo_req: context.request,
            msg_type: 'balance',
            req_id: context.req_id,
            subscription: { id: '88790cc1-7281-6a55-936e-c3de3d67c022' },
        };

        return;
    }

    context.response = {
        balance: TEMP_DATA.accounts[context.request.account],
        echo_req: context.request,
        msg_type: 'balance',
        req_id: context.req_id,
    };
}
