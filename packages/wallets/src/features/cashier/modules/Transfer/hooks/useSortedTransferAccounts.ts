import { useMemo } from 'react';
import { MT5MarketTypeDetails, PlatformDetails } from '../../../constants';
import { getMarketType } from '../../../helpers';
import { TAccount, TAccountsList } from '../types';

const useSortedTransferAccounts = (accounts: TAccountsList) => {
    return useMemo(
        () => ({
            tradingAccounts: accounts.tradingAccounts.sort(sortTradingAccounts),
            walletAccounts: accounts.walletAccounts.sort(sortWalletsAccounts),
        }),
        [accounts]
    );
};

export default useSortedTransferAccounts;

/** A custom hook that sort trading and wallet accounts to display on the screen. */
const sortWalletsAccounts = (a: TAccount, b: TAccount) => {
    if (!a?.accountName || !b?.accountName) return 0;
    if (a.account_type === 'doughflow' && b.account_type === 'doughflow') {
        return a.accountName.localeCompare(b.accountName);
    } else if (a.account_type === 'crypto' && b.account_type === 'crypto') {
        return a.accountName.localeCompare(b.accountName);
    } else if (a.account_type === 'doughflow') {
        // 'doughflow' comes first
        return -1;
    }
    // 'crypto' comes next
    return 1;
};

type TMt5LandingCompanyName = 'bvi' | 'labuan' | 'svg' | 'vanuatu';

const sortTradingAccounts = (a: TAccount, b: TAccount) => {
    if (!a?.account_type || !b?.account_type) return 0;

    const accountTypeOrder = {
        binary: 6,
        ctrader: 2,
        derivez: 4,
        dxtrade: 3,
        mt5: 1,
        standard: 5,
    };

    const marketTypeOrder = {
        all: 3,
        financial: 2,
        synthetic: 1,
    } as const;

    const landingCompanyNameOrderOfMt5Account = {
        bvi: 2,
        labuan: 4,
        svg: 1,
        vanuatu: 3,
    } as const;

    // Remove type casting when all account types will be added to accountTypeOrder object
    const typeA = a.account_type as Extract<NonNullable<TAccount>['account_type'], keyof typeof accountTypeOrder>;
    const typeB = b.account_type as Extract<NonNullable<TAccount>['account_type'], keyof typeof accountTypeOrder>;

    // Compare account types
    if (accountTypeOrder[typeA] !== accountTypeOrder[typeB]) {
        return accountTypeOrder[typeA] - accountTypeOrder[typeB];
    }

    // For mt5 accounts, compare market types
    if (typeA === PlatformDetails.mt5.name) {
        const marketTypeA = getMarketType(a.mt5_group);
        const marketTypeB = getMarketType(b.mt5_group);

        if (
            marketTypeOrder[marketTypeA ?? MT5MarketTypeDetails.all.name] !==
            marketTypeOrder[marketTypeB ?? MT5MarketTypeDetails.all.name]
        ) {
            return (
                marketTypeOrder[marketTypeA ?? MT5MarketTypeDetails.all.name] -
                marketTypeOrder[(marketTypeB ?? MT5MarketTypeDetails.all.name) as keyof typeof marketTypeOrder]
            );
        }

        // For 'synthetic' and 'financial' market types, compare landing company name
        if (
            marketTypeA === MT5MarketTypeDetails.synthetic.name ||
            marketTypeA === MT5MarketTypeDetails.financial.name
        ) {
            const landingCompanyTypeA = a.landingCompanyName as TMt5LandingCompanyName;
            const landingCompanyTypeB = b.landingCompanyName as TMt5LandingCompanyName;

            return (
                landingCompanyNameOrderOfMt5Account[landingCompanyTypeA] -
                landingCompanyNameOrderOfMt5Account[landingCompanyTypeB]
            );
        }
    }

    // No need to change the order for other account types
    return 0;
};
