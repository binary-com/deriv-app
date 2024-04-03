import React from 'react';
import { Formik } from 'formik';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TTransferableAccounts } from '../../../../../types';
import TransferAccountSelection from '../TransferAccountSelection';

const mockAccounts = [
    {
        account_type: 'mt5',
        loginid: 'CR1',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_type: 'ctrader',
        loginid: 'CR2',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_type: 'dxtrade',
        loginid: 'CR3',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_type: 'binary',
        loginid: 'CR4',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_type: 'binary',
        loginid: 'CR5',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_type: 'binary',
        loginid: 'CR6',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
] as TTransferableAccounts;

let mockOnClickAccount = mockAccounts[1];

jest.mock('../../../../../provider', () => ({
    ...jest.requireActual('../../../../../provider'),
    useTransfer: jest.fn(() => ({
        accounts: mockAccounts,
        isLoading: false,
        setTransferValidationSchema: jest.fn(schema => {}),
    })),
}));

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    TransferDropdown: jest.fn(({ label, onSelect, value }) => (
        <div
            onClick={() => {
                onSelect(mockOnClickAccount);
            }}
        >
            {label}-{value.loginid}
        </div>
    )),
}));

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Formik
            initialValues={{
                fromAccount: mockAccounts[0],
                fromAmount: '',
                toAccount: mockAccounts[1],
                toAmount: '',
            }}
            onSubmit={() => {}}
        >
            {children}
        </Formik>
    );
};

describe('<TransferAccountSelection />', () => {
    it('should test if from and to account dropdowns have correct accounts selected on initial render', () => {
        render(<TransferAccountSelection />, { wrapper });

        expect(screen.getByText('From-CR1')).toBeInTheDocument();
        expect(screen.getByText('To-CR2')).toBeInTheDocument();
    });

    it('should test if accounts swap when the user selects same fromAccount as selected in toAccount', async () => {
        render(<TransferAccountSelection />, { wrapper });

        const fromDropdown = screen.getByText('From-CR1');

        await fireEvent.click(fromDropdown);

        await waitFor(() => {
            expect(screen.getByText('From-CR2')).toBeInTheDocument();
            expect(screen.getByText('To-CR1')).toBeInTheDocument();
        });
    });

    it("should check whether correct account is selected for fromAccount when fromAccount dropdown's onSelect is triggered", async () => {
        mockOnClickAccount = mockAccounts[2];

        render(<TransferAccountSelection />, { wrapper });

        const fromDropdown = screen.getByText('From-CR1');

        await fireEvent.click(fromDropdown);

        await waitFor(() => {
            expect(screen.getByText('From-CR3')).toBeInTheDocument();
            expect(screen.getByText('To-CR2')).toBeInTheDocument();
        });
    });

    it("should check whether correct account is selected for toAccount when toAccount dropdown's onSelect is triggered", async () => {
        mockOnClickAccount = mockAccounts[2];

        render(<TransferAccountSelection />, { wrapper });

        const toDropdown = screen.getByText('To-CR2');

        await fireEvent.click(toDropdown);

        await waitFor(() => {
            expect(screen.getByText('From-CR1')).toBeInTheDocument();
            expect(screen.getByText('To-CR3')).toBeInTheDocument();
        });
    });
});
