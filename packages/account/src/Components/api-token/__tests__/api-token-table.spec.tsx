import React from 'react';
import { screen, render } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import ApiTokenContext from '../api-token-context';
import ApiTokenTable from '../api-token-table';
import { TApiContext } from '../../../Types';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

describe('ApiTokenTable', () => {
    const mock_props: TApiContext = {
        api_tokens: [
            {
                display_name: 'Token 1',
                token: 'token_1',
                scopes: ['read', 'trade', 'payments', 'admin', 'trading_information'],
                last_used: '2023-07-28T12:00:00Z',
            },
        ],
        deleteToken: jest.fn(),
    };

    const renderComponent = () => {
        render(
            <ApiTokenContext.Provider value={mock_props}>
                <ApiTokenTable />
            </ApiTokenContext.Provider>
        );
    };

    let expectedTexts = [''];

    beforeEach(() => {
        expectedTexts = [
            'Name',
            'Token',
            'Scopes',
            'Token 1',
            'Read',
            'Trade',
            'Payments',
            'Admin',
            'Trading information',
            '28/07/2023',
        ];
    });

    it('should render ApiTokenTable', () => {
        expectedTexts.push('Last used');
        renderComponent();
        expect(screen.getByText('Token 1')).not.toHaveClass('da-api-token__scope-item--name');
        expectedTexts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it('should render in responsive view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        expectedTexts.push('Last Used');
        renderComponent();
        expect(screen.getByText('Token 1')).toHaveClass('da-api-token__scope-item--name');
        expectedTexts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it('should display Never if last_used is undefined', () => {
        mock_props.api_tokens = [
            {
                display_name: 'Token 1',
                token: 'token_1',
                scopes: ['read', 'trade', 'payments', 'admin', 'trading_information'],
                last_used: '',
            },
        ];
        renderComponent();
        expect(screen.getByText('Never')).toBeInTheDocument();
    });
});
