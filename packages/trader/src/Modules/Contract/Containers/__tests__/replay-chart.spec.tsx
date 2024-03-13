import React from 'react';
import { render, screen } from '@testing-library/react';
import ReplayChart from '../replay-chart';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';

jest.mock('Modules/SmartChart', () => ({
    SmartChart: () => <div data-testid='mock-chart'>Mocked Chart</div>,
}));

describe('<ReplayChart>', () => {
    const props = {
        is_dark_theme_prop: true,
        is_accumulator_contract: true,
        is_reset_contract: false,
    };

    const store = mockStore({
        contract_replay: {
            has_error: false,
        },
    });

    it('renders SmartChart component with correct props', () => {
        render(
            <TraderProviders store={store}>
                <ReplayChart {...props} />
            </TraderProviders>
        );

        const mockChartElement = screen.getByTestId('mock-chart');
        expect(mockChartElement).toBeInTheDocument();
        expect(screen.getByText('Mocked Chart')).toBeInTheDocument();
    });
});
