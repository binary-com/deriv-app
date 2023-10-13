import React from 'react';
import { Formik } from 'formik';

import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';

import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import { mock_ws } from 'Utils/mock';

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
}));

jest.mock('../../../xml/martingale.xml', () => '');

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
};

jest.mock('../config', () => ({
    SIZE_MIN: 2,
    STRATEGIES: {
        MARTINGALE: {
            name: 'martingale',
            label: 'martingale',
            description: 'test',
            fields: [
                [
                    {
                        type: 'symbol',
                        fullWidth: true,
                        name: 'symbol',
                    },
                    {
                        type: 'tradetype',
                        fullWidth: true,
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
                ],
                [],
            ],
        },
    },
}));

describe('<QuickStrategy />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({
        ui: {
            is_mobile: false,
        },
    });
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        mock_DBot_store?.quick_strategy_store_1?.setValue('durationtype', 't');
        mock_DBot_store?.quick_strategy_store_1?.setSelectedStrategy('MARTINGALE');
        mock_DBot_store?.quick_strategy_store_1?.setFormVisibility(true);
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
            expect(mock_DBot_store?.quick_strategy_store_1?.is_open).toBeFalsy();
        });
    });
});
