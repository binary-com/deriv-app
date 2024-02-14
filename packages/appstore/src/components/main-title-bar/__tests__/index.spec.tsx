import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore, ExchangeRatesProvider } from '@deriv/stores';
import { APIProvider /*useFetch*/ } from '@deriv/api';
import MainTitleBar from '..';

//TODO: Uncomment once useWalletMigration hook is optimized for production release.
// jest.mock('Components/wallets-banner', () => jest.fn(() => 'WalletsBanner'));
// const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'authorize'>>;

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

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({
        isDesktop: true,
        isMobile: false,
        isTablet: false,
    })),
}));

describe('MainTitleBar', () => {
    const mock_store = mockStore({
        exchange_rates: {
            data: {
                date: 1631032849924,
            },
        },
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

    //TODO: Uncomment once useWalletMigration hook is optimized for production release.
    // it('should not render WalletsBanner component if wallet feature flag is disabled', () => {
    //     render_container();
    //     expect(screen.queryByText('WalletsBanner')).not.toBeInTheDocument();
    // });

    //TODO: Uncomment once useWalletMigration hook is optimized for production release.
    // it('should render WalletsBanner component if wallet feature flag is enabled', () => {
    //     const mock_store = mockStore({
    //         client: { accounts: { CR123456: { token: '12345' } }, loginid: 'CR123456' },
    //         feature_flags: { data: { wallet: true } },
    //     });
    //     // @ts-expect-error need to come up with a way to mock the return type of useFetch
    //     mockUseFetch.mockReturnValue({
    //         data: {
    //             authorize: {
    //                 account_list: [
    //                     {
    //                         account_category: 'trading',
    //                         currency: 'USD',
    //                         is_virtual: 0,
    //                     },
    //                 ],
    //             },
    //         },
    //     });
    //     render_container(mock_store);
    //     expect(screen.getByText('WalletsBanner')).toBeInTheDocument();
    // });

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
