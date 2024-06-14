import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import JournalLoader from '../journal-loader';

jest.mock('react-content-loader', () => {
    return jest.fn(({ children, ...props }: { children: React.ReactElement; is_mobile_or_tablet: boolean }) => (
        <div data-testid='mock-content-loader' {...props}>
            {children}
        </div>
    ));
});

describe('JournalLoader', () => {
    it('Renders correctly for desktop', () => {
        render(<JournalLoader is_mobile_or_tablet={false} />);

        const journal_loader = screen.getByTestId('mock-content-loader');

        expect(journal_loader).toBeInTheDocument();
        expect(journal_loader).not.toHaveClass('journal__loader--mobile');
    });

    it('Renders correctly for mobile with given props', () => {
        render(<JournalLoader is_mobile_or_tablet={true} />);

        const journal_loader = screen.getByTestId('mock-content-loader');

        expect(journal_loader).toBeInTheDocument();

        expect(journal_loader).toHaveClass('journal__loader--mobile');
        expect(journal_loader).toHaveAttribute('backgroundcolor', 'var(--general-section-1)');
        expect(journal_loader).toHaveAttribute('foregroundcolor', 'var(--general-hover)');
    });
});
