import React from 'react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { routes } from '@deriv/shared';
import { TRoute } from 'Types';
import Account from '../account';

jest.mock('../../Account/page-overlay-wrapper', () => jest.fn(() => <div>MockPageOverlayWrapper</div>));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>MockLoading</div>,
}));

describe('Account', () => {
    const store = mockStore({
        ui: {
            is_account_settings_visible: true,
        },
    });

    const route_list: Array<TRoute> = [
        {
            getTitle: () => 'Profile',
            icon: 'mockIcon',
            subroutes: [
                {
                    path: routes.personal_details,
                    component: () => <div>MockPersonalDetails</div>,
                    getTitle: () => 'Personal details',
                    default: true,
                },
                {
                    path: routes.trading_assessment,
                    component: () => <div>MockTradeAssessment</div>,
                    getTitle: () => 'Trade assessment',
                },
            ],
        },
    ];

    const mock_props: React.ComponentProps<typeof Account> = {
        routes: route_list,
    };

    const mock_route = routes.personal_details;

    const renderComponent = ({ store_config = store, route = mock_route, props = mock_props }) =>
        render(
            <MemoryRouter initialEntries={[route]}>
                <StoreProvider store={store_config}>
                    <BrowserRouter>
                        <Account {...props} />
                    </BrowserRouter>
                </StoreProvider>
            </MemoryRouter>
        );

    it('should render account page', () => {
        renderComponent({});
        expect(screen.getByText('MockPageOverlayWrapper')).toBeInTheDocument();
    });

    it('should render loader while the client is still logging in', () => {
        const new_store_config = mockStore({
            client: {
                is_logging_in: true,
            },
        });

        renderComponent({ store_config: new_store_config });
        expect(screen.getByText('MockLoading')).toBeInTheDocument();
    });
});
