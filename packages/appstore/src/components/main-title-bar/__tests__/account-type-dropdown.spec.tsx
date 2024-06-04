import AccountTypeDropdown from '../account-type-dropdown';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';

describe('AccountTypeDropdown', () => {
    it('should render the component', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<AccountTypeDropdown />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should show real account type', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<AccountTypeDropdown />, { wrapper });
        expect(screen.getByText('Real')).toBeInTheDocument();
    });

    it('should show demo account type', () => {
        const mock = mockStore({
            traders_hub: {
                selected_account_type: 'demo',
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<AccountTypeDropdown />, { wrapper });
        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('should change to demo account type', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<AccountTypeDropdown />, { wrapper });
        userEvent.click(screen.getByText('Real'));
        userEvent.click(screen.getByText('Demo'));
        expect(mock.traders_hub.selectAccountType).toBeCalledTimes(1);
    });
});
