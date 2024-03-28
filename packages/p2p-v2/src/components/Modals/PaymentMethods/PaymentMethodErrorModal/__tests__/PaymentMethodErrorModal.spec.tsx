import React, { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import PaymentMethodErrorModal from '../PaymentMethodErrorModal';

const wrapper = ({ children }: PropsWithChildren<unknown>) => <div id='v2_modal_root'>{children}</div>;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('PaymentMethodErrorModal', () => {
    it('should render the modal correctly', () => {
        const props = {
            errorMessage: 'error message',
            isModalOpen: true,
            onConfirm: jest.fn(),
            title: 'title',
        };
        render(<PaymentMethodErrorModal {...props} />, { wrapper });
        expect(screen.getByText('title')).toBeInTheDocument();
        expect(screen.getByText('error message')).toBeInTheDocument();
    });
});
