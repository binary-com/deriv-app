import React from 'react';
import { render, screen, within } from '@testing-library/react';
import WithdrawalNoBalance from '../WithdrawalNoBalance';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightCashierNoBalanceIcon: jest.fn(({ height, width }) => (
        <span>
            DerivLightCashierNoBalanceIcon-{height}/{width}
        </span>
    )),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    WalletsActionScreen: jest.fn(({ description, descriptionSize, icon, renderButtons, title }) => (
        <div>
            <div>{icon}</div>
            <span>
                WalletsActionScreen-{title}/{description}/{descriptionSize}
            </span>
            <div>{renderButtons()}</div>
        </div>
    )),
}));

const mockActiveWallet = {
    balance: 0,
    currency: 'USD',
};

describe('WithdrawalNoBalance', () => {
    it('should test whether WalletsActionScreen is rendered with correct props', () => {
        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <WithdrawalNoBalance activeWallet={mockActiveWallet} />
        );

        expect(
            screen.getByText(
                `WalletsActionScreen-No funds in USD Wallet/You don't have funds in your USD Wallet to complete a withdrawal./md`
            )
        ).toBeInTheDocument();

        expect(screen.getByText('DerivLightCashierNoBalanceIcon-128px/128px')).toBeInTheDocument();
        expect(within(screen.getByRole('button')).getByText('Add funds')).toBeInTheDocument();
    });
});
