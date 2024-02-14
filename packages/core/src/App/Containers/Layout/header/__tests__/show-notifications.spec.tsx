import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { render, screen } from '@testing-library/react';
import ShowNotifications from '../show-notifications';

jest.mock('App/Components/Layout/Header', () => {
    const original_module = jest.requireActual('App/Components/Layout/Header');
    return {
        ...original_module,
        ToggleNotifications: () => <div>mockedToggleNotifications</div>,
    };
});

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({
        isDesktop: true,
        isMobile: false,
        isTablet: false,
    })),
}));

describe('ShowNotifications', () => {
    let store: TStores;
    beforeEach(() => {
        store = mockStore({});
    });

    it('should render and display the "ShowNotifications" component on screen', () => {
        render(
            <StoreProvider store={store}>
                <ShowNotifications />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_traders_hub_show_notifications')).toBeInTheDocument();
        expect(screen.getByTestId('dt_traders_hub_show_notifications')).toHaveClass('traders-hub-header__notification');
    });

    it('should render the ToggleNotifications child component', () => {
        render(
            <StoreProvider store={store}>
                <ShowNotifications />
            </StoreProvider>
        );
        expect(screen.getByText('mockedToggleNotifications')).toBeInTheDocument();
    });
});
