import React from 'react';
import { render, screen } from '@testing-library/react';
import BottomNavItem from '../bottom-nav-item';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv-com/quill-ui', () => ({
    Text: jest.fn(() => {
        return 'MockedText';
    }),
}));

describe('BottomNavItem', () => {
    const mockProps = {
        icon: <div>Icon</div>,
        selectedIndex: 0,
        label: 'Label',
        setSelectedIndex: jest.fn(),
        index: 0,
    };

    it('should render icon and label', () => {
        render(<BottomNavItem {...mockProps} />);
        expect(screen.getByText('Icon')).toBeInTheDocument();
        expect(screen.getByText('MockedText')).toBeInTheDocument();
    });
    it('should have bottom-nav-item--active class when active', () => {
        render(<BottomNavItem {...mockProps} />);
        expect(screen.getByText('MockedText')).toHaveClass('bottom-nav-item--active');
    });
    it('should have not bottomNav-item--active class when not active', () => {
        render(<BottomNavItem {...mockProps} selectedIndex={1} />);
        expect(screen.getByText('MockedText')).not.toHaveClass('bottom-nav-item--active');
    });
    it('should call setSelectedIndex with index when clicked', () => {
        render(<BottomNavItem {...mockProps} />);
        userEvent.click(screen.getByText('MockedText'));
        expect(mockProps.setSelectedIndex).toHaveBeenCalledWith(0);
    });
});
