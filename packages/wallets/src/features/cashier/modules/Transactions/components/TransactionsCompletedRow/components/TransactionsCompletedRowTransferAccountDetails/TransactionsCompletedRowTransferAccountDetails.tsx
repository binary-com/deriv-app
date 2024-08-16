import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { THooks, TWalletLandingCompanyName } from '../../../../../../../../types';
import { getAccountName } from '../../../../../../helpers';
import { TransactionsCompletedRowAccountDetails } from '../TransactionsCompletedRowAccountDetails';

type TProps = {
    accounts: THooks.AllAccountsList;
    displayActionType: string;
    loginid: string;
};

const TransactionsCompletedRowTransferAccountDetails: React.FC<TProps> = ({ accounts, displayActionType, loginid }) => {
    const { data: activeWallet } = useActiveWalletAccount();

    const wallet = accounts.wallets?.find(account => account.loginid === loginid);
    const dtradeAccount = accounts.dtrade?.find(account => account.loginid === loginid);
    const dxtradeAccount = accounts.dxtrade?.find(account => account.account_id === loginid);
    const mt5Account = accounts.mt5?.find(account => account.login === loginid);
    const ctraderAccount = accounts.ctrader?.find(account => account.account_id === loginid);

    const transferAccount = [wallet, dtradeAccount, dxtradeAccount, mt5Account, ctraderAccount].find(Boolean);

    if (transferAccount) {
        const derivAccountType = transferAccount === wallet ? 'wallet' : 'standard';
        const accountType = transferAccount?.platform !== 'deriv' ? transferAccount.platform : derivAccountType;
        const displayAccountName = getAccountName({
            accountCategory: transferAccount === wallet ? 'wallet' : 'trading',
            //@ts-expect-error this needs backend typing
            accountType,
            displayCurrencyCode: transferAccount.currency_config?.display_code ?? 'USD',
            landingCompanyName: activeWallet?.landing_company_name as TWalletLandingCompanyName,
            mt5MarketType: transferAccount === mt5Account ? mt5Account.market_type : undefined,
        });

        return (
            <TransactionsCompletedRowAccountDetails
                accountType={accountType}
                actionType='transfer'
                currency={transferAccount.currency ?? 'USD'}
                displayAccountName={displayAccountName ?? ''}
                displayActionType={displayActionType}
                isDemo={Boolean(transferAccount.is_virtual)}
                isInterWallet={transferAccount === wallet}
                mt5Group={transferAccount === mt5Account ? mt5Account.group : undefined}
            />
        );
    }

    return null;
};

export default TransactionsCompletedRowTransferAccountDetails;
