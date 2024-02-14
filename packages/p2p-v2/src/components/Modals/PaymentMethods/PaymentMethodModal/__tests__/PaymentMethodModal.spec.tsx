import React, { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import PaymentMethodModal from '../PaymentMethodModal';
import userEvent from '@testing-library/user-event';

const wrapper = ({ children }: PropsWithChildren<unknown>) => <div id='v2_modal_root'>{children}</div>;

describe('PaymentMethodModal', () => {
    it('should render the component correctly', () => {
        render(
            <PaymentMethodModal
                description='Payment Method Modal Description'
                isModalOpen={true}
                onConfirm={jest.fn()}
                onReject={jest.fn()}
                primaryButtonLabel='Confirm'
                secondaryButtonLabel='Cancel'
                title='Payment Method Modal'
            />,
            { wrapper }
        );
        expect(screen.getByText('Payment Method Modal')).toBeInTheDocument();
        expect(screen.getByText('Payment Method Modal Description')).toBeInTheDocument();
    });
    it('should handle confirm when the secondary button is clicked', () => {
        const onConfirm = jest.fn();
        render(
            <PaymentMethodModal
                description='Payment Method Modal Description'
                isModalOpen={true}
                onConfirm={onConfirm}
                onReject={jest.fn()}
                primaryButtonLabel='Confirm'
                secondaryButtonLabel='Cancel'
                title='Payment Method Modal'
            />,
            { wrapper }
        );
        const confirmButton = screen.getByText('Cancel');
        userEvent.click(confirmButton);
        expect(onConfirm).toHaveBeenCalled();
    });
    it('should handle reject when the primary button is clicked', () => {
        const onReject = jest.fn();
        render(
            <PaymentMethodModal
                description='Payment Method Modal Description'
                isModalOpen={true}
                onConfirm={jest.fn()}
                onReject={onReject}
                primaryButtonLabel='Confirm'
                secondaryButtonLabel='Cancel'
                title='Payment Method Modal'
            />,
            { wrapper }
        );
        const rejectButton = screen.getByText('Confirm');
        userEvent.click(rejectButton);
        expect(onReject).toHaveBeenCalled();
    });
});
