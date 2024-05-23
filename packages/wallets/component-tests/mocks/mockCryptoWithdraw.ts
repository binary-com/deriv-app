/* eslint-disable sort-keys */

import { Context } from '@deriv/integration/src/utils/mocks/mocks';

export function mockCryptoWithdraw(context: Context) {
    const isCryptoWithdraw =
        'cashier' in context.request && context.request.cashier === 'withdraw' && context.request.provider === 'crypto';

    if (isCryptoWithdraw) {
        if (!('address' in context.request))
            context.response = {
                echo_req: context.request,
                error: {
                    code: 'CryptoMissingRequiredParameter',
                    details: {
                        field: 'address',
                    },
                    message: 'Missing required parameter.',
                },
                msg_type: 'cashier',
                req_id: context.req_id,
            };
    }
}
