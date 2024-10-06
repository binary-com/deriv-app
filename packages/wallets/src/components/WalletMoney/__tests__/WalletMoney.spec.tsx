import React from 'react';
import { render } from '@testing-library/react';
import WalletMoney from '../WalletMoney';
import '@testing-library/jest-dom';

const mockCurrencyConfig = {
    BTC: {
        display_code: 'BTC',
        fractional_digits: 8,
    },
    USD: {
        display_code: 'USD',
        fractional_digits: 2,
    },
};

jest.mock('@deriv/api-v2', () => ({
    useCurrencyConfig: jest.fn(() => ({
        getConfig: (currency: 'BTC' | 'USD') => mockCurrencyConfig[currency],
    })),
}));

describe('WalletMoney', () => {
    it('renders with default props', () => {
        const { container } = render(<WalletMoney />);

        expect(container).toHaveTextContent('0.00');
    });

    it('renders positive amount with a sign', () => {
        const { container } = render(<WalletMoney amount={1000} currency='USD' hasSign />);

        expect(container).toHaveTextContent('+1,000.00 USD');
    });

    it('renders negative amount with sign', () => {
        const { container } = render(<WalletMoney amount={-500} currency='USD' hasSign={true} />);

        expect(container).toHaveTextContent('-500.00 USD');
    });

    it('applies fractional digits from currency config', () => {
        const { container } = render(<WalletMoney amount={5} currency='BTC' />);

        expect(container).toHaveTextContent('5.00000000 BTC');
    });

    it('renders without currency code if no currency is provided', () => {
        const { container } = render(<WalletMoney amount={500} hasSign={false} />);

        expect(container).toHaveTextContent('500.00');
    });
});
