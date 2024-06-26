import React from 'react';
import { screen, render } from '@testing-library/react';
import AccountLimitsExtraInfo from '../account-limits-extra-info';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

describe('<AccountLimitsExtraInfo/>', () => {
    it('should render AccountLimitsExtraInfo component', () => {
        render(<AccountLimitsExtraInfo message='Lorem ipsum' />);
        expect(screen.getByText(/lorem ipsum/i)).toBeInTheDocument();
    });

    it('should render PopoverComponent if its not a desktop screen', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: true });
        render(<AccountLimitsExtraInfo message='Lorem ipsum' />);
        expect(screen.queryByTestId('dt_acc_limits_popover')).toHaveClass('da-account-limits__popover');
    });

    it('should pass props to PopoverComponent if its not a desktop screen', async () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: true });
        render(<AccountLimitsExtraInfo message='Lorem ipsum' className='test_class' />);
        const popover = await screen.findByTestId('dt_acc_limits_popover');
        expect(popover).toHaveClass('test_class');
    });
});
