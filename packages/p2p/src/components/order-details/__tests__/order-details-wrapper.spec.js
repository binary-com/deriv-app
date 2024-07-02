import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useStores } from 'Stores';
import OrderDetailsWrapper from '../order-details-wrapper.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

const mockUseStores = () => {
    useStores.mockImplementation(() => ({
        order_store: { order_information: { should_show_order_footer: true } },
        sendbird_store: { setShouldShowChatModal: jest.fn() },
    }));
};

beforeAll(() => mockUseStores());

describe('<OrderDetailsWrapper />', () => {
    it('Should render component on mobile version', async () => {
        isMobile.mockReturnValue(true);
        const mobile_props = {
            className: 'order-details',
            body_className: 'order-details__body',
            height_offset: '80px',
            is_flex: true,
            is_modal_open: true,
            page_title: 'mobile test',
        };

        render(<OrderDetailsWrapper {...mobile_props} />);

        await waitFor(() => {
            expect(screen.getByTestId('order-details-wrapper-mobile')).toBeInTheDocument();
            expect(screen.getByText('mobile test')).toBeInTheDocument();
        });
    });

    it('Should render component on desktop version', async () => {
        isMobile.mockReturnValue(false);
        const desktop_props = {
            onClick: jest.fn(),
            page_title: 'desktop test',
        };

        render(<OrderDetailsWrapper {...desktop_props} />);

        await waitFor(() => {
            expect(screen.getByTestId('dt_page_return')).toBeInTheDocument();
            expect(screen.getByText('desktop test')).toBeInTheDocument();
        });
    });

    it('when complain svg icon is clicked', () => {
        isMobile.mockReturnValue(true);
        const setShouldShowChatModalFn = jest.fn();
        jest.spyOn(React, 'useState').mockImplementation(init => [init, setShouldShowChatModalFn]);

        render(<OrderDetailsWrapper page_title='test' />);

        const svg_icon = screen.getByTestId('testid');
        fireEvent.click(svg_icon);
        expect(setShouldShowChatModalFn).toHaveBeenCalledTimes(1);
    });
});
