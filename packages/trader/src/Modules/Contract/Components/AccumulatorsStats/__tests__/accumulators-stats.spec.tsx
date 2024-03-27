import React from 'react';
import { render, screen, within } from '@testing-library/react';
import AccumulatorsStats, { ROW_SIZES } from '../accumulators-stats';
import { TraderProviders } from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv/hooks';

const mock_connect_props = {
    modules: {
        trade: {
            ticks_history_stats: {
                ticks_stayed_in: [
                    1, 65, 1234, 675, 234, 10, 658, 134, 5, 2394, 100, 6, 90, 9, 344, 81, 695, 14, 345, 2222,
                ],
                last_tick_epoch: 1005,
            },
        },
    },
};
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getUrlBase: jest.fn(() => 'video_src.mp4'),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDevice: jest.fn(() => ({ isDesktop: true, isMobile: false })),
}));

describe('AccumulatorsStats', () => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');

    it('should render as expandable', () => {
        render(<AccumulatorsStats />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getByTestId('dt_accordion-toggle-arrow')).toBeInTheDocument();
    });
    it('should render as non-expandable', () => {
        render(<AccumulatorsStats is_expandable={false} />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.queryByTestId('dt_accordion-toggle-arrow')).not.toBeInTheDocument();
    });
    it('should show manual after info icon is clicked', () => {
        render(<AccumulatorsStats />, {
            container: document.body.appendChild(modal_root_el),
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        userEvent.click(screen.getByTestId('dt_ic_info_icon'));
        expect(screen.getByTestId('dt_accumulators_stats_manual_video')).toBeInTheDocument();
    });
    it('should render partial history values (tick counters) when initially collapsed in desktop', () => {
        render(<AccumulatorsStats />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getAllByTestId('dt_accu_stats_history_counter')).toHaveLength(ROW_SIZES.DESKTOP_COLLAPSED);
    });
    it('should render partial history values (tick counters) when initially collapsed in mobile', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false, isMobile: true });
        render(<AccumulatorsStats />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getAllByTestId('dt_accu_stats_history_counter')).toHaveLength(ROW_SIZES.MOBILE_COLLAPSED);
    });

    it('should expand in desktop when accordion_toggle_arrow is clicked', () => {
        render(<AccumulatorsStats />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getAllByTestId('dt_accu_stats_history_counter')).toHaveLength(ROW_SIZES.DESKTOP_COLLAPSED);

        userEvent.click(screen.getByTestId('dt_accordion-toggle-arrow'));
        const row = screen.getAllByTestId('dt_accu_stats_history_row')[0];
        expect(within(row).getAllByTestId('dt_accu_stats_history_counter')).toHaveLength(ROW_SIZES.DESKTOP_EXPANDED);
        expect(screen.getAllByTestId('dt_accu_stats_history_counter')).toHaveLength(20);
    });

    it('should show MobileDialog with full "Stay in history" in mobile when accordion_toggle_arrow is clicked', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false, isMobile: true });
        render(<AccumulatorsStats />, {
            container: document.body.appendChild(modal_root_el),
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getAllByTestId('dt_accu_stats_history_counter')).toHaveLength(ROW_SIZES.MOBILE_COLLAPSED);
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false, isMobile: true });
        userEvent.click(screen.getByTestId('dt_accordion-toggle-arrow'));
        const mobile_dialog = screen.getByTestId('dt_mobile_dialog');
        const row = screen.getAllByTestId('dt_accu_stats_history_row')[0];
        expect(within(row).getAllByTestId('dt_accu_stats_history_counter')).toHaveLength(ROW_SIZES.MOBILE_EXPANDED);
        expect(within(mobile_dialog).getAllByTestId('dt_accu_stats_history_counter')).toHaveLength(20);
    });
});
