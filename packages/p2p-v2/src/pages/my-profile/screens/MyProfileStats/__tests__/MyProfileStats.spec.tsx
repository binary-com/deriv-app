import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileStats from '../MyProfileStats';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

let mockUseAdvertiserStats = {
    data: {
        averagePayTime: 1,
        averageReleaseTime: 2,
        buyCompletionRate: 3,
        buyOrdersCount: 4,
        sellCompletionRate: 4.2,
        sellOrdersCount: 5,
        totalOrders: 28,
        totalOrdersLifetime: 169,
        tradePartners: 2,
        tradeVolume: 40,
        tradeVolumeLifetime: 150,
    },
    isLoading: true,
};
const mockUseActiveAccount = {
    data: {
        currency: 'USD',
    },
    isLoading: false,
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserStats),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveAccount: jest.fn(() => mockUseActiveAccount),
}));

describe('MyProfileStats', () => {
    it('should render loader when data is not available', () => {
        render(<MyProfileStats />, { wrapper });
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
        mockUseAdvertiserStats.isLoading = false;
    });
    it('should render the correct stats', () => {
        render(<MyProfileStats />, { wrapper });
        const buyCompletionNode = screen.getByTestId('dt_p2p_v2_profile_stats_buy_completion');
        expect(within(buyCompletionNode).getByText('3% (4)')).toBeInTheDocument();
        const sellCompletionNode = screen.getByTestId('dt_p2p_v2_profile_stats_sell_completion');
        expect(within(sellCompletionNode).getByText('4.2% (5)')).toBeInTheDocument();
        const avgPayTimeNode = screen.getByTestId('dt_p2p_v2_profile_stats_avg_pay_time');
        expect(within(avgPayTimeNode).getByText('< 1 min')).toBeInTheDocument();
        const avgReleaseTimeNode = screen.getByTestId('dt_p2p_v2_profile_stats_avg_release_time');
        expect(within(avgReleaseTimeNode).getByText('2 min')).toBeInTheDocument();
        const tradePartnersNode = screen.getByTestId('dt_p2p_v2_profile_stats_trade_partners');
        expect(within(tradePartnersNode).getByText('2')).toBeInTheDocument();

        // test 30d and lifetime button toggles
        const tradeVolumeNode = screen.getByTestId('dt_p2p_v2_profile_stats_trade_volume');
        expect(within(tradeVolumeNode).getByText('40.00 USD')).toBeInTheDocument();
        const tradeVolumeLifetimeBtn = within(tradeVolumeNode).getByRole('button', {
            name: 'lifetime',
        });
        userEvent.click(tradeVolumeLifetimeBtn);
        expect(within(tradeVolumeNode).getByText('150.00 USD')).toBeInTheDocument();

        const totalOrdersNode = screen.getByTestId('dt_p2p_v2_profile_stats_total_orders');
        expect(within(totalOrdersNode).getByText('28')).toBeInTheDocument();
        const totalOrdersLifetimeBtn = within(totalOrdersNode).getByRole('button', {
            name: 'lifetime',
        });
        userEvent.click(totalOrdersLifetimeBtn);
        expect(within(totalOrdersNode).getByText('169')).toBeInTheDocument();
    });

    it('should render the correct default values', () => {
        mockUseAdvertiserStats = {
            // @ts-expect-error Assert some properties to be missing to mock default values
            data: {
                averagePayTime: -1,
                averageReleaseTime: -1,
                totalOrders: 28,
                totalOrdersLifetime: 169,
                tradePartners: 2,
                tradeVolume: 40,
                tradeVolumeLifetime: 150,
            },
            isLoading: false,
        };

        render(<MyProfileStats />, { wrapper });
        const buyCompletionNode = screen.getByTestId('dt_p2p_v2_profile_stats_buy_completion');
        expect(within(buyCompletionNode).getByText('-')).toBeInTheDocument();
        const sellCompletionNode = screen.getByTestId('dt_p2p_v2_profile_stats_sell_completion');
        expect(within(sellCompletionNode).getByText('-')).toBeInTheDocument();
        const avgPayTimeNode = screen.getByTestId('dt_p2p_v2_profile_stats_avg_pay_time');
        expect(within(avgPayTimeNode).getByText('-')).toBeInTheDocument();
        const avgReleaseTimeNode = screen.getByTestId('dt_p2p_v2_profile_stats_avg_release_time');
        expect(within(avgReleaseTimeNode).getByText('-')).toBeInTheDocument();
    });
});
