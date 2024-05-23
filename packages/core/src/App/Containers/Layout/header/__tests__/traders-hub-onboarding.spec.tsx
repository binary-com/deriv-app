import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TradersHubOnboarding from '../traders-hub-onboarding';
import { routes } from '@deriv/shared';
import { TCoreStores } from '@deriv/stores/types';

describe('TradersHubOnboarding', () => {
    const onboarding_icon_testid = 'dt_traders_hub_onboarding_icon';
    const popover_wrapper_testid = 'dt_popover_wrapper';
    const view_onboarding_message = /view tutorial/i;

    const history = createBrowserHistory();
    const renderTradersHubOnboardingWithRouter = (mocked_store: TCoreStores = mockStore({})) => {
        render(
            <Router history={history}>
                <StoreProvider store={mocked_store}>
                    <TradersHubOnboarding />
                </StoreProvider>
            </Router>
        );
    };

    it('should render "TradersHubOnboarding" component', () => {
        renderTradersHubOnboardingWithRouter();
        expect(screen.getByTestId('dt_traders_hub_onboarding')).toBeInTheDocument();

        userEvent.click(screen.getByTestId(onboarding_icon_testid));
    });

    it('should display Traders hub onboarding icon + popover tooltip should appear on hover in desktop', () => {
        renderTradersHubOnboardingWithRouter();
        expect(screen.getByTestId(onboarding_icon_testid)).toBeInTheDocument();

        userEvent.hover(screen.getByTestId(popover_wrapper_testid));
        const view_onboarding = screen.getByText(view_onboarding_message);
        expect(view_onboarding).toBeInTheDocument();
    });

    it('should not display popover tooltip in mobile', () => {
        renderTradersHubOnboardingWithRouter(
            mockStore({
                ui: {
                    is_mobile: true,
                },
            })
        );
        userEvent.hover(screen.getByTestId(popover_wrapper_testid));
        const view_onboarding = screen.queryByText(view_onboarding_message);
        expect(view_onboarding).not.toBeInTheDocument();

        userEvent.click(screen.getByTestId(onboarding_icon_testid));
    });
});
