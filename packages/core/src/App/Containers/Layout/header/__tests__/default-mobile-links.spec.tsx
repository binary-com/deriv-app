import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DefaultMobileLinks from '../default-mobile-links';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Popover: () => <div>mockedPopover</div>,
    };
});
jest.mock('App/Components/Routes', () => jest.fn(() => 'mockedBinaryLink'));
jest.mock('../show-notifications', () => jest.fn(() => 'mockedShowNotifications'));
jest.mock('../traders-hub-onboarding', () => jest.fn(() => 'mockedTradersHubOnboarding'));

describe('DefaultMobileLinks', () => {
    const mock_props: React.ComponentProps<typeof DefaultMobileLinks> = {
        handleClickCashier: jest.fn(),
    };

    it('should render the component', () => {
        render(<DefaultMobileLinks {...mock_props} />);
        expect(screen.getByText('mockedTradersHubOnboarding')).toBeInTheDocument();
    });

    it('should display the cashier button', () => {
        render(<DefaultMobileLinks {...mock_props} />);
        expect(screen.getByText('Cashier')).toBeInTheDocument();
    });

    it('should fire the "handleClickCashier" event on clicking the button', () => {
        render(<DefaultMobileLinks {...mock_props} />);
        fireEvent.click(screen.getByRole('button', { name: 'Cashier' }));
        expect(mock_props.handleClickCashier).toHaveBeenCalledTimes(1);
    });
});
