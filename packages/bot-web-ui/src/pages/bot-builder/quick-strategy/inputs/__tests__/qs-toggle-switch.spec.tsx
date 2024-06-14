import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QSToggleSwitch from '../qs-toggle-switch';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('formik', () => ({
    ...jest.requireActual('formik'),
    useFormikContext: () => ({
        values: { max_stake: 10 },
        setFieldValue: jest.fn(),
    }),
}));

describe('<QSCheckbox />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mockSetIsEnabledToggleSwitch = jest.fn();

    const mocked_props = {
        name: 'max-stake',
        label: 'Max Stake',
        isEnabledToggleSwitch: false,
        setIsEnabledToggleSwitch: mockSetIsEnabledToggleSwitch,
    };

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_mobile_or_tablet: false,
            },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const mock_onSubmit = jest.fn();
        const initial_value = {
            symbol: 'R_100',
            max_stake: 10,
            boolean_max_stake: false,
            duration: 1,
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

    it('should render QSToggleSwitch', () => {
        const { container } = render(<QSToggleSwitch {...mocked_props} />, {
            wrapper,
        });

        expect(container).toBeInTheDocument();
    });

    it('should render description', () => {
        render(<QSToggleSwitch {...mocked_props} description='Max stake field mock description' />, {
            wrapper,
        });

        userEvent.click(screen.getByTestId('dt_popover_wrapper'));
        userEvent.hover(screen.getByText('Max Stake'));

        expect(screen.getByText('Max stake field mock description')).toBeInTheDocument();
    });

    it('should change value', () => {
        const modified_mocked_props = {
            ...mocked_props,
            name: 'boolean_max_stake',
        };
        const { container } = render(<QSToggleSwitch {...modified_mocked_props} />, {
            wrapper,
        });
        // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
        const label = container.querySelector('.dc-toggle-switch__label');
        if (label) {
            userEvent.click(label);
        }
        expect(mockSetIsEnabledToggleSwitch).toHaveBeenCalled();
        expect(screen.getByText('Max Stake')).toBeInTheDocument();
    });
});
