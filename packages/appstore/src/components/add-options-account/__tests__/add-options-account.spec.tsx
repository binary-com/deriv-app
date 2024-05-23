import React from 'react';
import AddOptionsAccount from '../add-options-account';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('AddOptionsAccount', () => {
    it('should render correctly', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AddOptionsAccount />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render the proper text', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AddOptionsAccount />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('To trade CFDs, get a Deriv Apps account first.')).toBeInTheDocument();
        expect(screen.getByText('Get a Deriv account')).toBeInTheDocument();
    });

    it('should call openRealAccountSignup when button is clicked', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AddOptionsAccount />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        fireEvent.click(screen.getByText('Get a Deriv account'));
        expect(mock.ui.openRealAccountSignup).toBeCalledTimes(1);
    });

    it('should call openRealAccountSignup with maltainvest when button is clicked and user is eu', () => {
        const mock = mockStore({
            traders_hub: {
                is_real: true,
                content_flag: 'low_risk_cr_eu',
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AddOptionsAccount />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        fireEvent.click(screen.getByText('Get a Deriv account'));
        expect(mock.ui.openRealAccountSignup).toBeCalledWith('maltainvest');
    });

    it('should open the setShouldShowCooldownModal', () => {
        const mock = mockStore({
            traders_hub: {
                is_real: true,
                content_flag: 'low_risk_cr_eu',
            },
            client: {
                real_account_creation_unlock_date: 2020 - 10 - 10,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AddOptionsAccount />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        fireEvent.click(screen.getByText('Get a Deriv account'));
        expect(mock.ui.setShouldShowCooldownModal).toBeCalledTimes(1);
    });
});
