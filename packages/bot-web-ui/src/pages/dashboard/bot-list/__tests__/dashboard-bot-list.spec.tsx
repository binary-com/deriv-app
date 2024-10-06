import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import DashboardBotList from '../dashboard-bot-list';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const dashboard_strategy = {
    name: '',
    xml: '',
    save_type: '',
    timestamp: 1,
};

const dashboard_strategies = [
    { ...dashboard_strategy, name: 'Strategy1', id: '1' },
    { ...dashboard_strategy, name: 'Strategy2', id: '2' },
];

describe('DashboardBotList', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_mobile: true,
            },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        mock_DBot_store?.load_modal.setDashboardStrategies(dashboard_strategies);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('Should display the list of strategies', () => {
        render(<DashboardBotList />, { wrapper });

        const recent_сomponent = screen.getByText('Your bots:');
        const strategy_one = screen.getByText('Strategy1');
        const strategy_two = screen.getByText('Strategy2');

        expect(recent_сomponent).toBeInTheDocument();
        expect(strategy_one).toBeInTheDocument();
        expect(strategy_two).toBeInTheDocument();
    });

    it('Should display text size equal to "xs" when using the mobile version', () => {
        render(<DashboardBotList />, { wrapper });

        const load_strategy_label = screen.getByText('Your bots:');

        expect(load_strategy_label).toBeInTheDocument();
        expect(load_strategy_label).toHaveStyle('--text-size: var(--text-size-xs)');
    });

    it('Should not display anything if the list of strategies is empty', () => {
        mock_DBot_store?.load_modal.setDashboardStrategies([]);

        render(<DashboardBotList />, { wrapper });

        const recent_component = screen.queryByText('Your bots:');
        expect(recent_component).not.toBeInTheDocument();
    });
});
