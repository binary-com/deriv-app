import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterModalSearch from '../filter-modal-search';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
}));

const mock_store = {
    buy_sell_store: {
        setIsFilterModalLoading: jest.fn(),
    },
    my_profile_store: {
        getPaymentMethodsList: jest.fn(),
        setSearchResults: jest.fn(),
        setSearchTerm: jest.fn(),
    },
};
jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<FilterModalSearch />', () => {
    it('should render the component', () => {
        render(<FilterModalSearch />);
        expect(screen.getByPlaceholderText('Search payment method')).toBeInTheDocument();
    });
    it('should handle search functionality', async () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        render(<FilterModalSearch />);
        const field = screen.getByRole('textbox');
        userEvent.type(field, 'test');
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        await waitFor(() => {
            expect(setTimeout).toHaveBeenCalled();
        });
        jest.clearAllTimers();
    });
    it('should handle clearing search text', () => {
        render(<FilterModalSearch />);
        const field = screen.getByRole('textbox');
        userEvent.type(field, 'test');
        const cross_icon = screen.getByTestId('dt_filter_modal_search_icon');
        userEvent.click(cross_icon);
        expect(field).toHaveValue('');
        expect(mock_store.my_profile_store.setSearchTerm).toHaveBeenCalledWith('');
    });
});
