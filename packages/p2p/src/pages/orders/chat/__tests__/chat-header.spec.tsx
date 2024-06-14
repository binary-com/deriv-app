import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import ChatHeader from '../chat-header';

let mock_store: ReturnType<typeof useStores>;
jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: () => mock_store,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobileOrTablet: jest.fn(() => false),
}));

describe('<ChatHeader />', () => {
    beforeEach(() => {
        mock_store = {
            order_store: {
                order_information: {
                    other_user_details: {
                        name: 'Test User',
                        is_online: 1,
                        last_online_time: 1619515200,
                    },
                },
            },
        };
    });

    it('should show chat header with online status label', () => {
        render(<ChatHeader />);
        expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it(`should show user's last online status`, () => {
        mock_store.order_store.order_information.other_user_details.is_online = 0;
        render(<ChatHeader />);
        expect(screen.getByText('Seen more than 6 months ago')).toBeInTheDocument();
    });
});
