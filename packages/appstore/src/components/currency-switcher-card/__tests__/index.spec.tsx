import CurrencySwitcherCard from '../index';
import { render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('../demo/demo-account-card', () => ({
    __esModule: true,
    default: () => <div>DemoAccountCard</div>,
}));

jest.mock('../real/real-account-switcher', () => ({
    __esModule: true,
    default: () => <div>RealAccountSwitcher</div>,
}));

describe('CurrencySwitcherCard', () => {
    it('should render empty div if user has no real account', () => {
        const mock = mockStore({
            traders_hub: {
                is_real: true,
            },
            client: {
                has_any_real_account: false,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<CurrencySwitcherCard />, { wrapper });
        expect(container).toBeEmptyDOMElement();
    });
    it('should render demo account card if user is in demo', () => {
        const mock = mockStore({
            traders_hub: {
                is_demo: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<CurrencySwitcherCard />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(container).toHaveTextContent('DemoAccountCard');
    });

    it('should render real account switcher if user is in real and not an eu user', () => {
        const mock = mockStore({
            traders_hub: {
                is_real: true,
                is_eu_user: false,
            },
            client: {
                has_any_real_account: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<CurrencySwitcherCard />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(container).toHaveTextContent('RealAccountSwitcher');
    });

    it('should render real account switcher if user is in real and is an eu user', () => {
        const mock = mockStore({
            traders_hub: {
                is_real: true,
                is_eu_user: true,
            },
            client: {
                has_maltainvest_account: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<CurrencySwitcherCard />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(container).toHaveTextContent('RealAccountSwitcher');
    });
});
