import { displayMoney } from '../display-money';

describe('displayMoney', () => {
    it('should work for en-US, USD', async () => {
        const preferred_language = 'en-US';
        const display_money = displayMoney(1234.56, 'USD', { preferred_language });

        expect(display_money).toBe('1,234.56 USD');
    });

    it('should work for en-US, USD; add up zero decimals', async () => {
        const preferred_language = 'en-US';
        const display_money = displayMoney(1234.5, 'USD', { preferred_language });

        expect(display_money).toBe('1,234.50 USD');
    });

    it('should work for de-GE, USD', async () => {
        const preferred_language = 'de-GE';
        const display_money = displayMoney(1234.56, 'USD', { preferred_language });

        expect(display_money).toBe('1.234,56 USD');
    });

    it('should work for en-IN, USD', async () => {
        const preferred_language = 'en-IN';
        const display_money = displayMoney(123456.78, 'USD', { preferred_language });

        expect(display_money).toBe('1,23,456.78 USD');
    });

    it('should work for en-US, BTC', async () => {
        const preferred_language = 'en-US';
        const fractional_digits = 8;
        const display_money = displayMoney(0.1234, 'BTC', { preferred_language, fractional_digits });

        expect(display_money).toBe('0.12340000 BTC');
    });

    it('should work for de-GE, BTC', async () => {
        const preferred_language = 'de-GE';
        const fractional_digits = 8;
        const display_money = displayMoney(0.1234, 'BTC', { preferred_language, fractional_digits });

        expect(display_money).toBe('0,12340000 BTC');
    });

    it('should work for en_US, USD (invalid locale)', async () => {
        const preferred_language = 'en_US';
        const display_money = displayMoney(1234, 'USD', { preferred_language });

        expect(display_money).toBe('1234 USD');
    });

    it('should work for en-US, USDt', async () => {
        const preferred_language = 'en-US';
        const display_money = displayMoney(1234.56789, 'USDt', { preferred_language });

        expect(display_money).toBe('1,234.57 USDt');
    });
});
