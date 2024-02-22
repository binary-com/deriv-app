import React from 'react';
import { render, screen } from '@testing-library/react';
import BuySellFormFooter from '../BuySellFormFooter';

const mockProps = {
    isDisabled: false,
    onClickCancel: jest.fn(),
    onSubmit: jest.fn(),
};
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));
describe('BuySellFormFooter', () => {
    it('should render the footer as expected', () => {
        render(<BuySellFormFooter {...mockProps} />);
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });
    it('should handle onclick for cancel button', () => {
        render(<BuySellFormFooter {...mockProps} />);
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        cancelButton.click();
        expect(mockProps.onClickCancel).toHaveBeenCalled();
    });
    it('should handle onclick for confirm button', () => {
        render(<BuySellFormFooter {...mockProps} />);
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        confirmButton.click();
        expect(mockProps.onSubmit).toHaveBeenCalled();
    });
});
