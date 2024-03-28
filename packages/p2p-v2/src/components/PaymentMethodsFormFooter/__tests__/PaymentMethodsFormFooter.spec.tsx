import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentMethodsFormFooter from '../PaymentMethodsFormFooter';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('PaymentMethodsFormFooter', () => {
    it('should render the PaymentMethodsFormFooter component correctly', () => {
        render(
            <PaymentMethodsFormFooter
                actionType='ADD'
                handleGoBack={() => undefined}
                isDirty={false}
                isSubmitting={false}
                isValid={false}
            />
        );
        expect(screen.getByRole('payment-methods-form-footer')).toBeInTheDocument();
    });
    it('should render the correct button text when action type is edit', () => {
        render(
            <PaymentMethodsFormFooter
                actionType='EDIT'
                handleGoBack={() => undefined}
                isDirty={false}
                isSubmitting={false}
                isValid={false}
            />
        );
        expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
    });
    it('should render the correct button text when action type is add', () => {
        render(
            <PaymentMethodsFormFooter
                actionType='ADD'
                handleGoBack={() => undefined}
                isDirty={false}
                isSubmitting={false}
                isValid={false}
            />
        );
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });
    it('should render a disabled button if the form is not dirty', () => {
        render(
            <PaymentMethodsFormFooter
                actionType='ADD'
                handleGoBack={() => undefined}
                isDirty={false}
                isSubmitting={false}
                isValid={false}
            />
        );
        expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
    });
    it('should render an enabled button when the form is dirty', () => {
        render(
            <PaymentMethodsFormFooter
                actionType='ADD'
                handleGoBack={() => undefined}
                isDirty={true}
                isSubmitting={false}
                isValid={true}
            />
        );
        expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();
    });
    it('should handle onclick for the cancel button', () => {
        const handleGoBack = jest.fn();
        render(
            <PaymentMethodsFormFooter
                actionType='ADD'
                handleGoBack={handleGoBack}
                isDirty={false}
                isSubmitting={false}
                isValid={false}
            />
        );
        const button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(button);
        expect(handleGoBack).toHaveBeenCalled();
    });
});
