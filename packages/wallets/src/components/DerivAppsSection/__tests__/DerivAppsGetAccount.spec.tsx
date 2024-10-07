import React, { PropsWithChildren } from 'react';
import {
    APIProvider,
    useActiveLinkedToTradingAccount,
    useActiveWalletAccount,
    useCreateNewRealAccount,
    useInvalidateQuery,
} from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../AuthProvider';
import { ModalProvider } from '../../ModalProvider';
import { DerivAppsGetAccount } from '../DerivAppsGetAccount';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveLinkedToTradingAccount: jest.fn(() => ({ isLoading: false })),
    useActiveWalletAccount: jest.fn(() => ({
        data: { currency_config: { display_code: 'USD' }, is_virtual: false, loginid: 'CRW1' },
    })),
    useCreateNewRealAccount: jest.fn(() => ({ isLoading: false })),
    useInvalidateQuery: jest.fn(() => Promise.resolve({})),
}));

jest.mock('../../../hooks/useSyncLocalStorageClientAccounts', () =>
    jest.fn(() => ({ addTradingAccountToLocalStorage: jest.fn(() => Promise.resolve({})) }))
);

jest.mock('../../../hooks/useAllBalanceSubscription', () =>
    jest.fn(() => ({
        data: {
            CRW1: {
                balance: 100,
                currency: 'USD',
            },
        },
        isLoading: false,
    }))
);

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

const mockShow = jest.fn();
jest.mock('../../ModalProvider', () => ({
    ...jest.requireActual('../../ModalProvider'),
    useModal: jest.fn(() => ({
        ...jest.requireActual('../../ModalProvider').useModal(),
        show: mockShow,
    })),
}));

const mockUseCreateNewRealAccount = useCreateNewRealAccount as jest.MockedFunction<typeof useCreateNewRealAccount>;
const mockUseActiveLinkedToTradingAccount = useActiveLinkedToTradingAccount as jest.MockedFunction<
    typeof useActiveLinkedToTradingAccount
>;
const mockUseInvalidateQuery = useInvalidateQuery as jest.MockedFunction<typeof useInvalidateQuery>;
const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

const wrapper = ({ children }: PropsWithChildren) => {
    return (
        <APIProvider>
            <WalletsAuthProvider>
                <ModalProvider>{children}</ModalProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

describe('DerivAppsGetAccount', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    it('renders the component', () => {
        render(<DerivAppsGetAccount />, { wrapper });
        expect(screen.getByRole('button', { name: 'Enable' })).toBeInTheDocument();
    });

    it('calls createTradingAccount function when the Enable button is clicked', async () => {
        const mockMutateAsync = jest.fn(() => Promise.resolve({ new_account_real: 'new_account_real' }));
        const mockInvalidate = jest.fn();
        (mockUseCreateNewRealAccount as jest.Mock).mockReturnValue({ isLoading: false, mutateAsync: mockMutateAsync });
        (mockUseActiveLinkedToTradingAccount as jest.Mock).mockReturnValue({ isLoading: false });
        mockUseInvalidateQuery.mockReturnValue(mockInvalidate);
        render(<DerivAppsGetAccount />, { wrapper });
        const button = screen.getByRole('button', { name: 'Enable' });
        await userEvent.click(button);
        await waitFor(() => expect(mockMutateAsync).toBeCalled());
        await waitFor(() => expect(mockInvalidate).toBeCalledWith('account_list'));
    });

    it('calls show function when the Enable button is clicked and new_account_real is defined on mobile', () => {
        const mockMutateAsync = jest.fn(() => Promise.resolve({ new_account_real: 'new_account_real' }));
        (mockUseCreateNewRealAccount as jest.Mock).mockReturnValue({
            isLoading: false,
            isSuccess: true,
            mutateAsync: mockMutateAsync,
        });
        (mockUseActiveLinkedToTradingAccount as jest.Mock).mockReturnValue({ isLoading: false });
        (mockUseDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        render(<DerivAppsGetAccount />, { wrapper });
        expect(mockShow).toBeCalled();
    });

    it('calls show function when the Enable button is clicked and new_account_real is defined on desktop', () => {
        const mockMutateAsync = jest.fn(() => Promise.resolve({ new_account_real: 'new_account_real' }));
        (mockUseCreateNewRealAccount as jest.Mock).mockReturnValue({
            isLoading: false,
            isSuccess: true,
            mutateAsync: mockMutateAsync,
        });
        (mockUseActiveLinkedToTradingAccount as jest.Mock).mockReturnValue({ isLoading: false });
        (mockUseDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        render(<DerivAppsGetAccount />, { wrapper });
        expect(mockShow).toBeCalled();
        const args = mockShow.mock.calls[0][0];
        render(args, { wrapper });
        expect(screen.getByRole('button', { name: 'Maybe later' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Transfer funds' })).toBeInTheDocument();
    });

    it('does not create a new account when the active wallet is virtual', async () => {
        const mockMutateAsync = jest.fn();
        (mockUseCreateNewRealAccount as jest.Mock).mockReturnValue({ isLoading: false, mutateAsync: mockMutateAsync });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_virtual: true },
        });
        render(<DerivAppsGetAccount />, { wrapper });
        const button = screen.getByRole('button', { name: 'Enable' });
        await userEvent.click(button);
        await waitFor(() => expect(mockMutateAsync).not.toBeCalled());
    });
});
