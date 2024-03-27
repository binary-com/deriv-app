import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { AccountSwitcherWallet } from '../account-switcher-wallet';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('../account-switcher-wallet-list', () => ({
    AccountSwitcherWalletList: () => <div>AccountSwitcherWalletList</div>,
}));

const props: React.ComponentProps<typeof AccountSwitcherWallet> = {
    is_visible: true,
    toggle: jest.fn(),
};

describe('AccountSwitcherWalletComponent', () => {
    const wrapper = (mock: ReturnType<typeof mockStore>) => {
        const Component = ({ children }: { children: JSX.Element }) => {
            return <StoreProvider store={mock}>{children}</StoreProvider>;
        };
        return Component;
    };

    it('should render the component', () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CR007: {
                        account_category: 'wallet',
                        currency: 'USD',
                        linked_to: [{ loginid: 'CR008', platform: 'dtrade' }],
                    },
                },
            },
        });

        render(<AccountSwitcherWallet {...props} />, { wrapper: wrapper(mock) });
        expect(screen.getByText('Options accounts')).toBeInTheDocument();
        expect(screen.getByText('AccountSwitcherWalletList')).toBeInTheDocument();
        expect(screen.getByText('Looking for CFDs? Go to Trader’s hub')).toBeInTheDocument();
    });

    it('should render list items based on the number of wallets', () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CR007: {
                        account_category: 'wallet',
                        currency: 'USD',
                        linked_to: [{ loginid: 'CR008', platform: 'dtrade' }],
                    },
                    CR009: {
                        account_category: 'wallet',
                        currency: 'BTC',
                        linked_to: [{ loginid: 'CR010', platform: 'dtrade' }],
                    },
                    CR011: {
                        account_category: 'wallet',
                        currency: 'ETH',
                        linked_to: [{ loginid: 'CR012', platform: 'dtrade' }],
                    },
                },
            },
        });

        render(<AccountSwitcherWallet {...props} />, { wrapper: wrapper(mock) });
        expect(screen.getByText('AccountSwitcherWalletList')).toBeInTheDocument();
    });

    it('should toggle the switcher on button click', () => {
        const mock = mockStore({});

        render(<AccountSwitcherWallet {...props} />, { wrapper: wrapper(mock) });
        const button = screen.getByTestId('dt_go_to_arrow');
        userEvent.click(button);
        expect(props.toggle).toHaveBeenCalledTimes(1);
    });
});
