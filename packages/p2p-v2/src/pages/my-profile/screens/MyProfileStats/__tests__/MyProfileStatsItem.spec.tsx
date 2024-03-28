import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileStatsItem from '../MyProfileStatsItem';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

const MockApp = () => {
    const [shouldShowLifetime, setShouldShowLifetime] = useState(false);
    return (
        <MyProfileStatsItem
            currency='USD'
            label='Trade volume'
            onClickLifetime={() => setShouldShowLifetime(!shouldShowLifetime)}
            shouldShowDuration
            shouldShowLifetime
            value={shouldShowLifetime ? '150' : '20'}
        />
    );
};

describe('MyProfileStatsItem', () => {
    it('should render correct info', () => {
        render(<MyProfileStatsItem label='Total orders' value='30' />);
        expect(screen.getByText('30')).toBeInTheDocument();
        expect(screen.getByText('Total orders')).toBeInTheDocument();
    });
    it('should render with currency', () => {
        render(<MyProfileStatsItem currency='USD' label='Trade volume' value='20' />);
        expect(screen.getByText('20 USD')).toBeInTheDocument();
        expect(screen.getByText('Trade volume')).toBeInTheDocument();
    });
    it('should render with duration and lifetime', () => {
        render(<MockApp />);

        const daysBtn = screen.getByRole('button', {
            name: '30d',
        });
        expect(daysBtn).toBeInTheDocument();
        const lifetimeBtn = screen.getByRole('button', {
            name: 'lifetime',
        });
        expect(lifetimeBtn).toBeInTheDocument();

        userEvent.click(lifetimeBtn);
        expect(screen.getByText('150 USD')).toBeInTheDocument();
        userEvent.click(daysBtn);
        expect(screen.getByText('20 USD')).toBeInTheDocument();
    });
});
