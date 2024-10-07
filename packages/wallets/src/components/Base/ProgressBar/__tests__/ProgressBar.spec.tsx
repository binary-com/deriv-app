import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
    const mockProps: React.ComponentProps<typeof ProgressBar> = {
        activeIndex: 0,
        count: 3,
        onClick: jest.fn(),
    };

    it('should render properly with list of indexes', () => {
        render(<ProgressBar {...mockProps} />);
        const items = screen.getByRole('progressbar').childNodes;
        expect(items).toHaveLength(3);
    });

    it('should render the active item correctly', () => {
        render(<ProgressBar {...mockProps} />);
        const items = screen.getByRole('progressbar').childNodes;
        expect(items[0]).toHaveClass('wallets-progress-bar-active');
        items.forEach((element, index) => {
            if (index !== 0) {
                expect(element).toHaveClass('wallets-progress-bar-inactive');
            }
        });
    });

    it('should set the active index on Click', async () => {
        render(<ProgressBar {...mockProps} />);
        const items = screen.getByRole('progressbar').childNodes;
        await userEvent.click(items[2] as HTMLElement);
        expect(mockProps.onClick).toHaveBeenCalledWith(2);
    });
});
