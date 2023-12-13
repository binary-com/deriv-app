import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletsErrorScreen from '../WalletsErrorScreen';

describe('WalletsErrorScreen', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should show the correct title and icon with default message', () => {
        render(<WalletsErrorScreen />);
        expect(screen.getByTestId('dt_error_icon')).toBeInTheDocument();
        expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
        expect(
            screen.getByText('Sorry an error occurred. Please try accessing our cashier page again.')
        ).toBeInTheDocument();
    });

    it('should show the message passed as prop', () => {
        render(<WalletsErrorScreen message='Error message from props' />);
        expect(screen.getByText('Error message from props')).toBeInTheDocument();
    });

    it('should reload the page when Try again button is clicked', () => {
        const reloadMock = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true,
        });
        render(<WalletsErrorScreen />);
        screen.getByText('Try again').click();
        expect(reloadMock).toHaveBeenCalled();
    });
});
