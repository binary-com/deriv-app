import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useIsRealAccountNeededForCashier } from '@deriv/hooks';
import { getStaticUrl, routes } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import MenuLink from 'App/Components/Layout/Header/menu-link';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => <div>Mock Link Icon</div>),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useIsRealAccountNeededForCashier: jest.fn(() => false),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getStaticUrl: jest.fn(() => 'MockUrl'),
}));

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({
        isDesktop: true,
        isMobile: false,
        isTablet: false,
    })),
}));

describe('MenuLink', () => {
    const mockRootStore = mockStore({});
    let mock_props: React.ComponentProps<typeof MenuLink>;

    beforeEach(() => {
        mock_props = {
            link_to: '',
            data_testid: 'dt_menu_link',
            text: 'Mock text',
            onClickLink: jest.fn(),
        };
    });

    const renderCheck = () => {
        expect(screen.getByText('Mock Link Icon')).toBeInTheDocument();
        expect(screen.getByText('Mock text')).toBeInTheDocument();
    };

    const renderComponent = () => {
        const history = createBrowserHistory();
        render(<MenuLink {...mock_props} />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mockRootStore}>
                    <Router history={history}>{children}</Router>
                </StoreProvider>
            ),
        });
    };

    it('should render no links with icon and text without passing link_to', () => {
        renderComponent();

        renderCheck();
        const link = screen.getByTestId('dt_menu_link');
        expect(link.onclick).toBeFalsy();
    });

    it('should render menu link if deriv_static_url', () => {
        mock_props.link_to = 'MockLink';

        renderComponent();

        renderCheck();
        const link = screen.getByTestId('dt_menu_link');
        userEvent.click(link);
        expect(mock_props.onClickLink).toHaveBeenCalled();
    });

    it('should render with passing link_to', () => {
        (getStaticUrl as jest.Mock).mockReturnValue('');
        mock_props.link_to = 'MockLink';

        renderComponent();

        renderCheck();
        const link = screen.getByTestId('dt_menu_link');
        userEvent.click(link);
        expect(mock_props.onClickLink).toHaveBeenCalled();
    });

    it('should not render if  is_hidden is passed', () => {
        mock_props.is_hidden = true;

        renderComponent();

        expect(screen.queryByText('Mock Link Icon')).not.toBeInTheDocument();
        expect(screen.queryByText('Mock text')).not.toBeInTheDocument();
        const link = screen.queryByTestId('dt_menu_link');
        expect(link).not.toBeInTheDocument();
    });

    it('should render menu link for mobile and two icons with passed suffix_icon', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        mock_props.link_to = '/account/languages';
        mock_props.suffix_icon = 'suffix_icon';

        renderComponent();

        const icons = screen.getAllByText('Mock Link Icon');
        expect(icons).toHaveLength(2);
        const link = screen.getByTestId('dt_menu_link');
        expect(link).toBeInTheDocument();
        userEvent.click(link);
        expect(mockRootStore.ui.setMobileLanguageMenuOpen).toHaveBeenCalled();
    });

    it('should render menu link for cashier for real account on traders hub', () => {
        (useIsRealAccountNeededForCashier as jest.Mock).mockReturnValue(true);
        mock_props.link_to = '/cashier/deposit';
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: routes.traders_hub },
        });

        renderComponent();

        renderCheck();
        const link = screen.getByTestId('dt_menu_link');
        userEvent.click(link);
        expect(mockRootStore.ui.toggleNeedRealAccountForCashierModal).toHaveBeenCalled();
        expect(mock_props.onClickLink).toHaveBeenCalled();
    });

    it('should render menu link for cashier for virtual account on traders hub', () => {
        (useIsRealAccountNeededForCashier as jest.Mock).mockReturnValue(false);
        mockRootStore.client.is_virtual = true;
        mock_props.link_to = '/cashier/deposit';
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: routes.traders_hub },
        });

        renderComponent();

        renderCheck();
        const link = screen.getByTestId('dt_menu_link');
        userEvent.click(link);
        expect(mockRootStore.ui.toggleReadyToDepositModal).toHaveBeenCalled();
        expect(mock_props.onClickLink).toHaveBeenCalled();
    });
});
