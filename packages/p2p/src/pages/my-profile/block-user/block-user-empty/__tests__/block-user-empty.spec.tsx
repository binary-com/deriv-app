import React from 'react';
import { screen, render } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import { isDesktop, isMobile, isMobileOrTablet } from '@deriv/shared';
import BlockUserEmpty from '..';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true, isTablet: false, isMobile: false })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
    isMobileOrTablet: jest.fn(),
}));

describe('<BlockUserEmpty />', () => {
    it('should render <BlockUserEmpty/> component in desktop view', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(true);
        (isMobile as jest.Mock).mockReturnValueOnce(false);
        (isMobileOrTablet as jest.Mock).mockReturnValueOnce(false);
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true, isTablet: false, isMobile: false });

        render(<BlockUserEmpty />);
        expect(screen.getByTestId('dt_desktop_content')).toBeInTheDocument();
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
    it('should render <BlockUserEmpty /> component in mobile view', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        (isMobileOrTablet as jest.Mock).mockReturnValueOnce(true);
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false, isTablet: false, isMobile: true });

        render(<BlockUserEmpty />);
        expect(screen.queryByTestId('dt_desktop_content')).not.toBeInTheDocument();
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
});
