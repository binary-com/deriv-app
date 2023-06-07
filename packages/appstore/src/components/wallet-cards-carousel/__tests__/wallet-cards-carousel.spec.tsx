import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletCardsCarousel from '..';
import { TWalletAccount } from 'Types';

const mockedRootStore = mockStore({});

jest.mock('./../cards-slider', () => jest.fn(() => <div>slider</div>));

describe('<WalletCardsCarousel />', () => {
    const items: TWalletAccount[] = [
        {
            name: 'USD',
            currency: 'USD',
            icon: '',
            balance: 10784,
            icon_type: 'fiat',
            landing_company_shortcode: 'svg',
            is_disabled: false,
            is_virtual: false,
            loginid: 'CRW10001',
        },
        {
            name: 'Demo USD',
            currency: 'USD',
            icon: '',
            balance: 100000,
            icon_type: 'fiat',
            landing_company_shortcode: 'svg',
            is_disabled: false,
            is_virtual: true,
            loginid: 'CRW10002',
        },
    ];

    it('Should render slider', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletCardsCarousel items={items} />
            </StoreProvider>
        );
        const slider = screen.queryByText('slider');

        expect(slider).toBeInTheDocument();
    });

    it('Should render buttons for REAL', () => {
        const item = [items[0]];
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletCardsCarousel items={item} />
            </StoreProvider>
        );

        const btn1 = screen.queryByText(/Deposit/i);
        const btn2 = screen.queryByText(/Withdraw/i);
        const btn3 = screen.queryByText(/Transfer/i);
        const btn4 = screen.queryByText(/Transactions/i);

        expect(btn1).toBeInTheDocument();
        expect(btn2).toBeInTheDocument();
        expect(btn3).toBeInTheDocument();
        expect(btn4).toBeInTheDocument();
    });

    it('Should render buttons for DEMO', () => {
        const item = [items[1]];
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletCardsCarousel items={item} />
            </StoreProvider>
        );
        const btn1 = screen.queryByText(/Transfer/i);
        const btn2 = screen.queryByText(/Transactions/i);
        const btn3 = screen.queryByText(/Reset balance/i);

        expect(btn1).toBeInTheDocument();
        expect(btn2).toBeInTheDocument();
        expect(btn3).toBeInTheDocument();
    });
});
