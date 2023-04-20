import React from 'react';
import BalanceText from '../balance-text';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('BalanceText', () => {
    it('should render the component', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<BalanceText balance={1000} currency='USD' size='m' underline_style='none' />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render the correct balance and currency', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<BalanceText balance={1000} currency='USD' size='m' underline_style='none' />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('1,000.00')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('should render the correct div class for dotted underline_style', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<BalanceText balance={1000} currency='USD' size='m' underline_style='dotted' />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByTestId('dt_balance-text__container')).toHaveClass('balance-text--dotted');
    });

    it('should have classname ending with amount if user has selected_account_type demo and no active real account ', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'demo',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<BalanceText balance={1000} currency='USD' size='m' underline_style='none' />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('1,000.00')).toHaveClass('balance-text__text--amount');
    });

    it('should have classname ending with demo if user has selected_account_type demo and has an active real account ', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'demo',
            },
            client: {
                has_active_real_account: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<BalanceText balance={1000} currency='USD' size='m' underline_style='none' />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('1,000.00')).toHaveClass('balance-text__text--demo');
    });

    it('should have classname ending with no-amount if user has selected_account_type real and no active real account ', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'real',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<BalanceText balance={1000} currency='USD' size='m' underline_style='none' />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('1,000.00')).toHaveClass('balance-text__text--no-amount');
    });

    it('should have classname ending with real if user has selected_account_type demo and has an active real account ', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'real',
            },
            client: {
                has_active_real_account: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<BalanceText balance={1000} currency='USD' size='m' underline_style='none' />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('1,000.00')).toHaveClass('balance-text__text--real');
    });
});
