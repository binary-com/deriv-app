import React from 'react';
import { render, screen } from '@testing-library/react';
import { isMobileOrTablet } from '@deriv/shared';
import Badge from '../badge';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobileOrTablet: jest.fn(),
}));

describe('Badge component', () => {
    beforeEach(() => {
        (isMobileOrTablet as jest.Mock).mockReturnValue(true);
    });

    afterEach(() => {
        (isMobileOrTablet as jest.Mock).mockReset();
    });

    it('Should render properly with default values and label', () => {
        render(<Badge label='Badge' type='bordered' />);
        expect(screen.getByText('Badge')).toBeInTheDocument();
    });

    it('Should render proper medium badge in mobile view', () => {
        render(<Badge label='Badge' type='bordered' size='medium' />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveStyle('height: 1.2rem');
        expect(badge).toHaveStyle('padding-inline: 0.4rem');
    });

    it('Should render proper medium badge in desktop view', () => {
        (isMobileOrTablet as jest.Mock).mockReturnValue(false);

        render(<Badge label='Badge' type='bordered' size='medium' />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveStyle('height: 1.4rem');
        expect(badge).toHaveStyle('padding-inline: 0.4rem');
    });

    it('Should render proper large badge in mobile view', () => {
        render(<Badge label='Badge' type='bordered' size='large' />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveStyle('height: 1.6rem');
        expect(badge).toHaveStyle('padding-inline: 0.8rem');
    });

    it('Should render proper large badge in desktop view', () => {
        (isMobileOrTablet as jest.Mock).mockReturnValue(false);

        render(<Badge label='Badge' type='bordered' size='large' />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveStyle('height: 2.2rem');
        expect(badge).toHaveStyle('padding-inline: 0.8rem');
    });

    it('Should render badge with normal font weight', () => {
        render(<Badge label='Badge' type='bordered' weight='normal' />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveStyle('--text-weight: var(--text-weight-normal)');
    });

    it('Should render badge with normal font weight', () => {
        render(<Badge label='Badge' type='bordered' weight='bold' />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveStyle('--text-weight: var(--text-weight-bold)');
    });

    it('Should render badge with proper font-size in mobile view', () => {
        render(<Badge label='Badge' type='bordered' />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveStyle('--text-size: var(--text-size-xxxxs)');
    });

    it('Should render badge with proper font-size in desktop view', () => {
        (isMobileOrTablet as jest.Mock).mockReturnValue(false);

        render(<Badge label='Badge' type='bordered' />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveStyle('--text-size: var(--text-size-xxxs)');
    });

    it('Should render badge with proper amount of rounded corners', () => {
        render(<Badge label='Badge' type='bordered' rounded_corners={2} />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveClass('dc-badge--two-rounded');
    });

    it('Should render badge with bordered type', () => {
        render(<Badge label='Badge' type='bordered' />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveClass('dc-badge--bordered');
    });

    it('Should render badge with contained type', () => {
        render(<Badge label='Badge' type='contained' background_color='blue' />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveClass('dc-badge--contained');
    });

    it('Should render badge with contained type and red background', () => {
        render(<Badge label='Badge' type='contained' background_color='red' />);
        const badge = screen.getByText('Badge');
        expect(badge).toHaveClass('dc-badge--contained dc-badge--red');
        expect(badge).toHaveClass('dc-badge--contained dc-badge--red');
    });
});
