import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransferConfirmScreen from '../TransferConfirmScreen';

describe('<TransferConfirmScreenScreen />', () => {
    let mockedProps: React.ComponentProps<typeof TransferConfirmScreen>;
    beforeEach(() => {
        mockedProps = {
            checkboxLabel: 'Checkbox label',
            data: [],
            isSubmitting: false,
            onClickBack: jest.fn(),
            onClickConfirm: jest.fn(),
            title: 'Transfer confirm title',
        };
    });

    it('should render proper icon', () => {
        render(<TransferConfirmScreen {...mockedProps} />);

        const icon = screen.getByTestId('dt_red_warning_icon');

        expect(icon).toBeInTheDocument();
    });

    it('should render proper title', () => {
        render(<TransferConfirmScreen {...mockedProps} />);

        const title = screen.getByText(mockedProps.title);

        expect(title).toBeInTheDocument();
    });

    it('should render proper table with data', () => {
        mockedProps.data = [
            { itemKey: 'transfer_from', label: 'From account number', value: 'CR1234567' },
            {
                itemKey: 'transfer_to',
                label: ['To account number', 'Account holder name'],
                value: ['CR7654321', 'John Doe'],
            },
            {
                itemKey: 'amount',
                label: 'Amount',
                value: '10.00 USD',
            },
            { itemKey: 'description', label: 'Description', value: 'Lorem ipsum' },
        ];

        render(<TransferConfirmScreen {...mockedProps} />);

        expect(screen.getByText('From account number')).toBeInTheDocument();
        expect(screen.getByText('CR1234567')).toBeInTheDocument();
        expect(screen.getByText('To account number')).toBeInTheDocument();
        expect(screen.getByText('CR7654321')).toBeInTheDocument();
        expect(screen.getByText('Account holder name')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(screen.getByText('10.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Lorem ipsum')).toBeInTheDocument();
    });

    it('should render proper checkbox label', () => {
        render(<TransferConfirmScreen {...mockedProps} />);

        const checkboxLabel = screen.getByText(mockedProps.checkboxLabel as string);

        expect(checkboxLabel).toBeInTheDocument();
    });

    it('should trigger onClickBack callback when the user is clicking on Back button', () => {
        render(<TransferConfirmScreen {...mockedProps} />);

        const backButton = screen.getByRole('button', {
            name: 'Back',
        });
        userEvent.click(backButton);

        expect(mockedProps.onClickBack).toHaveBeenCalledTimes(1);
    });

    it('Transfer now button should be disabled by default', () => {
        render(<TransferConfirmScreen {...mockedProps} />);

        const transferNowButton = screen.getByRole('button', {
            name: 'Transfer now',
        });

        expect(transferNowButton).toBeDisabled();
    });

    it('Transfer now button should be enabled when the user enables the checkbox', () => {
        render(<TransferConfirmScreen {...mockedProps} />);

        const checkBox = screen.getByRole('checkbox');
        userEvent.click(checkBox);

        const transferNowButton = screen.getByRole('button', {
            name: 'Transfer now',
        });

        expect(transferNowButton).toBeEnabled();
    });

    it('Back button should be disabled when transfer request is submitting', () => {
        mockedProps.isSubmitting = true;
        render(<TransferConfirmScreen {...mockedProps} />);

        const checkBox = screen.getByRole('checkbox');
        userEvent.click(checkBox);

        const backButton = screen.getByRole('button', {
            name: 'Back',
        });

        expect(backButton).toBeDisabled();
    });

    it('should trigger onClickConfirm callback when the user is clicking on Transfer now button and checkbox is enabled', () => {
        render(<TransferConfirmScreen {...mockedProps} />);

        const checkBox = screen.getByRole('checkbox');
        userEvent.click(checkBox);

        const transferNowButton = screen.getByRole('button', {
            name: 'Transfer now',
        });
        userEvent.click(transferNowButton);

        expect(mockedProps.onClickConfirm).toHaveBeenCalledTimes(1);
    });
});
