import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QuickStrategy from '../quick-strategy';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Modal: ({ children, is_open }: { children: JSX.Element; is_open: boolean }) => is_open && <div>{children}</div>,
}));

jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    ApiHelpers: {
        instance: {
            contracts_for: {
                getDurations: () => [
                    {
                        display: 'Ticks',
                        unit: 't',
                        min: 1,
                        max: 10,
                    },
                    {
                        display: 'sample',
                        unit: 's',
                        min: 10,
                        max: 20,
                    },
                ],
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
    config: {
        ...jest.requireActual('@deriv/bot-skeleton').config,
        QUICK_STRATEGY: {
            DISABLED: {
                SYMBOLS: ['1HZ150V', '1HZ250V'],
                SUBMARKETS: ['crash_index', 'non_stable_coin'],
            },
            DEFAULT: {
                symbol: '1HZ100V',
                tradetype: 'callput',
                durationtype: 't',
                size: 2,
                unit: 1,
            },
        },
    },
}));

jest.mock('../../../../xml/martingale.xml', () => '');

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
    utils: {
        xml: { textToDom: jest.fn() },
    },
};

jest.mock('../config', () => ({
    ...jest.requireActual('../config'),
    STRATEGIES: {
        MARTINGALE: {
            name: 'martingale',
            label: 'martingale',
            description: 'martingale',
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
                        type: 'number',
                        name: 'duration',
                        validation: ['required', 'number', 'floor', 'min', 'max'],
                    },
                    {
                        type: 'duration',
                        name: 'duration',
                        validation: ['required', 'number', 'floor', 'min', 'max'],
                    },
                    {
                        type: 'number',
                        name: 'size',
                        validation: ['required'],
                    },
                    {
                        type: 'number',
                        name: 'profit',
                        validation: ['number', 'ceil'],
                    },
                    {
                        type: 'number',
                        name: 'loss',
                        validation: [
                            'number',
                            {
                                type: 'max',
                                value: 10,
                                getMessage: () => 'some message',
                            },
                        ],
                    },
                    {
                        type: 'label',
                        label: 'Duration',
                        description: 'The trade length of your purchased contract.',
                        hide: ['desktop'],
                    },
                    {
                        type: 'number',
                        name: 'last_digit_prediction',
                        validation: ['number', 'integer'],
                        should_have: [{ key: 'symbol', value: 'WLDAUD' }],
                        hide_without_should_have: true,
                    },
                    {
                        type: 'number',
                        name: 'max_stake',
                        validation: ['number', 'integer'],
                        should_have: [{ key: 'symbol', value: '', multiple: ['WLDAUD'] }],
                        hide_without_should_have: true,
                    },
                ],
                [],
            ],
        },
        D_ALEMBERT: {
            label: 'D’Alembert',
        },
        OSCARS_GRIND: {
            label: 'Oscar’s Grind',
        },
        REVERSE_MARTINGALE: {
            label: 'Reverse Martingale',
        },
        REVERSE_D_ALEMBERT: {
            label: 'Reverse D’Alembert',
        },
        STRATEGY_1_3_2_6: {
            label: '1-3-2-6',
        },
    },
}));

describe('<QuickStrategy />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    let mock_store = mockStore({
        ui: {
            is_mobile: true,
        },
    });
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        mock_DBot_store?.quick_strategy?.setValue('durationtype', 't');
        mock_DBot_store?.quick_strategy?.setSelectedStrategy('MARTINGALE');
        mock_DBot_store?.quick_strategy?.setFormVisibility(true);
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render QuickStrategy', async () => {
        const { container } = render(<QuickStrategy />, {
            wrapper,
        });

        await waitFor(() => {
            expect(container).toBeInTheDocument();
        });
    });

    it('It should submit the form', async () => {
        render(<QuickStrategy />, {
            wrapper,
        });

        await waitFor(() => {
            userEvent.click(screen.getByTestId('qs-run-button'));
        });

        expect(mock_DBot_store?.quick_strategy?.is_open).toBeFalsy();
    });

    it('It should close the form on close button click', async () => {
        render(<QuickStrategy />, {
            wrapper,
        });

        const close_button = screen.getByTestId('dt_page_overlay_header_close');

        expect(close_button).toBeInTheDocument();

        await waitFor(() => {
            userEvent.click(close_button);
        });

        expect(mock_DBot_store.quick_strategy.is_open).toBeFalsy();
    });

    it('It should render desktop', () => {
        mock_store = mockStore({
            ui: {
                is_mobile: false,
            },
        });
        render(<QuickStrategy />, {
            wrapper,
        });
    });
});
