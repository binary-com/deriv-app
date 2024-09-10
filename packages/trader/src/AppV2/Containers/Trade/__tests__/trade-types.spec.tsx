import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import TradeTypes from '../trade-types';
import TraderProviders from '../../../../trader-providers';
import { getTradeTypesList } from 'AppV2/Utils/trade-types-utils';

jest.mock('AppV2/Utils/trade-types-utils');

jest.mock('AppV2/Components/Guide', () => jest.fn(() => <div>MockedGuide</div>));

const mockGetTradeTypesList = getTradeTypesList as jest.MockedFunction<typeof getTradeTypesList>;

const contract_types_list = {
    rise_fall: {
        name: 'Rise/Fall',
        categories: [
            { text: 'Rise', value: 'rise' },
            { text: 'Fall', value: 'fall' },
        ],
    },
    vanilla: {
        name: 'Vanilla',
        categories: [
            { text: 'Vanilla Call', value: 'vanilla_call' },
            { text: 'Vanilla Put', value: 'vanilla_put' },
        ],
    },
};

const default_mock_store = {
    modules: {
        trade: {
            contract_type: 'rise_fall',
            contract_types_list,
        },
    },
};

const mockTradeTypes = (mocked_store = mockStore(default_mock_store)) => {
    return (
        <TraderProviders store={mocked_store}>
            <TradeTypes
                onTradeTypeSelect={jest.fn()}
                trade_types={mockGetTradeTypesList(default_mock_store.modules.trade.contract_types_list)}
                contract_type='rise_fall'
            />
        </TraderProviders>
    );
};

describe('TradeTypes', () => {
    const originalScrollBy = HTMLElement.prototype.scrollBy;
    const scrollByMock = jest.fn();
    beforeEach(() => {
        mockGetTradeTypesList.mockReturnValue([
            { value: 'accumulator', text: 'Accumulator' },
            { value: 'multipler', text: 'Multiplier' },
            { value: 'rise', text: 'Rise' },
            { value: 'fall', text: 'Fall' },
            { value: 'vanilla_call', text: 'Vanilla Call' },
            { value: 'vanilla_put', text: 'Vanilla Put' },
        ]);
    });
    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
            value: scrollByMock,
        });
    });
    afterAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
            value: originalScrollBy,
        });
    });

    it('should render the TradeTypes component with pinned and other trade types', () => {
        render(mockTradeTypes());

        expect(screen.getByText('View all')).toBeInTheDocument();
        expect(screen.getByText('Rise')).toBeInTheDocument();
    });

    it('should handle adding and removing pinned trade types', async () => {
        render(mockTradeTypes());

        await userEvent.click(screen.getByText('View all'));
        await userEvent.click(screen.getByText('Customize'));
        const addButton = screen.getAllByTestId('dt_trade_type_list_item_right_icon')[0];
        await userEvent.click(addButton);

        const removeButton = screen.getAllByTestId('dt_draggable_list_item_icon')[0];
        await userEvent.click(removeButton);

        expect(screen.getByText('Trade types')).toBeInTheDocument();
    });

    it('should scroll to the selected trade type when tradeList is clicked', async () => {
        render(mockTradeTypes());
        Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
            value: scrollByMock,
        });
        await userEvent.click(screen.getByText('Rise'));
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(scrollByMock).toHaveBeenCalled();
    });
});
