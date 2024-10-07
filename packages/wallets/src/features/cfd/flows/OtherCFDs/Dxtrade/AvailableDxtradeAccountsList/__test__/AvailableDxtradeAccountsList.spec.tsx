import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../../../../../AuthProvider';
import { ModalProvider } from '../../../../../../../components/ModalProvider';
import AvailableDxtradeAccountsList from '../AvailableDxtradeAccountsList';

const mockShow = jest.fn();
jest.mock('../../../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../../../components/ModalProvider'),
    useModal: jest.fn(() => ({
        ...jest.requireActual('../../../../../../../components/ModalProvider').useModal(),
        show: mockShow,
    })),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </WalletsAuthProvider>
    </APIProvider>
);

describe('AvailableDxtradeAccountsList', () => {
    it('render AvailableDxtradeAccountsList component', () => {
        render(<AvailableDxtradeAccountsList />, { wrapper });
        expect(screen.getByTestId('dt_icon_dxtrade')).toBeInTheDocument();
        expect(screen.getByText('Deriv X')).toBeInTheDocument();
    });

    it('shows DxtradeEnterPasswordModal upon clicking on the TradingAccountCard component', async () => {
        render(<AvailableDxtradeAccountsList />, { wrapper });
        const tradingAccountCard = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(tradingAccountCard);
        expect(mockShow).toHaveBeenCalled();
    });
});
