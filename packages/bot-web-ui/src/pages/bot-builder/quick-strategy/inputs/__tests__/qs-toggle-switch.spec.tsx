import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { mockStore, StoreProvider } from '@deriv/stores';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QSToggleSwitch from '../qs-toggle-switch';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('<QSCheckbox />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_mobile: false,
            },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const mock_onSubmit = jest.fn();
        const initial_value = {
            symbol: 'R_100',
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
        const { container } = render(<QSToggleSwitch name='max-stake' label='Max Stake' />, {
            wrapper,
        });

        expect(container).toBeInTheDocument();
    });

    it('should render description', () => {
        render(<QSToggleSwitch name='max-stake' label='Max Stake' description='Max stake field mock description' />, {
            wrapper,
        });
        userEvent.click(screen.getByTestId('dt_popover_wrapper'));
        act(() => {
            userEvent.hover(screen.getByText('Max Stake'));
        });
        expect(screen.getByText('Max stake field mock description')).toBeInTheDocument();
    });

    it('should change value', () => {
        render(<QSToggleSwitch name='boolean_max_stake' label='Max Stake' />, {
            wrapper,
        });
        const toggle_switch = screen.getByRole('checkbox', { name: 'toggle_switch' });
        userEvent.click(toggle_switch);
        expect(toggle_switch).toBeChecked();
        expect(screen.getByText('Max Stake')).toBeInTheDocument();
    });
});
