import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useDevice from '../../../../../../../hooks/useDevice';
import { TransferProvider, useTransfer } from '../../../provider';
import TransferForm from '../TransferForm';

const mockAccounts = ['CR1', 'CR2'];
let mockFormikValues: unknown;

jest.mock('../../../../../../../hooks/useDevice', () => jest.fn());

jest.mock('../../../provider', () => ({
    ...jest.requireActual('../../../provider'),
    TransferProvider: jest.fn(({ children }) => <div>{children}</div>),
    useTransfer: jest.fn(),
})); // const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

jest.mock('../../TransferFormAmountInput', () => ({
    ...jest.requireActual('../../TransferFormAmountInput'),
    TransferFormAmountInput: jest.fn(({ fieldName }) => <input placeholder={fieldName} type='input' />),
}));

jest.mock('../../TransferFormDropdown', () => ({
    ...jest.requireActual('../../TransferFormDropdown'),
    TransferFormDropdown: jest.fn(({ fieldName }) => <div>{fieldName}</div>),
}));

const mockTransferMessages = jest.fn(() => {
    const { setValues } = useFormikContext();
    useEffect(() => {
        setValues(mockFormikValues);
    }, [setValues]);

    return <div>TransferMessages</div>;
});

jest.mock('../../TransferMessages', () => ({
    ...jest.requireActual('../../TransferMessages'),
    TransferMessages: jest.fn(() => mockTransferMessages()),
}));

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => <TransferProvider>{children}</TransferProvider>;

describe('<TransferForm />', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({
            isMobile: false,
        });
    });

    it('should test if the loader is shown until values are received from useTransfer hook', () => {
        (useTransfer as jest.Mock).mockReturnValue({
            isLoading: true,
        });

        render(<TransferForm />, { wrapper });

        expect(screen.getByTestId('dt_wallets_loader')).toBeInTheDocument();
    });

    it('should test that transfer button is disabled when fromAmount is 0', async () => {
        (useTransfer as jest.Mock).mockReturnValue({
            activeWallet: mockAccounts[0],
            isLoading: false,
            requestTransferBetweenAccounts: jest.fn(),
        });

        mockFormikValues = {
            activeAmountFieldName: 'fromAmount',
            fromAccount: mockAccounts[0],
            fromAmount: 0,
            isError: false,
            toAccount: mockAccounts[1],
            toAmount: 10,
        };

        render(<TransferForm />, { wrapper });

        await waitFor(() => {
            expect(within(screen.getByTestId('dt_transfer_form_submit_btn')).getByRole('button')).toBeDisabled();
        });
    });

    it('should test that transfer button is disabled when toAmount is 0', async () => {
        (useTransfer as jest.Mock).mockReturnValue({
            activeWallet: mockAccounts[0],
            isLoading: false,
            requestTransferBetweenAccounts: jest.fn(),
        });

        mockFormikValues = {
            activeAmountFieldName: 'fromAmount',
            fromAccount: mockAccounts[0],
            fromAmount: 1000,
            isError: false,
            toAccount: mockAccounts[1],
            toAmount: 0,
        };

        render(<TransferForm />, { wrapper });

        await waitFor(() => {
            expect(within(screen.getByTestId('dt_transfer_form_submit_btn')).getByRole('button')).toBeDisabled();
        });
    });

    it('should test if API is called with correct params when transfer button is clicked', async () => {
        const dummyRequest = jest.fn();

        mockFormikValues = {
            activeAmountFieldName: 'fromAmount',
            fromAccount: mockAccounts[0],
            fromAmount: 100,
            isError: false,
            toAccount: mockAccounts[1],
            toAmount: 10,
        };

        (useTransfer as jest.Mock).mockReturnValue({
            activeWallet: mockAccounts[0],
            isLoading: false,
            requestTransferBetweenAccounts: dummyRequest,
        });

        render(<TransferForm />, { wrapper });

        await waitFor(() => {
            const transferSubmitButton = within(screen.getByTestId('dt_transfer_form_submit_btn')).getByRole('button');
            userEvent.click(transferSubmitButton);
        });

        await waitFor(() => {
            expect(dummyRequest).toBeCalledWith({
                activeAmountFieldName: 'fromAmount',
                fromAccount: mockAccounts[0],
                fromAmount: 100,
                isError: false,
                toAccount: mockAccounts[1],
                toAmount: 10,
            });
        });
    });
});
