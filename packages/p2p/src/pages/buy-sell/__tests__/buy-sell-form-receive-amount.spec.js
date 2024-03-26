import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import BuySellFormReceiveAmount from 'Pages/buy-sell/buy-sell-form-receive-amount.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        buy_sell_store: {
            advert: {
                local_currency: 'USD',
            },
            is_sell_advert: true,
            receive_amount: 100,
        },
    })),
}));

jest.mock('@sendbird/chat', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/groupChannel', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/message', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

describe('<BuySellFormReceiveAmount/>', () => {
    it('should show the proper formatted amount and currency', () => {
        render(<BuySellFormReceiveAmount />);
        expect(screen.getByText("You'll receive")).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
    });

    it('should show the proper description', () => {
        useStores.mockReturnValue({
            buy_sell_store: {
                advert: {
                    local_currency: 'USD',
                },
                is_sell_advert: false,
                receive_amount: 205.55,
            },
        });
        render(<BuySellFormReceiveAmount />);

        expect(screen.getByText("You'll send")).toBeInTheDocument();
        expect(screen.getByText('205.55 USD')).toBeInTheDocument();
    });
});
