import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QuickStrategyForm from '../form';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    ApiHelpers: {
        instance: {
            contracts_for: {
                getDurations: jest.fn(),
                getMarketBySymbol: jest.fn(),
                getSubmarketBySymbol: jest.fn(),
                getTradeTypeCategoryByTradeType: jest.fn(),
                getTradeTypesForQuickStrategy: () => [
                    {
                        text: 'Rise/Fall',
                        value: 'callput',
                        group: 'Up/Down',
                        icon: ['CALL', 'PUT'],
                    },
                    {
                        text: 'Rise Equals/Fall Equals',
                        value: 'callputequal',
                        group: 'Up/Down',
                        icon: ['CALLE', 'PUTE'],
                    },
                ],
            },
            active_symbols: {
                getSymbolsForBot: () => [
                    {
                        text: 'AUD Basket',
                        value: 'WLDAUD',
                        group: 'Forex Basket',
                    },
                    {
                        text: 'Bear Market Index',
                        value: 'RDBULL',
                        group: 'Daily Reset Indices',
                    },
                ],
            },
        },
    },
}));

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
};

jest.mock('../config', () => ({
    STRATEGIES: {
        RSI: {
            name: 'RSI',
            label: 'RSI',
            description: 'test',
            fields: [
                [
                    {
                        type: 'symbol',
                        name: 'symbol',
                    },
                    {
                        type: 'tradetype',
                        name: 'tradetype',
                        dependencies: ['symbol'],
                    },
                    {
                        type: 'durationtype',
                        name: 'durationtype',
                        dependencies: ['symbol', 'tradetype'],
                        attached: true,
                    },
                    {
                        type: 'label',
                        label: 'Size',
                        description: null,
                    },
                    {
                        type: 'number',
                        name: 'size',
                        validation: ['number', 'floor', 'min'],
                        should_have: [{ key: 'tradetype', value: '', multiple: ['matchesdiffers', 'overunder'] }],
                    },
                    {
                        type: 'number',
                        name: 'size',
                        validation: ['number', 'floor', 'min'],
                        should_have: [{ key: 'boolean_max_stake', value: true }, 123],
                    },
                    {
                        type: '',
                        name: 'size',
                        validation: ['number', 'floor', 'min'],
                    },
                    {
                        type: 'label',
                        label: null,
                        validation: ['number', 'floor', 'min'],
                    },
                    {
                        type: 'number',
                        name: null,
                        validation: ['number', 'floor', 'min'],
                        should_have: [{ key: 'boolean_max_stake', value: true }],
                    },
                    {
                        type: 'label',
                        label: 'Duration',
                        description: 'The trade length of your purchased contract.',
                        hide: ['desktop'],
                    },
                    {
                        type: 'number',
                        name: 'stake',
                        hide_without_should_have: true,
                    },
                    {
                        type: 'number',
                        name: 'max_stake',
                        validation: ['number', 'required', 'ceil', 'min'],
                        should_have: [{ key: 'boolean_max_stake', value: true }],
                        hide_without_should_have: true,
                        attached: true,
                        has_currency_unit: true,
                    },
                    {
                        type: 'label',
                        name: 'label_last_digit_prediction',
                        label: 'Last Digit Prediction',
                        description: 'Your prediction of the last digit of the asset price.',
                        hide_without_should_have: true,
                        should_have: [
                            {
                                key: 'tradetype',
                                value: '',
                            },
                        ],
                    },
                    {
                        type: 'number',
                        name: 'last_digit_prediction',
                        validation: ['number', 'required', 'min', 'max', 'integer'],
                        should_have: [
                            {
                                key: 'tradetype',
                                value: '',
                            },
                        ],
                    },
                    {
                        type: 'contract_type',
                        name: 'type',
                        dependencies: ['symbol', 'tradetype'],
                    },
                    {
                        type: 'checkbox',
                        name: 'boolean_max_stake',
                        label: 'Max stake',
                        description:
                            'The stake for your next trade will reset to the initial stake if it exceeds this value.',
                        attached: true,
                    },
                    {
                        type: 'number',
                        name: 'duration',
                        attached: true,
                        validation: ['number', 'required', 'min', 'max'],
                    },
                ],
                [],
            ],
        },
    },
}));

describe('<QuickStrategyForm />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({
        ui: {
            is_mobile_or_tablet: false,
        },
    });

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        mock_DBot_store?.quick_strategy?.setSelectedStrategy('RSI');
        const mock_onSubmit = jest.fn();
        const initial_value = {
            tradetype: 'callput',
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik initialValues={initial_value} onSubmit={mock_onSubmit}>
                        {children}
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render TradeType', () => {
        const { container } = render(<QuickStrategyForm key={1} />, {
            wrapper,
        });

        expect(container).toBeInTheDocument();
    });

    it('on press of enter handleEnter should run', async () => {
        const mockEventListener = jest.fn();
        document.addEventListener('keydown', mockEventListener);
        render(<QuickStrategyForm />, {
            wrapper,
        });
        const input = screen.getByTestId('qs_autocomplete_tradetype');
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });
        fireEvent.keyDown(input, { keyCode: 13 });

        expect(mockEventListener).toHaveBeenCalledWith(
            expect.objectContaining({ key: 'Enter', code: 'Enter', keyCode: 13 })
        );
    });

    it('should render the form with existing duration values and possitive last digit prediction', () => {
        mock_DBot_store?.quick_strategy?.setCurrentDurationMinMax(1, 2);
        mock_DBot_store?.quick_strategy?.setValue('last_digit_prediction', 5);
        const { container } = render(<QuickStrategyForm />, {
            wrapper,
        });

        expect(container).toBeInTheDocument();
    });
});
