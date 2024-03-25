import React from 'react';
import RealWalletsUpgrade from '../real-wallets-upgrade';
import { render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('<RealWalletsUpgrade />', () => {
    const wrapper = (mock: ReturnType<typeof mockStore>) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };
    it('should render the Modal', () => {
        const mock = mockStore({
            traders_hub: {
                is_real_wallets_upgrade_on: true,
                toggleWalletsUpgrade: true,
            },
        });

        const { container } = render(<RealWalletsUpgrade />, { wrapper: wrapper(mock) });

        expect(container).toBeInTheDocument();
    });

    it('should not render the Modal if is_real_wallets_upgrade_on is false', () => {
        const mock = mockStore({
            traders_hub: {
                is_real_wallets_upgrade_on: false,
                toggleWalletsUpgrade: false,
            },
        });

        const { container } = render(<RealWalletsUpgrade />, { wrapper: wrapper(mock) });

        expect(container).toBeEmptyDOMElement();
    });
});
