import React from 'react';
import { render, screen } from '@testing-library/react';
import { WalletsUpgradeStepTwoContent } from '../wallets-upgrade-step-two';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('WalletsUpgradeStepTwoContent', () => {
    const containerReadyToEnableWallets = (mock: ReturnType<typeof mockStore>) => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        return render(<WalletsUpgradeStepTwoContent />, {
            wrapper,
        });
    };

    it('should render WalletsUpgradeStepTwoContent component', () => {
        const mock = mockStore({});
        const { container } = containerReadyToEnableWallets(mock);

        expect(container).toBeInTheDocument();
    });

    it('should render the info sections', () => {
        const mock = mockStore({});
        containerReadyToEnableWallets(mock);

        expect(screen.getByText('Ready to enable Wallets')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Wallets will become your dedicated fund management tool, allowing you to transfer funds between Wallets and trading accounts instantly.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText('Your open trading positions will not be affected while we are setting up your wallets.')
        ).toBeInTheDocument();
    });
});
