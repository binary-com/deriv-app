import React from 'react';
import { render, screen } from '@testing-library/react';
import { isMobileOrTablet } from '@deriv/shared';
import { ScrollbarsContainer } from '../scrollbars-container';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobileOrTablet: jest.fn(() => false),
}));

describe('<ScrollbarsContainer />', () => {
    it('should render children with ScrollbarsContainer component for desktop without scroll_offset for desktop ', () => {
        render(
            <ScrollbarsContainer>
                <div>Test children</div>
            </ScrollbarsContainer>
        );

        const el_child_div = screen.getByText('Test children');

        expect(el_child_div).toBeInTheDocument();
        expect(screen.getByTestId('dt_themed_scrollbars')).toHaveStyle('max-height: 100%');
    });

    it('should render children with ScrollbarsContainer component for desktop with scroll_offset and extra className for desktop ', () => {
        render(
            <ScrollbarsContainer scroll_offset='33%' className='test__class-name'>
                <div>Test children</div>
            </ScrollbarsContainer>
        );

        const el_child_div = screen.getByText('Test children');

        expect(el_child_div).toBeInTheDocument();
        expect(screen.getByTestId('dt_themed_scrollbars')).toHaveStyle('max-height: calc(100% - 33%)');
    });

    it('should render children with ScrollbarsContainer component with scroll_offset and extra className for mobile', () => {
        (isMobileOrTablet as jest.Mock).mockReturnValue(true);

        render(
            <ScrollbarsContainer scroll_offset='33%' className='test__class-name'>
                <div>Test children</div>
            </ScrollbarsContainer>
        );

        const el_child_div = screen.getByText('Test children');

        expect(el_child_div).toBeInTheDocument();
        expect(screen.queryByTestId('dt_themed_scrollbars')).not.toBeInTheDocument();
    });
});
