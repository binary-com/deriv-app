import React, { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentMethodModal from '../PaymentMethodModal';

const wrapper = ({ children }: PropsWithChildren<unknown>) => <div id='v2_modal_root'>{children}</div>;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('PaymentMethodModal', () => {
    it('should render the component correctly', () => {
        render(
            <PaymentMethodModal
                description='Payment Method Modal Description'
                isModalOpen={true}
                onConfirm={jest.fn()}
                onReject={jest.fn()}
                primaryButtonLabel='Yes'
                secondaryButtonLabel='Yes, remove'
                title='Payment Method Modal'
            />,
            { wrapper }
        );
        expect(screen.getByText('Payment Method Modal')).toBeInTheDocument();
        expect(screen.getByText('Payment Method Modal Description')).toBeInTheDocument();
    });
    it('should handle onclick when the yes, remove button is clicked', () => {
        const onConfirm = jest.fn();
        render(
            <PaymentMethodModal
                description='Payment Method Modal Description'
                isModalOpen={true}
                onConfirm={onConfirm}
                onReject={jest.fn()}
                primaryButtonLabel='Yes'
                secondaryButtonLabel='Yes, remove'
                title='Payment Method Modal'
            />,
            { wrapper }
        );
        const confirmButton = screen.getByText('Yes, remove');
        userEvent.click(confirmButton);
        expect(onConfirm).toHaveBeenCalled();
    });
    it('should handle onclick when the yes button is clicked', () => {
        const onReject = jest.fn();
        render(
            <PaymentMethodModal
                description='Payment Method Modal Description'
                isModalOpen={true}
                onConfirm={jest.fn()}
                onReject={onReject}
                primaryButtonLabel='Yes'
                secondaryButtonLabel='Yes, remove'
                title='Payment Method Modal'
            />,
            { wrapper }
        );
        const rejectButton = screen.getByText('Yes');
        userEvent.click(rejectButton);
        expect(onReject).toHaveBeenCalled();
    });
});
