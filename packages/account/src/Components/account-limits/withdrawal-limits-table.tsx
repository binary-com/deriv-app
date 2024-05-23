import React from 'react';
import { Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import AccountLimitsTableCell from './account-limits-table-cell';
import AccountLimitsTableHeader from './account-limits-table-header';

type TWithdrawalLimitsTable = {
    num_of_days_limit?: string | number;
    withdrawal_since_inception_monetary?: string | number;
    remainder?: string | number;
};

const WithdrawalLimitsTable = observer(
    ({ num_of_days_limit, withdrawal_since_inception_monetary, remainder }: TWithdrawalLimitsTable) => {
        const { client } = useStore();
        const { currency, is_fully_authenticated } = client;
        return (
            <React.Fragment>
                <table className='da-account-limits__table' data-testid='withdrawal_limits_table'>
                    <thead>
                        <tr>
                            <AccountLimitsTableHeader>
                                <Localize i18n_default_text='Withdrawal limits' />
                            </AccountLimitsTableHeader>
                            {is_fully_authenticated && (
                                <AccountLimitsTableHeader align='right'>
                                    <Localize i18n_default_text='Limit' />
                                </AccountLimitsTableHeader>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {!is_fully_authenticated && (
                            <React.Fragment>
                                <tr>
                                    <AccountLimitsTableCell>
                                        <Localize i18n_default_text='Total withdrawal allowed' />
                                    </AccountLimitsTableCell>
                                    <AccountLimitsTableCell align='right'>
                                        {formatMoney(currency, num_of_days_limit ?? 0, true)}
                                    </AccountLimitsTableCell>
                                </tr>
                                <tr>
                                    <AccountLimitsTableCell>
                                        <Localize i18n_default_text='Total withdrawn' />
                                    </AccountLimitsTableCell>
                                    <AccountLimitsTableCell align='right'>
                                        {formatMoney(currency, withdrawal_since_inception_monetary ?? 0, true)}
                                    </AccountLimitsTableCell>
                                </tr>
                                <tr>
                                    <AccountLimitsTableCell>
                                        <Localize i18n_default_text='Maximum withdrawal remaining' />
                                    </AccountLimitsTableCell>
                                    <AccountLimitsTableCell align='right'>
                                        {formatMoney(currency, remainder ?? '', true)}
                                    </AccountLimitsTableCell>
                                </tr>
                            </React.Fragment>
                        )}
                    </tbody>
                </table>
                <div className='da-account-limits__text-container'>
                    <Text as='p' size='xxs' color='less-prominent' line_height='xs'>
                        {is_fully_authenticated ? (
                            <Localize i18n_default_text='Your account is fully authenticated and your withdrawal limits have been lifted.' />
                        ) : (
                            <Localize i18n_default_text='Stated limits are subject to change without prior notice.' />
                        )}
                    </Text>
                </div>
            </React.Fragment>
        );
    }
);

export default WithdrawalLimitsTable;
