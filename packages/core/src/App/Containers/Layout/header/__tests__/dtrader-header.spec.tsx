import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import DTraderHeader from '../dtrader-header';
import { useDevice } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('App/Components/Layout/Header', () => ({
    MenuLinks: jest.fn(() => <div>Mocked Menu Links</div>),
    PlatformSwitcher: jest.fn(() => <div>Mocked Platform Switcher</div>),
}));
jest.mock('App/Containers/RealAccountSignup', () => jest.fn(() => <div>Mocked Real Account SignUp</div>));
jest.mock('App/Components/Layout/Header/toggle-menu-drawer.jsx', () =>
    jest.fn(() => <div>Mocked Toggle Menu Drawer</div>)
);
jest.mock('../header-account-actions', () => jest.fn(() => <div>Mocked Header Account Action</div>));
jest.mock('../traders-hub-home-button', () => jest.fn(() => <div>Mocked Traders Home Button</div>));

describe('DTraderHeader', () => {
    const mock_store = mockStore({ ui: { is_real_acc_signup_on: true } });
    const renderComponent = (modified_store = mock_store) =>
        render(
            <StoreProvider store={modified_store}>
                <DTraderHeader />
            </StoreProvider>
        );

    it('should render Platform switcher, Traders Home button, Menu Links, Account actions and Real Account SignUp components, in Desktop view', () => {
        renderComponent();
        const desktop_view_text_content = [
            'Mocked Platform Switcher',
            'Mocked Traders Home Button',
            'Mocked Menu Links',
            'Mocked Header Account Action',
            'Mocked Real Account SignUp',
        ];
        desktop_view_text_content.forEach(text => expect(screen.getByText(text)).toBeInTheDocument());
    });

    it('should render Toggle Menu Drawer, Menu Links, Header Account Action and Real Account SignUp components, in Mobile view', () => {
        (useDevice as jest.Mock).mockImplementationOnce(() => ({ isDesktop: false }));
        renderComponent(
            mockStore({
                ui: { is_desktop: false, is_real_acc_signup_on: true },
                modules: { cashier: { payment_agent: 'MOCK_PAYMENT_AGENT' } },
            })
        );
        const mobile_view_text_content = [
            'Mocked Toggle Menu Drawer',
            'Mocked Menu Links',
            'Mocked Header Account Action',
            'Mocked Real Account SignUp',
        ];
        mobile_view_text_content.forEach(text => expect(screen.getByText(text)).toBeInTheDocument());
    });
});
