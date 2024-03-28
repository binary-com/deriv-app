import React from 'react';
import { WalletsUpgradeStepOneContent } from '../wallets-upgrade-step-one';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

let mock = mockStore({});

const checkContainerWhyWalletsComponent = () => {
    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    const { container } = render(<WalletsUpgradeStepOneContent />, {
        wrapper,
    });
    expect(container).toBeInTheDocument();
};

describe('WalletsUpgradeStepOneContent', () => {
    beforeEach(() => {
        mock = mockStore({});
    });
    it('should render WalletsUpgradeStepOneContent Component', () => {
        checkContainerWhyWalletsComponent();
    });

    it('should render icon', () => {
        checkContainerWhyWalletsComponent();
        expect(screen.queryByTestId('dt_wallets_upgrade_step_one')).toBeInTheDocument();
    });

    it('should render title, description and bullets', () => {
        checkContainerWhyWalletsComponent();
        expect(screen.getByText('Why Wallets')).toBeInTheDocument();
        expect(screen.getByText('Deposit, transfer, trade')).toBeInTheDocument();
        const bullets = [
            'Better funds segregation',
            'Instant transfers between Wallets and trading accounts',
            'Multiple currency support',
        ];
        bullets.forEach(bullet => {
            expect(screen.getByText(bullet)).toBeInTheDocument();
        });
    });
});
