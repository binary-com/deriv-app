import React from 'react';
import RealAccountSwitcher from '../real-account-switcher';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { MT5_ACCOUNT_STATUS } from '@deriv/shared';
import { useMFAccountStatus } from '@deriv/hooks';

jest.mock('Components/containers/currency-switcher-container', () => ({
    __esModule: true,
    default: ({ children }: { children: JSX.Element }) => <div>{children}</div>,
}));

jest.mock('../real-account-card', () => ({
    __esModule: true,
    default: () => <div>RealAccountCard</div>,
}));

jest.mock('@deriv/account', () => ({
    __esModule: true,
    getStatusBadgeConfig: () => ({
        text: 'In review',
        icon: 'pending',
    }),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useMFAccountStatus: jest.fn(),
}));

jest.mock('Components/pre-loader/currency-switcher-loader', () => ({
    __esModule: true,
    default: () => <div>Loader</div>,
}));

describe('RealAccountSwitcher', () => {
    beforeEach(() => {
        (useMFAccountStatus as jest.Mock).mockReturnValue(null);
    });

    it('should render the component', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealAccountSwitcher />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render AccountNeedsVerification component with the correct pending status', () => {
        const mock = mockStore({
            traders_hub: {
                is_eu_user: true,
            },
        });
        (useMFAccountStatus as jest.Mock).mockReturnValue(MT5_ACCOUNT_STATUS.PENDING);
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealAccountSwitcher />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('In review')).toBeInTheDocument();
        expect(screen.getByText('In review')).toHaveClass(
            'switcher-status-badge__container switcher-status-badge__container--pending'
        );
    });

    it('should render RealAccountCard if its an eu user and has a maltainvest account', () => {
        const mock = mockStore({
            client: {
                has_maltainvest_account: true,
            },
            traders_hub: {
                is_eu_user: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealAccountSwitcher />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('RealAccountCard')).toBeInTheDocument();
    });

    it('should render RealAccountCard if the user has no cr account and not an eu user', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealAccountSwitcher />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('RealAccountCard')).toBeInTheDocument();
    });

    it('should render Currency Switcher Loader if is_switching is true', () => {
        const mock = mockStore({
            client: {
                is_switching: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealAccountSwitcher />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Loader')).toBeInTheDocument();
    });

    it('should render empty div', () => {
        const mock = mockStore({
            client: {
                is_switching: false,
                has_maltainvest_account: false,
            },
            traders_hub: {
                is_eu_user: false,
                no_CR_account: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RealAccountSwitcher />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.queryByText('RealAccountCard')).not.toBeInTheDocument();
    });
});
