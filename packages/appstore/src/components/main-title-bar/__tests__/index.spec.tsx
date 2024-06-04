import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import MainTitleBar from '..';

jest.mock('Components/banners/wallets-banner', () => jest.fn(() => 'WalletsBanner'));

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
            exchange_rates: {},
        },
        feature_flags: { data: { wallet: false } },
    });

    const render_container = (mock_store_override?: ReturnType<typeof mockStore>) => {
        const wrapper = ({ children }: React.PropsWithChildren) => (
            <StoreProvider store={mock_store_override ?? mock_store}>{children}</StoreProvider>
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
