import { LogTypes } from '@deriv/bot-skeleton';
import { localize } from '@deriv/translations';
import { getCurrentDateTimeLocale, getSuccessJournalMessage } from 'Utils/download';

jest.mock('@deriv/bot-skeleton', () => ({
    LogTypes: {
        LOAD_BLOCK: 'load_block',
        PURCHASE: 'purchase',
        SELL: 'sell',
        NOT_OFFERED: 'not_offered',
        PROFIT: 'profit',
        LOST: 'lost',
        WELCOME_BACK: 'welcome_back',
        WELCOME: 'welcome',
    },
}));
describe('getCurrentDateTimeLocale', () => {
    it('should return the current date and time in UTC with the format YYYY-MM-DD HHMMSS', () => {
        const result = getCurrentDateTimeLocale();
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = now.getUTCDate().toString().padStart(2, '0');
        const hours = now.getUTCHours().toString().padStart(2, '0');
        const minutes = now.getUTCMinutes().toString().padStart(2, '0');
        const seconds = now.getUTCSeconds().toString().padStart(2, '0');
        const expected = `${year}-${month}-${day} ${hours}${minutes}${seconds}`;
        expect(result).toBe(expected);
    });
});
describe('getSuccessJournalMessage', () => {
    it('should return localized message for LOAD_BLOCK', () => {
        const result = getSuccessJournalMessage(LogTypes.LOAD_BLOCK, {});
        expect(result).toBe('Blocks are loaded successfully');
    });
    it('should return localized message for PURCHASE with longcode and transaction_id', () => {
        const extra = { longcode: 'Sample Longcode', transaction_id: '1234' };
        const result = getSuccessJournalMessage(LogTypes.PURCHASE, extra);
        expect(result).toBe('Bought: Sample Longcode (ID: 1234)');
    });
    it('should return localized message for SELL with sold_for', () => {
        const extra = { sold_for: '100 USD' };
        const result = getSuccessJournalMessage(LogTypes.SELL, extra);
        expect(result).toBe('Sold for: 100 USD');
    });
    it('should return localized message for PROFIT with profit', () => {
        const extra = { profit: '50 USD' };
        const result = getSuccessJournalMessage(LogTypes.PROFIT, extra);
        expect(result).toBe('Profit amount: 50 USD');
    });
    it('should return localized message for LOST with profit', () => {
        const extra = { profit: '20 USD' };
        const result = getSuccessJournalMessage(LogTypes.LOST, extra);
        expect(result).toBe('Loss amount: 20 USD');
    });
    it('should return localized message for WELCOME_BACK with current_currency', () => {
        const extra = { current_currency: 'USD' };
        const result = getSuccessJournalMessage(LogTypes.WELCOME_BACK, extra);
        expect(result).toBe('Welcome back! Your messages have been restored. You are using your USD account.');
    });
    it('should return localized message for WELCOME_BACK without current_currency', () => {
        const extra = {}; // No current_currency provided
        const result = getSuccessJournalMessage(LogTypes.WELCOME_BACK, extra);
        expect(result).toBe('Welcome back! Your messages have been restored.');
    });
    it('should return localized message for WELCOME with current_currency', () => {
        const extra = { current_currency: 'EUR' };
        const result = getSuccessJournalMessage(LogTypes.WELCOME, extra);
        expect(result).toBe('You are using your EUR account.');
    });
    it('should return localized message for NOT_OFFERED with empty extra', () => {
        const result = getSuccessJournalMessage(LogTypes.NOT_OFFERED, {});
        expect(result).toBe('Resale of this contract is not offered.');
    });
    it('should return empty string for unknown log type', () => {
        const result = getSuccessJournalMessage('unknown_log_type' as LogTypes[keyof LogTypes], {});
        expect(result).toBe('');
    });
});
