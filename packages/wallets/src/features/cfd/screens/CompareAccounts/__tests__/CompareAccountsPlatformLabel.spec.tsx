import React from 'react';
import { render, screen } from '@testing-library/react';
import { getPlatformType } from '../compareAccountsConfig';
import CompareAccountsPlatformLabel from '../CompareAccountsPlatformLabel';

jest.mock('../compareAccountsConfig', () => ({
    getPlatformType: jest.fn(),
}));

describe('CompareAccountsPlatformLabel', () => {
    const mockPlatform = 'mt5' as const;

    beforeEach(() => {
        (getPlatformType as jest.Mock).mockReturnValue('MT5');
    });

    it('renders correct platform label according to the given platform', () => {
        render(<CompareAccountsPlatformLabel platform={mockPlatform} />);

        const labelElement = screen.getByTestId('dt_wallets_compare_accounts_platform_label');
        expect(labelElement).toHaveTextContent('MT5 Platform');
    });

    it('calls getPlatformType with the correct platform', () => {
        render(<CompareAccountsPlatformLabel platform={mockPlatform} />);

        expect(getPlatformType).toHaveBeenCalledWith(mockPlatform);
    });

    it('handles different platform types correctly', () => {
        (getPlatformType as jest.Mock).mockReturnValue('DerivX');

        render(<CompareAccountsPlatformLabel platform={'dxtrade' as const} />);

        const labelElement = screen.getByTestId('dt_wallets_compare_accounts_platform_label');
        expect(labelElement).toHaveTextContent('Deriv X');
    });
});
