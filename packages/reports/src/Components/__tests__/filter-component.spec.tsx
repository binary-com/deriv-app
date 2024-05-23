import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import FilterComponent from 'Components/filter-component';
import React from 'react';
import ReportsProviders from '../../reports-providers';

jest.mock('../Form/CompositeCalendar/composite-calendar', () => jest.fn(() => 'MockedCalender'));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    FilterDropdown: jest.fn(() => <span>MockedFilterDropdown</span>),
}));

describe('<FilterComponent />', () => {
    const mock_store = mockStore({
        modules: {
            statement: {
                action_type: 'buy',
                date_from: 123,
                date_to: 124,
                handleFilterChange: jest.fn(),
                handleDateChange: jest.fn(),
            },
        },
    });
    it('Should render calender and dropdown', () => {
        const mockFilterComponent = (
            <ReportsProviders store={mock_store}>
                <FilterComponent />
            </ReportsProviders>
        );
        render(mockFilterComponent);
        expect(screen.getByText('MockedCalender')).toBeInTheDocument();
        expect(screen.getByText('MockedFilterDropdown')).toBeInTheDocument();
    });
});
