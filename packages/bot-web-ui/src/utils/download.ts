import { LogTypes } from '@deriv/bot-skeleton';
import { localize } from '@deriv/translations';

export type TTransaction = {
    display_name: string;
    transaction_ids: { buy: string; sell: string };
    barrier: string;
    date_start: string;
    entry_tick: string;
    entry_tick_time: string;
    exit_tick: string;
    exit_tick_time: string;
    buy_price: string;
    profit: string;
};

export type TLogTypes = Readonly<{
    LOAD_BLOCK: 'load_block';
    PURCHASE: 'purchase';
    SELL: 'sell';
    NOT_OFFERED: 'not_offered';
    PROFIT: 'profit';
    LOST: 'lost';
    WELCOME_BACK: 'welcome_back';
    WELCOME: 'welcome';
}>;

export type TExtra = {
    profit?: string;
    sold_for?: string;
    longcode?: string;
    transaction_id?: string;
    current_currency?: string;
};

export const getCurrentDateTimeLocale = () => {
    const date = new Date(); // This will be the current date and time

    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}${minutes}${seconds}`;
};

export const getSuccessJournalMessage = (message: string, extra: TExtra) => {
    const { profit, sold_for, longcode, transaction_id, current_currency } = extra;
    switch (message) {
        case LogTypes.LOAD_BLOCK: {
            return localize('Blocks are loaded successfully');
        }
        case LogTypes.NOT_OFFERED: {
            return localize('Resale of this contract is not offered.');
        }
        case LogTypes.PURCHASE: {
            return localize('Bought: {{longcode}} (ID: {{transaction_id}})', { longcode, transaction_id });
        }
        case LogTypes.SELL: {
            return localize('Sold for: {{sold_for}}', { sold_for });
        }
        case LogTypes.PROFIT: {
            return localize('Profit amount: {{profit}}', { profit });
        }
        case LogTypes.LOST: {
            return localize('Loss amount: {{profit}}', { profit });
        }
        case LogTypes.WELCOME_BACK: {
            if (current_currency)
                return localize(
                    'Welcome back! Your messages have been restored. You are using your {{current_currency}} account.',
                    { current_currency }
                );
            return localize('Welcome back! Your messages have been restored.');
        }
        case LogTypes.WELCOME: {
            if (current_currency)
                return localize('You are using your {{current_currency}} account.', { current_currency });
            break;
        }
        default:
            return '';
    }
};

export const downloadFile = (file_name: string, content: string) => {
    const uri = encodeURI(`data:text/csv;charset=utf-8, ${content}`);
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', `${file_name} ${getCurrentDateTimeLocale()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
};
