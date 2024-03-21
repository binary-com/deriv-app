import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import TradersHubHeader from '../traders-hub-header';
import { TStores } from '@deriv/stores/types';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({ history: {} }),
    useLocation: () => ({ pathname: '/appstore/traders-hub' }),
}));
jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => 'MockedIcon'),
        StaticUrl: jest.fn(() => 'MockedStaticUrl'),
        Popover: jest.fn(props => <span>{props.message}</span>),
    };
});
jest.mock('App/Components/Routes', () => ({ BinaryLink: 'MockedBinaryLink' }));
jest.mock('App/Components/Layout/Header', () => ({ MenuLinks: 'MockedMenuLinks' }));
jest.mock('App/Containers/RealAccountSignup', () => jest.fn(() => <div>MockedRealAccountSignup</div>));
jest.mock('App/Components/Layout/Header/account-info', () => jest.fn(() => 'MockedAccountInfo'));
jest.mock('App/Components/Layout/Header/toggle-menu-drawer.jsx', () => jest.fn(() => 'MockedToggleMenuDrawer'));
jest.mock('Assets/SvgComponents/header/deriv-rebranding-logo.svg', () => jest.fn(() => 'MockedDerivBrandLogo'));
jest.mock('../../../CurrencySelectionModal', () => jest.fn(() => <div>MockedCurrencySelectionModal</div>));
jest.mock('../show-notifications', () => jest.fn(() => <div>MockedShowNotifications</div>));

jest.mock('@deriv/hooks', () => ({
    useFeatureFlags: () => ({
        is_next_wallet_enabled: false,
    }),
    useIsRealAccountNeededForCashier: () => false,
    useHasSetCurrency: () => true,
}));

describe('TradersHubHeader', () => {
    const renderComponent = (mock_store?: TStores) =>
        render(
            <StoreProvider
                store={
                    mock_store ??
                    mockStore({
                        ui: { is_desktop: true },
                        feature_flags: {
                            data: {
                                next_wallet: true,
                            },
                        },
                        traders_hub: {
                            modal_data: {
                                active_modal: 'currency_selection',
                            },
                        },
                    })
                }
            >
                <TradersHubHeader />
            </StoreProvider>
        );

    it('should render "CurrencySelectionModal" as a child component', async () => {
        renderComponent();
        expect(await screen.findByText('MockedCurrencySelectionModal')).toBeInTheDocument();
    });

    it('should render "RealAccountSignup" as a child component', async () => {
        const mock_store = mockStore({
            ui: {
                is_desktop: true,
                is_real_acc_signup_on: true,
            },
        });
        renderComponent(mock_store);
        expect(await screen.findByText('MockedRealAccountSignup')).toBeInTheDocument();
    });

    it('should render "View tutorial" option in the header', () => {
        renderComponent();
        expect(screen.getByText('View tutorial')).toBeInTheDocument();
    });

    it('should render "Notifications" option in the header', () => {
        renderComponent();
        expect(screen.getByText('MockedShowNotifications')).toBeInTheDocument();
    });

    it('should render "Manage account settings" option in the header', () => {
        renderComponent();
        expect(screen.getByText('Manage account settings')).toBeInTheDocument();
    });

    it('should render the Cashier button in mobile view', () => {
        renderComponent(
            mockStore({
                ui: { is_desktop: false, is_mobile: true },
            })
        );
        expect(screen.getByRole('button', { name: 'Cashier' })).toBeInTheDocument();
    });
});
