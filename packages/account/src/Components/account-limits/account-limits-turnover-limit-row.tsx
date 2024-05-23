import React from 'react';
import { formatMoney } from '@deriv/shared';
import AccountLimitsTableCell from './account-limits-table-cell';
import AccountLimitsContext, { TAccountLimitsContext } from './account-limits-context';

export type TAccountLimitsCollection = {
    level?: string;
    name: string;
    payout_limit: number;
    profile_name: string;
    turnover_limit: number;
};

type TAccountLimitsTurnoverLimitRow = {
    collection: TAccountLimitsCollection[];
    title?: string;
};

const AccountLimitsTurnoverLimitRow = ({ collection, title }: TAccountLimitsTurnoverLimitRow) => {
    const { currency } = React.useContext<TAccountLimitsContext>(AccountLimitsContext);

    return (
        <React.Fragment>
            {collection?.map(({ name, turnover_limit, level }) => (
                <tr key={name} data-testid='account-limits-turnover-limit-row'>
                    <AccountLimitsTableCell level={level}>
                        {title && `${title} - `}
                        {name}
                    </AccountLimitsTableCell>
                    <AccountLimitsTableCell align='right'>
                        {formatMoney(currency, turnover_limit, true)}
                    </AccountLimitsTableCell>
                </tr>
            ))}
        </React.Fragment>
    );
};

export default AccountLimitsTurnoverLimitRow;
