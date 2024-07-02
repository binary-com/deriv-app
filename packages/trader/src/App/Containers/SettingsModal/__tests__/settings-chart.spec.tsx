import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import ChartSettings from '../settings-chart';

jest.mock('Assets/SvgComponents/settings/interval-disabled.svg', () =>
    jest.fn(() => <div>IntervalDurationDisabledLightIcon</div>)
);
jest.mock('Assets/SvgComponents/settings/interval-enabled.svg', () =>
    jest.fn(() => <div>IntervalDurationEnabledLightIcon</div>)
);
jest.mock('Assets/SvgComponents/settings/dark/interval-disabled.svg', () =>
    jest.fn(() => <div>IntervalDurationDisabledDarkIcon</div>)
);
jest.mock('Assets/SvgComponents/settings/dark/interval-enabled.svg', () =>
    jest.fn(() => <div>IntervalDurationEnabledDarkIcon</div>)
);

describe('<ChartSettings/>', () => {
    let default_mock_store: ReturnType<typeof mockStore>;
    beforeEach(() => {
        default_mock_store = mockStore({
            contract_trade: {
                granularity: 60,
            },
        });
    });

    const mockChartSettings = () => {
        return (
            <StoreProvider store={default_mock_store}>
                <ChartSettings />
            </StoreProvider>
        );
    };

    it('should render component with media heading and checkbox with label', () => {
        render(mockChartSettings());

        expect(screen.getByText('Interval duration')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(screen.getByText('Display remaining time for each interval')).toBeInTheDocument();
    });
    it('should call setChartCountdown function if user checked checkbox', () => {
        render(mockChartSettings());

        userEvent.click(screen.getByRole('checkbox'));

        expect(default_mock_store.ui.setChartCountdown).toBeCalled();
    });
    it('should display Unavailable message and disable checkbox if chart granularity === 0 (1 Tick interval)', () => {
        default_mock_store.contract_trade.granularity = 0;
        render(mockChartSettings());

        expect(screen.getByText(/This feature is unavailable for tick intervals/)).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeDisabled();
    });
});
