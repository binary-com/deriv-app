import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MT5PasswordModalTnc, { type TMT5PasswordModalTncProps } from '../MT5PasswordModalTnc';

jest.mock('@deriv-com/ui', () => ({
    Checkbox: jest.fn(({ checked, label, onChange }) => (
        <div>
            <input checked={checked} data-testid='dt_wallets_tnc_checkbox' onChange={onChange} type='checkbox' />
            <label>{label}</label>
        </div>
    )),
    InlineMessage: jest.fn(({ children }) => <div data-testid='dt_wallets_tnc_inline_message'>{children}</div>),
    Text: jest.fn(({ children }) => <div data-testid='dt_wallets_tnc_text'>{children}</div>),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('../../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(() => ({
        getModalState: jest.fn(() => 'bvi'),
    })),
}));

jest.mock('../../../../../../components/Base/WalletLink', () => ({
    WalletLink: ({ children }: { children: React.ReactNode }) => <a href='https://example.com'>{children}</a>,
}));

const mockOnChange = jest.fn();

describe('MT5PasswordModalTnc', () => {
    const defaultProps: TMT5PasswordModalTncProps = {
        checked: false,
        onChange: mockOnChange,
    };

    it('renders correctly', () => {
        render(<MT5PasswordModalTnc {...defaultProps} />);
        expect(screen.getByTestId('dt_wallets_mt5_tnc_checkbox')).toBeInTheDocument();
    });

    it('displays correct text content', () => {
        render(<MT5PasswordModalTnc {...defaultProps} />);
        expect(screen.getByText("I confirm and accept Deriv (BVI) Ltd's")).toBeInTheDocument();
    });

    it('handles checkbox change', () => {
        render(<MT5PasswordModalTnc {...defaultProps} />);
        const checkbox = screen.getByTestId('dt_wallets_mt5_tnc_checkbox');
        fireEvent.click(checkbox);
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('renders the terms and conditions link', () => {
        render(<MT5PasswordModalTnc {...defaultProps} />);
        const link = screen.getByText('terms and conditions');
        expect(link).toHaveAttribute('href', 'https://example.com');
    });
});
