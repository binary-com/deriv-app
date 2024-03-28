import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TradeTypeTabs from '../trade-type-tabs';
import { mockStore } from '@deriv/stores';
import { TRADE_TYPES } from '@deriv/shared';
import TraderProviders from '../../../../../../trader-providers';

describe('Trade Type Tabs', () => {
    const mock_root_store = {
        modules: {
            trade: {
                contract_type: TRADE_TYPES.TURBOS.LONG,
                onChange: jest.fn(() => {
                    if (mock_root_store.modules) {
                        mock_root_store.modules.trade.contract_type = TRADE_TYPES.TURBOS.SHORT;
                    }
                }),
            },
        },
    };
    const mockTradeTypeTabs = (mocked_store: typeof mock_root_store) => {
        return (
            <TraderProviders store={mockStore(mocked_store)}>
                <TradeTypeTabs />
            </TraderProviders>
        );
    };
    it('should render Up & Down tabs when contract_type = TRADE_TYPES.TURBOS.LONG', () => {
        render(mockTradeTypeTabs(mock_root_store));
        const up_tab = screen.getByText('Up');
        const down_tab = screen.getByText('Down');
        [up_tab, down_tab].forEach(tab => {
            expect(tab).toBeInTheDocument();
        });
    });

    it('should render Call & Put tabs when contract_type = TRADE_TYPES.VANILLA.CALL', () => {
        if (mock_root_store.modules) {
            mock_root_store.modules.trade.contract_type = TRADE_TYPES.VANILLA.CALL;
        }
        render(mockTradeTypeTabs(mock_root_store));
        const call_tab = screen.getByText('Call');
        const put_tab = screen.getByText('Put');
        [call_tab, put_tab].forEach(tab => {
            expect(tab).toBeInTheDocument();
        });
    });

    it('should not render if contract_type is other than turbos or vanillas', () => {
        if (mock_root_store.modules) {
            mock_root_store.modules.trade.contract_type = 'invalid_type';
        }
        render(mockTradeTypeTabs(mock_root_store));
        const up_tab = screen.queryByText('Up');
        const down_tab = screen.queryByText('Down');
        [up_tab, down_tab].forEach(tab => {
            expect(tab).not.toBeInTheDocument();
        });
    });

    it('should call onChange when a tab is clicked', () => {
        if (mock_root_store.modules) {
            mock_root_store.modules.trade.contract_type = TRADE_TYPES.TURBOS.LONG;
        }
        render(mockTradeTypeTabs(mock_root_store));

        const down_tab = screen.getByText('Down');
        userEvent.click(down_tab);

        expect(mock_root_store.modules?.trade.contract_type).toBe(TRADE_TYPES.TURBOS.SHORT);
    });
});
