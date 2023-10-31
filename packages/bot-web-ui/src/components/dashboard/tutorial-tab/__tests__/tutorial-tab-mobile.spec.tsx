import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import TutorialsTabMobile from '../tutorials-tab-mobile';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('<TutorialsTabDesktop />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({
        ui: {
            is_mobile: true,
        },
    });
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        mock_DBot_store?.quick_strategy?.setValue('durationtype', 't');
        mock_DBot_store?.quick_strategy?.setSelectedStrategy('MARTINGALE');
        mock_DBot_store?.quick_strategy?.setFormVisibility(true);
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
        const { container } = render(
            <BrowserRouter>
                <TutorialsTabMobile />
            </BrowserRouter>,
            {
                wrapper,
            }
        );
    });

    it('should render tutorials tab for mobile', () => {
        const container = screen.getByTestId('test-tutorials-mobile');
        expect(container).toBeInTheDocument();
    });

    it('should toggle the search bar visibility when the arrow icon is clicked', () => {
        const searchInput = screen.getByTestId('id-test-input-search');

        expect(searchInput).toBeInTheDocument();

        fireEvent.click(searchInput);

        expect(screen.getByTestId('id-search-hidden')).toBeInTheDocument();
    });

    it('should toggle the search bar visibility when the arrow icon is clicked', () => {
        const arrowIcon = screen.getByTestId('id-arrow-left-bold');
        const searchInput = screen.getByTestId('id-test-input-search');

        expect(searchInput).toBeInTheDocument();

        fireEvent.click(searchInput);

        expect(screen.getByTestId('id-search-hidden')).toBeInTheDocument();

        fireEvent.click(arrowIcon);

        expect(screen.getByTestId('id-search-visible')).toBeInTheDocument();
    });

    it('should update the search input value and call onSearch', () => {
        const inputElement = screen.getByTestId('id-test-input-search');
        const inputValue = 'Test search query';

        fireEvent.change(inputElement, { target: { value: inputValue } });

        expect(inputElement.value).toBe(inputValue);
    });

    it('should clear Search on input when clicked on close', () => {
        const inputElement = screen.getByTestId('id-test-input-search');
        const inputValue = 'Test search query';
        const checkinputValue = '';

        fireEvent.change(inputElement, { target: { value: inputValue } });

        const closeIcon = screen.getByTestId('id-close-icon');
        userEvent.click(closeIcon);

        expect(inputElement.value).toBe(checkinputValue);
    });
});
