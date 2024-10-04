import React from 'react';
import ReactDOM from 'react-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PoiConfirmWithExampleFormContainer from '../poi-confirm-with-example-form-container';
import { APIProvider } from '@deriv/api';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightNameDobPoiIcon: () => 'DerivLightNameDobPoiIcon',
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
    filterObjProperties: jest.fn(() => ({
        first_name: 'test first name',
        last_name: 'test last name',
        date_of_birth: '2003-08-02',
    })),
    toMoment: jest.fn(() => ({
        format: jest.fn(() => '2003-08-02'),
        subtract: jest.fn(),
    })),
    WS: {
        wait: jest.fn(() => Promise.resolve()),
        setSettings: jest.fn(() => Promise.resolve({ error: '' })),
        authorized: {
            storage: {
                getSettings: jest.fn(() =>
                    Promise.resolve({
                        error: '',
                        get_settings: {
                            first_name: 'test first name1',
                            last_name: 'test last name1',
                            date_of_birth: '2003-08-03',
                        },
                    })
                ),
            },
        },
    },
}));

describe('<PoiConfirmWithExampleFormContainer/>', () => {
    beforeAll(() => {
        (ReactDOM.createPortal as jest.Mock) = jest.fn(element => element);
    });
    afterEach(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });

    const mock_props = {
        account_settings: {},
        getChangeableFields: jest.fn(() => ['first_name', 'last_name', 'date_of_birth']),
        onFormConfirm: jest.fn(),
    };

    const renderComponent = ({ props = mock_props }) =>
        render(
            <APIProvider>
                <PoiConfirmWithExampleFormContainer {...props} />
            </APIProvider>
        );

    const clarification_message = /To avoid delays, enter your/;
    it('should render PersonalDetailsForm with image and checkbox', async () => {
        renderComponent({});

        expect(await screen.findByText('DerivLightNameDobPoiIcon')).toBeInTheDocument();
        expect(screen.getByText(clarification_message)).toBeInTheDocument();
        const checkbox_el: HTMLInputElement = screen.getByRole('checkbox');
        expect(checkbox_el.checked).toBeFalsy();

        const input_fields: HTMLInputElement[] = screen.getAllByRole('textbox');
        expect(input_fields).toHaveLength(3);
        expect(input_fields[0].name).toBe('first_name');
        expect(input_fields[1].name).toBe('last_name');
        expect(input_fields[2].name).toBe('date_of_birth');
    });
    it('should change fields and trigger submit', async () => {
        jest.useFakeTimers();
        renderComponent({});

        const checkbox_el: HTMLInputElement = await screen.findByRole('checkbox');
        expect(checkbox_el.checked).toBeFalsy();

        const input_fields: HTMLInputElement[] = screen.getAllByRole('textbox');
        const first_name_input = input_fields[0];
        const last_name_input = input_fields[1];
        const dob_input = input_fields[2];

        expect(first_name_input.value).toBe('test first name');
        expect(last_name_input.value).toBe('test last name');
        expect(dob_input.value).toBe('2003-08-02');

        userEvent.clear(first_name_input);
        userEvent.clear(last_name_input);
        userEvent.type(first_name_input, 'new test first name');
        userEvent.type(last_name_input, 'new test last name');

        await waitFor(() => {
            expect(first_name_input.value).toBe('new test first name');
            expect(last_name_input.value).toBe('new test last name');
        });

        const button_el = screen.getByRole('button');
        userEvent.click(button_el);
        await userEvent.click(button_el);
        act(() => {
            jest.advanceTimersByTime(500);
        });

        await waitFor(() => {
            expect(mock_props.onFormConfirm).toHaveBeenCalled();
        });
        jest.useRealTimers();
    });
});
