import React from 'react';
import { render, screen } from '@testing-library/react';
import BottomNav from '../bottom-nav';
import userEvent from '@testing-library/user-event';

jest.mock('../bottom-nav-item', () => {
    return jest.fn(({ index, setSelectedIndex }) => (
        <button onClick={() => setSelectedIndex(index)}>MockedBottomNavItem</button>
    ));
});

jest.mock('@deriv-com/quill-ui', () => ({
    Badge: jest.fn(() => {
        return 'MockedBadge';
    }),
}));
describe('BottomNav', () => {
    const mockedTradeContainer = <div>MockedTrade</div>;
    const mockedMarketsContainer = <div>MockedMarkets</div>;
    const mockedPositionsContainer = <div>MockedPositions</div>;
    const renderedBottomNav = (
        <BottomNav>
            <div>{mockedTradeContainer}</div>
            <div>{mockedMarketsContainer}</div>
            <div>{mockedPositionsContainer}</div>
        </BottomNav>
    );
    it('should render correctly', () => {
        const { container } = render(renderedBottomNav);
        expect(container).toBeInTheDocument();
    });
    it('should render the correct number of BottomNavItem components', () => {
        render(renderedBottomNav);
        expect(screen.getAllByText(/MockedBottomNavItem/i)).toHaveLength(4);
    });
    it('should render MockedTrade by default since selected index is 0', () => {
        render(renderedBottomNav);
        expect(screen.getByText('MockedTrade')).toBeInTheDocument();
    });
    it('should render MockedPositions if 3rd MockedBottomNavItem is selected', () => {
        render(renderedBottomNav);
        userEvent.click(screen.getAllByText('MockedBottomNavItem')[2]);
        expect(screen.getByText('MockedPositions')).toBeInTheDocument();
    });
});
