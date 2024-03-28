import React from 'react';
import { useQueryString } from '@/hooks';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentMethodsEmpty from '../PaymentMethodsEmpty';

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useQueryString: jest.fn().mockReturnValue({ setQueryString: jest.fn() }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: false, isMobile: false, isTablet: false }),
}));

const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;
const mockUseQueryString = useQueryString as jest.MockedFunction<typeof useQueryString>;

describe('PaymentMethodsEmpty', () => {
    it('should render the component correctly', () => {
        const onAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />);
        expect(screen.getByText('You haven’t added any payment methods yet')).toBeInTheDocument();
        expect(screen.getByText('Hit the button below to add payment methods.')).toBeInTheDocument();
        expect(screen.getByText('Add payment methods')).toBeInTheDocument();
    });
    it('should call onAddPaymentMethods when isMobile is false', () => {
        const mockOnAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={mockOnAddPaymentMethod} />);
        const button = screen.getByRole('button', { name: 'Add payment methods' });
        userEvent.click(button);
        expect(mockOnAddPaymentMethod).toHaveBeenCalled();
    });
    it('should call onAddPaymentMethods when isMobile is true', () => {
        mockUseDevice.mockReturnValueOnce({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        const onAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />);
        const button = screen.getByRole('button', { name: 'Add payment methods' });
        userEvent.click(button);
        expect(onAddPaymentMethod).toHaveBeenCalled();
    });
    it('should render the correct content when isMobile is false', () => {
        const mockOnAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={mockOnAddPaymentMethod} />);
        expect(screen.getByText('You haven’t added any payment methods yet')).toBeInTheDocument();
        expect(screen.getByText('Hit the button below to add payment methods.')).toBeInTheDocument();
        expect(screen.getByText('Add payment methods')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_p2p_v2_mobile_wrapper_button')).not.toBeInTheDocument();
    });
    it('should render the correct content when isMobile is true', () => {
        mockUseDevice.mockReturnValueOnce({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        const onAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />);
        expect(screen.getByText('You haven’t added any payment methods yet')).toBeInTheDocument();
        expect(screen.getByText('Hit the button below to add payment methods.')).toBeInTheDocument();
        expect(screen.getByText('Add payment methods')).toBeInTheDocument();
        expect(screen.getByTestId('dt_p2p_v2_mobile_wrapper_button')).toBeInTheDocument();
    });
    it('should call setQueryString when isMobile is true', () => {
        const { setQueryString: mockSetQueryString } = mockUseQueryString();
        mockUseDevice.mockReturnValueOnce({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        const onAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />);
        const back = screen.getByTestId('dt_p2p_v2_mobile_wrapper_button');
        userEvent.click(back);
        expect(mockSetQueryString).toHaveBeenCalledWith({ tab: 'default' });
    });
});
