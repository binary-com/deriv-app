import React from 'react';
import { useFormikContext } from 'formik';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { useTransferMessages } from '../../../hooks';
import { useTransfer } from '../../../provider';
import TransferMessages from '../TransferMessages';

jest.mock('formik', () => ({
    useFormikContext: jest.fn(),
}));

jest.mock('../../../hooks', () => ({
    useTransferMessages: jest.fn(),
}));

jest.mock('../../../provider', () => ({
    useTransfer: jest.fn(),
}));

describe('TransferMessages', () => {
    const setFieldValueMock = jest.fn();
    const mockValues = {
        fromAccount: 'account1',
        toAccount: 'account2',
    };

    beforeEach(() => {
        (useFormikContext as jest.Mock).mockReturnValue({
            setFieldValue: setFieldValueMock,
            values: mockValues,
        });

        (useTransfer as jest.Mock).mockReturnValue({
            accountLimits: {},
            activeWalletExchangeRates: {},
            USDExchangeRates: {},
        });

        (useTransferMessages as jest.Mock).mockReturnValue([
            {
                action: { buttonLabel: 'Action', navigateTo: '/action', shouldOpenInNewTab: true },
                message: { text: 'Error message', values: {} },
                type: 'error',
            },
            {
                action: null,
                message: { text: 'Info message', values: {} },
                type: 'info',
            },
        ]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render messages correctly', () => {
        render(
            <Router>
                <TransferMessages />
            </Router>
        );

        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByText('Info message')).toBeInTheDocument();

        const actionLink = screen.getByRole('link', { name: 'Action' });
        expect(actionLink).toHaveAttribute('href', '/action');
        expect(actionLink).toHaveAttribute('rel', 'noopener noreferrer');
        expect(actionLink).toHaveAttribute('target', '_blank');
    });

    it('should set isError field based on messages', () => {
        render(
            <Router>
                <TransferMessages />
            </Router>
        );

        expect(setFieldValueMock).toHaveBeenCalledWith('isError', true);
    });
});
