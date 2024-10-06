import { displayMoney } from '../display-money';

describe('displayMoney', () => {
    it('should display USD in en-US format', async () => {
        const display_money = displayMoney(1234.56, 'USD');

        expect(display_money).toBe('1,234.56 USD');
    });

    it('should add up zero decimals', async () => {
        const display_money = displayMoney(1234.5, 'USD');

        expect(display_money).toBe('1,234.50 USD');
    });

    it('should display BTC in en-US format', async () => {
        const fractional_digits = 8;
        const display_money = displayMoney(0.1234, 'BTC', { fractional_digits });

        expect(display_money).toBe('0.12340000 BTC');
    });

    it('should display without fractional digits', async () => {
        const fractional_digits = 0;
        const display_money = displayMoney(1234, 'USD', { fractional_digits });

        expect(display_money).toBe('1,234.00 USD');
    });

    it('should display USDt in en-US format', async () => {
        const display_money = displayMoney(1234.56789, 'USDt');

        expect(display_money).toBe('1,234.57 USDt');
    });
});
