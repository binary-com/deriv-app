import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import SymbolSelect from '../symbol';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

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

describe('<SymbolSelect />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_mobile_or_tablet: true,
            },
        });

        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const mock_onSubmit = jest.fn();
        const initial_value = {
            durationtype: 1,
            symbol: 'R_100',
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
    it('should render SymbolSelect', () => {
        const { container } = render(<SymbolSelect key={1} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should select item from the list', async () => {
        render(<SymbolSelect key='RDBULL' />, {
            wrapper,
        });

        const autocomplete_element = screen.getByTestId('qs_autocomplete_symbol');
        userEvent.click(autocomplete_element);

        const option_element = screen.getByText(/Bear Market Index/i);
        userEvent.click(option_element);

        expect(autocomplete_element).toHaveDisplayValue([/Bear Market Index/i]);
    });

    it('should input to be empty when the user clicks to type something', () => {
        mockStore({ ui: { is_mobile_or_tablet: false, is_desktop: true } });
        render(<SymbolSelect />, {
            wrapper,
        });

        const autocomplete_element = screen.getByTestId('qs_autocomplete_symbol');
        userEvent.hover(autocomplete_element);

        expect((autocomplete_element as HTMLInputElement).value).toBe('AUD Basket');
    });
});
