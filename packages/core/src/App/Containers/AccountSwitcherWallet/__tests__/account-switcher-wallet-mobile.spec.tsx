import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { AccountSwitcherWalletMobile } from '../account-switcher-wallet-mobile';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWalletAccountsList: jest.fn(() => ({
        data: [{ loginid: 'CR007', dtrade_loginid: 'CR008' }],
    })),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('../account-switcher-wallet-list', () => ({
    AccountSwitcherWalletList: () => <div>AccountSwitcherWalletList</div>,
}));

const props: React.ComponentProps<typeof AccountSwitcherWalletMobile> = {
    is_visible: true,
    toggle: jest.fn(),
};

let modal_root_el: HTMLDivElement;

beforeAll(() => {
    modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'deriv_app');
    document.body.appendChild(modal_root_el);
});

afterAll(() => {
    document.body.removeChild(modal_root_el);
});

const wrapper = (mock: ReturnType<typeof mockStore>) => {
    const Component = ({ children }: { children: JSX.Element }) => {
        return <StoreProvider store={mock}>{children}</StoreProvider>;
    };
    return Component;
};

describe('AccountSwitcherWalletMobile', () => {
    it('should render the component', () => {
        const store = mockStore({
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
        render(<AccountSwitcherWalletMobile {...props} />, { wrapper: wrapper(store) });
        expect(screen.getByText('Options accounts')).toBeInTheDocument();
        expect(screen.getByText('AccountSwitcherWalletList')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Manage funds' })).toBeInTheDocument();
        expect(screen.getByText('Looking for CFDs? Go to Trader’s hub')).toBeInTheDocument();
    });

    it('should render list wallets', () => {
        const store = mockStore({
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

        render(<AccountSwitcherWalletMobile {...props} />, { wrapper: wrapper(store) });
        expect(screen.getByText('AccountSwitcherWalletList')).toBeInTheDocument();
    });

    it('should toggle the switcher on footer click', () => {
        const store = mockStore({
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
        render(<AccountSwitcherWalletMobile {...props} />, { wrapper: wrapper(store) });
        const footer = screen.getByText('Looking for CFDs? Go to Trader’s hub');
        userEvent.click(footer);
        expect(props.toggle).toHaveBeenCalledTimes(1);
    });
});
