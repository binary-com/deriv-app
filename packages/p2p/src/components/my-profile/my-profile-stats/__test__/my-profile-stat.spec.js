import React from 'react';
import { isMobile } from '@deriv/shared';
import { fireEvent, render, screen } from '@testing-library/react';
import MyStats from '../my-profile-stats.jsx';
import MyProfileSeparatorContainer from '../../my-profile-separator-container';

const mockFn = jest.fn();
jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        my_profile_store: {
            setActiveTab: jest.fn(() => mockFn()),
        },
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

MyProfileSeparatorContainer.Line = jest.fn(() => <div>Profile Seperator</div>);

jest.mock('Components/my-profile/my-profile-stats/my-profile-balance/my-profile-balance.jsx', () =>
    jest.fn(() => <div>Profile Balance</div>)
);

jest.mock('Components/my-profile/my-profile-stats/my-profile-privacy/my-profile-privacy.jsx', () =>
    jest.fn(() => <div>Profile Privacy</div>)
);
jest.mock('Components/my-profile/my-profile-stats/my-profile-name/my-profile-name.jsx', () =>
    jest.fn(() => <div>Profile Name</div>)
);
jest.mock('Components/my-profile/my-profile-stats/my-profile-stats-table/my-profile-stats-table.jsx', () =>
    jest.fn(() => <div>Profile Stats Table</div>)
);

describe('<MyStats/>', () => {
    it('should render Name, Balance, StatsTable, Privacy, ProfileSeperator sections on load', () => {
        render(<MyStats />);

        expect(screen.getByText('Profile Balance')).toBeInTheDocument();
        expect(screen.getByText('Profile Privacy')).toBeInTheDocument();
        expect(screen.getByText('Profile Name')).toBeInTheDocument();
        expect(screen.getByText('Profile Stats Table')).toBeInTheDocument();
        expect(screen.getByText('Profile Seperator')).toBeInTheDocument();
    });

    it('should render a mobile layout for mobile screen', () => {
        isMobile.mockImplementation(() => true);
        render(<MyStats />);

        expect(screen.getAllByText('Profile Seperator').length).toBeGreaterThan(2);
    });

    it('should invoke setActiveTab when tabs are clicked', () => {
        render(<MyStats />);
        fireEvent.click(screen.getByText('Ad template'));
        fireEvent.click(screen.getByText('Payment methods'));

        expect(mockFn).toHaveBeenCalledTimes(2);
    });
});
