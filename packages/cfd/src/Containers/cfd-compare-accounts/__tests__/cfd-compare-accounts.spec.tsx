import React from 'react';
import { MemoryRouter, useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import CompareCFDs from '../cfd-compare-accounts';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true, isTablet: false, isMobile: false })),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(),
}));

jest.mock('../../../Assets/svgs/trading-platform', () => jest.fn(() => <div>Mocked Icon</div>));
jest.mock('../instruments-icon-with-label', () => jest.fn(() => <div>Mocked Icon With Label</div>));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    CFDCompareAccountsCarousel: jest.fn(() => <div>Next Button</div>),
}));

describe('<CompareCFDs />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mock = mockStore({
        client: {
            trading_platform_available_accounts: {},
        },
        traders_hub: {
            available_cfd_accounts: [
                {
                    availability: 'Non-EU',
                    platform: 'dxtrade',
                    name: 'Deriv X',
                    market_type: 'all',
                    icon: '"DerivX"',
                    description: 'Example Description',
                },
                {
                    availability: 'Non-EU',
                    platform: 'ctrader',
                    name: 'cTrader',
                    market_type: 'all',
                    icon: '"CTrader"',
                    description: 'Example Description2',
                },
            ],
            is_demo: false,
            is_eu_user: false,
        },
        modules: {
            cfd: {
                current_list: {},
                setAccountType: jest.fn(),
                setJurisdictionSelectedShortcode: jest.fn(),
                enableCFDPasswordModal: jest.fn(),
            },
        },
    });

    it('should render the component and redirect to compare account page', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CompareCFDs />, { wrapper });

        expect(screen.getByText(/Trader's hub/i)).toBeInTheDocument();
        expect(screen.getByText(/Compare CFDs accounts/i)).toBeInTheDocument();
    });

    it('should render the carousel componet with the correct content', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CompareCFDs />, { wrapper });

        expect(screen.getByText(/Next Button/i)).toBeInTheDocument();
    });

    it('should render the component and redirect to compare demo account page', () => {
        mock.traders_hub.is_demo = true;

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CompareCFDs />, { wrapper });

        expect(screen.getByText(/Trader's hub/i)).toBeInTheDocument();
        expect(screen.getByText(/Compare CFDs demo accounts/i)).toBeInTheDocument();
    });

    it("navigates to the trader's hub when the navigation element is clicked", () => {
        const historyMock = {
            push: jest.fn(),
        };
        (useHistory as jest.Mock).mockReturnValue(historyMock);
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(
            <MemoryRouter>
                <CompareCFDs />
            </MemoryRouter>,
            { wrapper }
        );

        const navigationElement = screen.getByText(/Trader's hub/i);
        navigationElement.click();

        expect(historyMock.push).toHaveBeenCalledWith(routes.traders_hub);
    });
});
