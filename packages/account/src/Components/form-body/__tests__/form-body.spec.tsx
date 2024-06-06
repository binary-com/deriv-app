import React from 'react';
import { render, screen } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import { isMobile, isMobileOrTablet, isDesktop, isTablet } from '@deriv/shared';
import { FormBody } from '../form-body';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
    isMobileOrTablet: jest.fn(),
    isDesktop: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

describe('<FormBody />', () => {
    it('should render FormBody component with children in desktop', () => {
        (useDevice as jest.Mock).mockReturnValue({
            isDesktop: true,
            isTablet: false,
            isMobile: false,
        });
        (isDesktop as jest.Mock).mockReturnValue(true);
        (isMobile as jest.Mock).mockReturnValue(false);
        (isMobileOrTablet as jest.Mock).mockReturnValue(false);
        render(
            <FormBody scroll_offset='100px'>
                <div>Test children</div>
            </FormBody>
        );

        const div_wrapper_sc = screen.getByTestId('dt_scrollbar_container_div');
        expect(div_wrapper_sc).toBeInTheDocument();
        expect(div_wrapper_sc).toHaveClass('account__scrollbars_container--grid-layout');
        expect(screen.getByText('Test children')).toBeInTheDocument();
        const div_wrapper_ts = screen.getByTestId('dt_themed_scrollbars');
        expect(div_wrapper_ts).toBeInTheDocument();
        expect(div_wrapper_ts).toHaveStyle('max-height: calc(100% - 100px)');
    });

    it('should render FormBody component with children in mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({
            isDesktop: false,
            isTablet: false,
            isMobile: true,
        });
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);
        (isMobileOrTablet as jest.Mock).mockReturnValue(true);
        render(
            <FormBody>
                <div>Test children mobile</div>
            </FormBody>
        );

        expect(screen.queryByTestId('dt_scrollbar_container_div')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_themed_scrollbars')).not.toBeInTheDocument();
        const div_100_vh = screen.getByTestId('dt_div_100_vh');
        expect(div_100_vh).toBeInTheDocument();
        expect(div_100_vh).toHaveClass('account__scrollbars_container--grid-layout');
        expect(screen.getByText('Test children mobile')).toBeInTheDocument();
    });
});
