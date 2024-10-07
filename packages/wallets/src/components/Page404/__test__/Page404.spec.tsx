import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page404 from '../Page404';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

describe('Page404', () => {
    const mockHistoryPush = jest.fn();

    beforeEach(() => {
        (useHistory as jest.Mock).mockReturnValue({ push: mockHistoryPush });
    });

    it('renders error 404 screen content for desktop', () => {
        render(<Page404 />);

        expect(screen.getByText("We couldn't find that page")).toBeInTheDocument();
        expect(
            screen.getByText('You may have followed a broken link, or the page has moved to a new address.')
        ).toBeInTheDocument();
        expect(screen.getByRole('img', { name: '404' })).toHaveAttribute('src', '/public/images/common/404.png');
        expect(screen.getByRole('img', { name: '404' })).toHaveAttribute('width', '607px');
        expect(screen.getByRole('img', { name: '404' })).toHaveAttribute('height', '366px');
        expect(screen.getByRole('button', { name: "Return to Trader's Hub" })).toBeInTheDocument();
    });

    it('renders error 404 screen content for mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<Page404 />);

        expect(screen.getByRole('img', { name: '404' })).toHaveAttribute('width', '328px');
        expect(screen.getByRole('img', { name: '404' })).toHaveAttribute('height', '200px');
    });

    it('navigates to home page when button is clicked', async () => {
        render(<Page404 />);

        const button = screen.getByRole('button', { name: "Return to Trader's Hub" });
        await userEvent.click(button);

        expect(mockHistoryPush).toHaveBeenCalledWith('/');
    });
});
