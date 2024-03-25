import useRealTotalAssetCurrency from './useTotalAssetCurrency';
import { useExchangeRate } from './useExchangeRate';
/**
 * we can use this hook to get the total balance of the given accounts list.
 * it loops through the accounts list and adds the balance of each account
 * to the total balance, it also converts the balance to the currency of the
 * first account in the list
 */
type TUseTotalAccountBalance = {
    balance?: number;
    currency?: string;
    account_type?: string;
};

const useTotalAccountBalance = (accounts: TUseTotalAccountBalance[]) => {
    const total_assets_real_currency = useRealTotalAssetCurrency();
    const { handleSubscription, getExchangeRate } = useExchangeRate();

    if (!accounts.length) return { balance: 0, currency: total_assets_real_currency };

    const balance = accounts.reduce((total, account) => {
        const new_base = account?.account_type === 'demo' ? 'USD' : total_assets_real_currency || '';
        const new_target = account.currency || total_assets_real_currency || '';

        if (new_base !== new_target) handleSubscription(new_base, new_target);

        const new_rate = getExchangeRate(new_base, new_target);

        return total + (account.balance || 0) / new_rate;
    }, 0);

    return {
        balance,
        currency: total_assets_real_currency,
    };
};

export default useTotalAccountBalance;
