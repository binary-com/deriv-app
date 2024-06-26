import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import ContractType from '../contract-type';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('formik', () => ({
    ...jest.requireActual('formik'),
    Field: jest.fn(({ children }) =>
        children({
            field: {
                value: 'CALL',
            },
        })
    ),
    useFormikContext: jest.fn(() => ({
        setFieldValue: jest.fn(),
        validateForm: jest.fn(),
        values: { symbol: '1HZ100V', tradetype: 'callput', type: 'CALL' },
    })),
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
                getContractTypes: () => [
                    {
                        text: 'RISE',
                        value: 'CALL',
                    },
                    {
                        text: 'FALL',
                        value: 'PUT',
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

describe('<ContractType /> Responsive', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_desktop: false,
            },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const mock_onSubmit = jest.fn();
        const initial_value = {
            durationtype: 1,
            symbol: 'R_100',
            tradetype: 'callput',
            type: '',
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik
                        initialValues={initial_value}
                        validationSchema={Yup.object().shape({
                            duration_value: Yup.number().min(1, 'Minimum value should be more than 0'),
                        })}
                        onSubmit={mock_onSubmit}
                    >
                        {children}
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render ContractTypes', async () => {
        const { container } = render(<ContractType name='type' />, {
            wrapper,
        });
        await waitFor(() => {
            expect(container).toBeInTheDocument();
        });
    });

    it('should select item from tabs', async () => {
        render(<ContractType name='type' />, {
            wrapper,
        });
        const tabs = screen.getByTestId('dt_qs_contract_types');
        userEvent.click(tabs);
        await waitFor(() => {
            const option_element = screen.getByText('RISE');
            userEvent.click(option_element);
        });
        // eslint-disable-next-line testing-library/no-node-access
        const active = screen.getByText('RISE')?.parentElement;
        expect(active).toHaveClass('qs__form__field__list__item--active');
    });
});

describe('<ContractType /> Desktop', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_desktop: true,
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
                    <Formik
                        initialValues={initial_value}
                        validationSchema={Yup.object().shape({
                            duration_value: Yup.number().min(1, 'Minimum value should be more than 0'),
                        })}
                        onSubmit={mock_onSubmit}
                    >
                        {children}
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render ContractType', async () => {
        const { container } = render(<ContractType name='type' />, {
            wrapper,
        });
        await waitFor(() => {
            expect(container).toBeInTheDocument();
        });
    });

    it('should select item from list', async () => {
        render(<ContractType name='type' />, {
            wrapper,
        });
        const autocomplete_element = screen.getByTestId('dt_qs_contract_type');
        userEvent.click(autocomplete_element);
        await waitFor(() => {
            const option_element = screen.getByText('RISE');
            userEvent.click(option_element);
        });
        expect(autocomplete_element).toHaveDisplayValue('RISE');
    });
});
