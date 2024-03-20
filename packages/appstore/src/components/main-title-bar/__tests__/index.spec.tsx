import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore, ExchangeRatesProvider } from '@deriv/stores';
import { APIProvider } from '@deriv/api';
import MainTitleBar from '..';

jest.mock('src/components/banners/wallets-banner', () => jest.fn(() => 'WalletsBanner'));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((name: string) => {
        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        account_list: [
                            {
                                account_category: 'wallet',
                                currency: 'USD',
                                is_virtual: 0,
                            },
                        ],
                    },
                },
            };
        } else if (name === 'balance') {
            return {
                data: {
                    balance: {
                        accounts: {
                            CRW909900: {
                                balance: 1000,
                            },
                        },
                    },
                },
            };
        } else if (name === 'website_status') {
            return {
                data: {
                    website_status: {
                        currencies_config: {
                            USD: { type: 'fiat' },
                        },
                    },
                },
            };
        }

        return undefined;
    }),
}));

describe('MainTitleBar', () => {
    const mock_store = mockStore({
        modules: {
            cashier: {
                account_transfer: { is_transfer_confirm: false },
                general_store: { is_loading: false },
            },
        },
        client: {
            is_landing_company_loaded: false,
        },
        feature_flags: { data: { wallet: false } },
    });

    const render_container = (mock_store_override?: ReturnType<typeof mockStore>) => {
        const wrapper = ({ children }: React.PropsWithChildren) => (
            <APIProvider>
                <StoreProvider store={mock_store_override ?? mock_store}>
                    <ExchangeRatesProvider>{children}</ExchangeRatesProvider>
                </StoreProvider>
            </APIProvider>
        );

        return render(<MainTitleBar />, {
            wrapper,
        });
    };

    it('should render the component', () => {
        const { container } = render_container();
        expect(container).toBeInTheDocument();
    });

    it('should render the correct title text', () => {
        render_container();
        expect(screen.getByText(/Trader's Hub/)).toBeInTheDocument();
    });

    it('should show total assets loader when platforms are not yet loaded', () => {
        render_container();
        expect(screen.getByText(/Loading/)).toBeInTheDocument();
    });

    it('should render the total assets text when platforms are loaded', () => {
        mock_store.client.is_landing_company_loaded = true;
        render_container();
        expect(screen.getByText(/Total assets/)).toBeInTheDocument();
    });
});
