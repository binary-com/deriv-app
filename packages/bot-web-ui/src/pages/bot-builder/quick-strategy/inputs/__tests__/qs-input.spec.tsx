import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QSInput from '../qs-input';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('<QSInput />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const onChange = jest.fn();

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_mobile_or_tablet: true,
            },
        });

        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const mock_onSubmit = jest.fn();

        const initial_value = {
            duration: 1,
            size: 0,
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik
                        initialValues={initial_value}
                        validationSchema={Yup.object().shape({
                            duration: Yup.number().min(1, 'Minimum value should be more than 0'),
                        })}
                        onSubmit={mock_onSubmit}
                    >
                        {children}
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render QSInput', () => {
        const { container } = render(<QSInput onChange={onChange} name='duration' />, {
            wrapper,
        });

        expect(container).toBeInTheDocument();
    });

    it('should increase the value on click of "+" button', () => {
        render(<QSInput name='duration' type='number' onChange={onChange} />, {
            wrapper,
        });

        const increase_button = screen.getByTestId('qs-input-increase');
        userEvent.click(increase_button);

        const input_increase = screen.getByTestId('qs-input') as HTMLInputElement;
        const input_value = input_increase.value;
        expect(input_value).toEqual('2');
    });

    it('should decrease the value on click of "-" button', () => {
        render(<QSInput name='duration' type='number' onChange={onChange} />, {
            wrapper,
        });

        const decrease_button = screen.getByTestId('qs-input-decrease');
        userEvent.click(decrease_button);

        const input_decrease = screen.getByTestId('qs-input') as HTMLInputElement;
        const input_value = input_decrease.value;

        expect(input_value).toEqual('0');
    });

    it('the onMouseLeave handler sets the focus to false', () => {
        render(<QSInput name='duration' type='number' onChange={onChange} />, {
            wrapper,
        });

        const container_element = screen.getByTestId('qs-input-container');
        userEvent.unhover(container_element);

        expect(container_element).not.toHaveClass('no-focus');
    });
});
