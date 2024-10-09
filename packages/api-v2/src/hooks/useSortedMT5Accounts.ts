import { useMemo } from 'react';
import useMT5AccountsList from './useMT5AccountsList';
import useAvailableMT5Accounts from './useAvailableMT5Accounts';
import useIsEuRegion from './useIsEuRegion';
import useActiveAccount from './useActiveAccount';

/** A custom hook to get the sorted added and non-added MT5 accounts. */
const useSortedMT5Accounts = (regulation?: string) => {
    const { data: all_available_mt5_accounts } = useAvailableMT5Accounts();
    const { isEUCountry } = useIsEuRegion();
    const { data: mt5_accounts, ...rest } = useMT5AccountsList();
    const { data: activeAccount } = useActiveAccount();

    const isEU = regulation === 'EU' || isEUCountry;

    const modified_data = useMemo(() => {
        if (!all_available_mt5_accounts || !mt5_accounts) return;

        const filtered_available_accounts = isEU
            ? all_available_mt5_accounts.filter(account => account.shortcode === 'maltainvest')
            : all_available_mt5_accounts;

        const filtered_mt5_accounts = mt5_accounts.filter(
            account =>
                account.is_virtual === activeAccount?.is_virtual &&
                (isEU
                    ? account.landing_company_short === 'maltainvest'
                    : account.landing_company_short !== 'maltainvest')
        );

        const combined_accounts = filtered_available_accounts?.map(available_account => {
            const created_account = filtered_mt5_accounts?.find(account => {
                return (
                    available_account.product === account.product &&
                    available_account.shortcode === account.landing_company_short
                );
            });

            return {
                ...available_account,
                ...created_account,
                /** Determine if the account is added or not */
                is_added: Boolean(created_account),
            };
        });

        return Array.from(
            // filter out only one account per product type
            combined_accounts
                .reduce(
                    (
                        acc: Map<typeof combined_accounts[number]['product'], typeof combined_accounts[number]>,
                        cur: typeof combined_accounts[number]
                    ) => {
                        const existingItem = acc.get(cur.product);

                        // Note: 'stp' product type account is not available for creation but we still support existing 'stp' accounts
                        // @ts-expect-error type for is_default_jurisdiction is unavailable in mt5_login_list and trading_platform_available_accounts
                        if (!existingItem && cur.is_default_jurisdiction === 'true' && cur.product !== 'stp') {
                            // No existing item for this product, add it directly
                            acc.set(cur.product, cur);
                        } else if (cur.is_added) {
                            // If `is_added` is true, replace the older entry (prioritization)
                            acc.set(cur.product, cur);
                        }

                        return acc;
                    },
                    new Map<typeof combined_accounts[number]['product'], typeof combined_accounts[number]>()
                )
                .values()
        );
    }, [activeAccount?.is_virtual, all_available_mt5_accounts, isEU, mt5_accounts]);

    const sorted_data = useMemo(() => {
        const sorting_order = ['standard', 'financial', 'swap_free', 'zero_spread'];

        if (!modified_data) return;

        const sorted_data = sorting_order.reduce((acc, sort_order) => {
            const accounts = modified_data.filter(account => account.product === sort_order);
            if (!accounts.length) return acc;
            return [...acc, ...accounts];
        }, [] as typeof modified_data);

        return sorted_data;
    }, [modified_data]);

    const areAllAccountsCreated = modified_data?.length === all_available_mt5_accounts?.length;

    return {
        data: sorted_data,
        /** Determine if all the accounts are created */
        areAllAccountsCreated,
        ...rest,
    };
};

export default useSortedMT5Accounts;
