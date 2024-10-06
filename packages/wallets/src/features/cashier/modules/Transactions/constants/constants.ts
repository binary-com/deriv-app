import { useTranslations } from '@deriv-com/translations';

export const getTransactionLabels = (localize: ReturnType<typeof useTranslations>['localize']) => ({
    all: localize('All'),
    deposit: localize('Deposit'),
    reset_balance: localize('Reset balance'),
    transfer: localize('Transfer'),
    withdrawal: localize('Withdrawal'),
});
