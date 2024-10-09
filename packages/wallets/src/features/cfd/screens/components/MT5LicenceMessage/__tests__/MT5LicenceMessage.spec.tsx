import React from 'react';
import { render, screen } from '@testing-library/react';
import MT5LicenseMessage from '../MT5LicenceMessage';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

const mockRegulatedAccount = {
    licence_number: 'mock_licence_number',
    market_type: 'financial',
    name: 'mock_company_name',
    product: 'financial',
    regulatory_authority: 'mock_regulatory_authority',
    shortcode: 'bvi',
};

const mockNonRegulatedAccount = {
    market_type: 'all',
    name: 'mock_company_name',
    product: 'swap_free',
    shortcode: 'svg',
};

describe('<MT5LicenceMessage />', () => {
    it('displays correct message for regulated account', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<MT5LicenseMessage account={mockRegulatedAccount} />);

        expect(
            screen.getByText(
                'You are adding your Deriv MT5 Financial account under mock_company_name, regulated by the mock_regulatory_authority (licence no. mock_licence_number).'
            )
        );
    });

    it('displays correct message for non-regulated account', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<MT5LicenseMessage account={mockNonRegulatedAccount} />);

        expect(
            screen.getByText(
                'You are adding your Deriv MT5 Swap-Free account under mock_company_name (company no. 273 LLC 2020).'
            )
        );
    });
});
