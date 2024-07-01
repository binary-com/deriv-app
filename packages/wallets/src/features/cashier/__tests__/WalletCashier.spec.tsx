import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import WalletCashier from '../WalletCashier';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    Loader: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('../components/', () => ({
    ...jest.requireActual('../components/'),
    WalletCashierContent: jest.fn(() => (
        <>
            <div style={{ height: '300px' }}>WalletCashierContent</div>
        </>
    )),
    WalletCashierHeader: jest.fn(({ hideWalletDetails }) => {
        return <>{!hideWalletDetails && <div>WalletCashierHeader</div>}</>;
    }),
}));

describe('<WalletCashier />', () => {
    it('should show the loader until the response from API has been received', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        (useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>).mockReturnValue({
            isLoading: true,
        });

        render(<WalletCashier />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render the WalletCashierContent', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        (useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>).mockReturnValue({
            isLoading: false,
        });

        render(<WalletCashier />);
        expect(screen.getByText('WalletCashierContent')).toBeInTheDocument();
    });

    it('should contain the wallet header when the content is not scrolled', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        (useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>).mockReturnValue({
            isLoading: false,
        });

        render(<WalletCashier />);

        expect(screen.queryByText('WalletCashierHeader')).toBeInTheDocument();
    });

    it('should hide the wallet header when content is scrolled', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        (useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>).mockReturnValue({
            isLoading: false,
        });

        render(<WalletCashier />);

        const walletsCashierContent = screen.getByTestId('dt_wallets_cashier_content');
        fireEvent.scroll(walletsCashierContent, { target: { scrollTop: 300 } });

        expect(screen.queryByText('WalletCashierHeader')).not.toBeInTheDocument();
    });
});
