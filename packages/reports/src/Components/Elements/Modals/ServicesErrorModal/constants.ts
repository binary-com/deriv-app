import { localize } from '@deriv/translations';

export const getTitle = (type?: string) => {
    switch (type) {
        case 'buy':
            return localize('Purchase Error');
        case 'cancel':
            return localize('Deal Cancellation Error');
        case 'contract_update':
            return localize('Contract Update Error');
        case 'sell':
            return localize('Sell Error');
        default:
            return 'Error';
    }
};
