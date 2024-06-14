import React from 'react';
import { screen, render } from '@testing-library/react';
import ApiTokenContext from '../api-token-context';
import ApiTokenTable from '../api-token-table';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TApiContext } from '../../../Types';

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
    const store = mockStore({});

    const renderComponent = ({ props = mock_props, store_config = store }) => {
        render(
            <StoreProvider store={store_config}>
                <ApiTokenContext.Provider value={props}>
                    <ApiTokenTable />
                </ApiTokenContext.Provider>
            </StoreProvider>
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
        renderComponent({});
        expect(screen.getByText('Token 1')).not.toHaveClass('da-api-token__scope-item--name');
        expectedTexts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it('should render in mobile view', () => {
        const mock_store = mockStore({
            ui: {
                is_mobile_or_tablet: true,
            },
        });
        expectedTexts.push('Last Used');
        renderComponent({ store_config: mock_store });
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
        renderComponent({});
        expect(screen.getByText('Never')).toBeInTheDocument();
    });
});
