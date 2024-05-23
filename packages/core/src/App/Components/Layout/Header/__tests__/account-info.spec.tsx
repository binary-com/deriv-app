import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountInfo from '../account-info.jsx';

describe('AccountInfo component', () => {
    it('should show "disabled_message" when "is_disabled" property is "true"', () => {
        render(<AccountInfo is_disabled acc_switcher_disabled_message='Test disabled message' />);
        const popover = screen.getByTestId('dt_popover_wrapper');
        userEvent.hover(popover);
        const disabled_message = screen.getByText(/test disabled message/i);
        expect(disabled_message).toBeInTheDocument();
    });

    it('should have "acc-info--is-disabled" class when "is_disabled" property is "true"', () => {
        render(<AccountInfo is_disabled />);
        const div_element = screen.getByTestId('dt_acc_info');
        expect(div_element).toHaveClass('acc-info--is-disabled');
    });

    it('should have "acc-info--is-virtual" class when "is_virtual" property is "true"', () => {
        render(<AccountInfo is_virtual />);
        const div_element = screen.getByTestId('dt_acc_info');
        expect(div_element).toHaveClass('acc-info--is-virtual');
    });

    it('should not have "acc-info--show" class when "is_dialog_on" property is "false"', () => {
        render(<AccountInfo />);
        const div_element = screen.getByTestId('dt_acc_info');
        expect(div_element).not.toHaveClass('acc-info--show');
    });

    it('can not "toggleDialog" when "is_disabled" property is "true"', () => {
        const toggleDialog = jest.fn();
        render(<AccountInfo is_disabled toggleDialog={toggleDialog} />);
        const div_element = screen.getByTestId('dt_acc_info');
        userEvent.click(div_element);
        expect(toggleDialog).toHaveBeenCalledTimes(0);
    });

    it('should render "AccountInfoIcon" with the proper className', () => {
        const { rerender } = render(<AccountInfo currency='USD' />);
        expect(screen.getByTestId('dt_icon')).toHaveClass('acc-info__id-icon--usd');

        rerender(<AccountInfo is_virtual />);
        expect(screen.getByTestId('dt_icon')).toHaveClass('acc-info__id-icon--virtual');
    });

    it('should render "IcLock" icon when "is_disabled" property is "true"', () => {
        render(<AccountInfo is_disabled />);
        const icon = screen.getByTestId('dt_lock_icon');
        expect(icon).toBeInTheDocument();
    });

    it('should render "IcChevronDownBold" icon when "is_disabled" property is "false"', () => {
        render(<AccountInfo />);
        const icon = screen.getByTestId('dt_select_arrow');
        expect(icon).toBeInTheDocument();
    });

    it('should not render balance section when "currency" property passed', () => {
        render(<AccountInfo currency='USD' />);
        const balance_wrapper = screen.queryByTestId('dt_balance');
        expect(balance_wrapper).not.toBeInTheDocument();
    });

    it('should have "acc-info__balance--no-currency" class when "is_virtual" property is "false" and we don\'t have "currency" property', () => {
        render(<AccountInfo />);
        const balance_wrapper = screen.getByTestId('dt_balance');
        expect(balance_wrapper).toHaveClass('acc-info__balance--no-currency');
    });

    it('should have "No currency assigned" text when we don\'t have "currency" property', () => {
        render(<AccountInfo />);
        const text = screen.getByText(/no currency assigned/i);
        expect(text).toBeInTheDocument();
    });

    it('should have "123456789 USD" text when we have "currency" and "balance" properties', () => {
        render(<AccountInfo currency='USD' balance='123456789' />);
        const text = screen.getByText(/123456789 usd/i);
        expect(text).toBeInTheDocument();
        expect(screen.queryByText(/no currency assigned/i)).not.toBeInTheDocument();
    });
});
