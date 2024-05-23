import React from 'react';
import { FormikProps } from 'formik';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useStatesList } from '@deriv/hooks';
import { isDesktop, isMobile } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import AddressDetails, { TAddressDetailFormProps } from '../address-details';
import { TStores } from '@deriv/stores/types';
import userEvent from '@testing-library/user-event';
import { splitValidationResultTypes } from 'Components/real-account-signup/helpers/utils';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getLocation: jest.fn().mockReturnValue('Default test state'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
    makeCancellablePromise: jest.fn(() => ({ cancel: jest.fn(), promise: Promise.resolve('resolved') })),
}));

jest.mock('../../real-account-signup/helpers/utils.ts', () => ({
    splitValidationResultTypes: jest.fn(() => ({
        errors: {},
        warnings: {},
    })),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useStatesList: jest.fn(() => ({ data: [], isFetched: true })),
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

const mockedSplitValidationResultTypes = splitValidationResultTypes as jest.MockedFunction<
    typeof splitValidationResultTypes
>;

describe('<AddressDetails/>', () => {
    const address_line_1 = 'First line of address';
    const address_line_1_marked = 'First line of address*';
    const address_line_2 = 'Second line of address';
    const address_line_2_marked = 'Second line of address*';
    const address_postcode = 'Postal/ZIP Code';
    const address_postcode_marked = 'Postal/ZIP Code*';
    const address_state = 'State/Province';
    const address_town = 'Town/City';
    const address_town_marked = 'Town/City*';

    let modal_root_el: HTMLDivElement;
    const mock_props: React.ComponentProps<typeof AddressDetails> = {
        getCurrentStep: jest.fn(),
        goToNextStep: jest.fn(),
        goToPreviousStep: jest.fn(),
        onCancel: jest.fn(),
        onSave: jest.fn(),
        onSubmit: jest.fn(),
        selected_step_ref: { current: { isSubmitting: false } } as React.RefObject<
            FormikProps<TAddressDetailFormProps>
        >,
        value: {
            address_city: '',
            address_line_1: '',
            address_line_2: '',
            address_postcode: '',
            address_state: 'Default test state',
        },
        validate: jest.fn(),
        disabled_items: [],
        has_real_account: false,
    };

    const store = mockStore({});

    const svgCommonRenderCheck = () => {
        expect(screen.getByLabelText(address_line_1_marked)).toBeInTheDocument();
        expect(screen.getByLabelText(address_line_2)).toBeInTheDocument();
        expect(screen.getByLabelText(address_postcode)).toBeInTheDocument();
        expect(screen.getByLabelText(address_state)).toBeInTheDocument();
        expect(screen.getByLabelText(address_town_marked)).toBeInTheDocument();

        expect(screen.queryByLabelText(address_line_1)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(address_line_2_marked)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(address_postcode_marked)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(address_town)).not.toBeInTheDocument();
    };

    const renderComponent = ({ props = mock_props, store_config = store }) => {
        return render(
            <StoreProvider store={store_config}>
                <AddressDetails {...props} />
            </StoreProvider>
        );
    };

    beforeEach(() => {
        (isDesktop as jest.Mock).mockReturnValue(true);
        (isMobile as jest.Mock).mockReturnValue(false);
        jest.clearAllMocks();
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render AddressDetails component for mobile', async () => {
        const new_store_config: TStores = {
            ...store,
            ui: {
                ...store.ui,
                is_mobile: true,
            },
        };

        renderComponent({ store_config: new_store_config });

        await waitFor(() => {
            svgCommonRenderCheck();
        });

        expect(screen.getByText('Complete your address details')).toBeInTheDocument();

        const inputs: HTMLTextAreaElement[] = screen.getAllByRole('textbox');
        expect(inputs).toHaveLength(5);
        const required_fields = inputs.filter(input => input.required === true);
        expect(required_fields).toHaveLength(2);
    });

    it('should show a loader when states list is not fully fetched', async () => {
        (useStatesList as jest.Mock).mockReturnValue({
            data: [],
            isFetched: false,
        });

        renderComponent({});
        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should render AddressDetails component and trigger buttons', async () => {
        renderComponent({});

        await waitFor(() => {
            svgCommonRenderCheck();
        });

        const inputs: HTMLTextAreaElement[] = screen.getAllByRole('textbox');
        expect(inputs).toHaveLength(5);

        const required_fields = inputs.filter(input => input.required === true);
        expect(required_fields).toHaveLength(2);

        const previous_btn = screen.getByRole('button', { name: /previous/i });
        fireEvent.click(previous_btn);
        expect(mock_props.getCurrentStep).toHaveBeenCalled();
        expect(mock_props.onCancel).toHaveBeenCalledTimes(1);
        expect(mock_props.onSave).toHaveBeenCalled();

        const address_line_1_input: HTMLInputElement = screen.getByLabelText(address_line_1_marked);
        const first_line_adress_text = 'Test first line address';
        expect(address_line_1_input.value).toBe('');
        fireEvent.change(address_line_1_input, { target: { value: first_line_adress_text } });
        await waitFor(() => {
            expect(address_line_1_input.value).toBe(first_line_adress_text);
        });

        const address_town_input: HTMLInputElement = screen.getByLabelText(address_town_marked);
        const address_town_text = 'Test city';
        expect(address_town_input.value).toBe('');
        fireEvent.change(address_town_input, { target: { value: address_town_text } });
        await waitFor(() => {
            expect(address_town_input.value).toBe(address_town_text);
        });

        const address_postcode_input: HTMLInputElement = screen.getByLabelText(address_postcode);
        const address_postcode_text = 'Test postcode';
        expect(address_postcode_input.value).toBe('');
        fireEvent.change(address_postcode_input, { target: { value: address_postcode_text } });
        await waitFor(() => {
            expect(address_postcode_input.value).toBe(address_postcode_text);
        });

        const address_state_input: HTMLInputElement = screen.getByLabelText(address_state);
        const address_state_text = 'Test state';
        expect(address_state_input.value).toBe('Default test state');
        fireEvent.change(address_state_input, { target: { value: address_state_text } });
        await waitFor(() => {
            expect(address_state_input.value).toBe(address_state_text);
        });

        const next_btn = screen.getByRole('button', { name: /next/i });
        fireEvent.click(next_btn);
        await waitFor(() => {
            expect(mock_props.getCurrentStep).toHaveBeenCalled();
            expect(mock_props.onSubmit).toHaveBeenCalledTimes(1);
        });
    });

    it('should render AddressDetails component with states_list for mobile', async () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);
        (useStatesList as jest.Mock).mockReturnValue({
            data: [
                { text: 'State 1', value: 'State 1' },
                { text: 'State 2', value: 'State 2' },
            ],
            isFetched: true,
        });
        const new_store_config: TStores = {
            ...store,
            ui: {
                ...store.ui,
                is_mobile: true,
            },
        };
        renderComponent({ store_config: new_store_config });

        expect(screen.getByText('Default test state')).toBeInTheDocument();
        const address_state_input: HTMLInputElement = screen.getByRole('combobox');
        expect(address_state_input).toHaveValue('');
        fireEvent.change(address_state_input, { target: { value: 'State 2' } });
        await waitFor(() => {
            expect(address_state_input).toHaveValue('State 2');
        });
    });

    it('should render AddressDetails component with states_list for desktop', async () => {
        (useStatesList as jest.Mock).mockReturnValue({
            data: [
                { text: 'State 1', value: 'State 1' },
                { text: 'State 2', value: 'State 2' },
            ],
            isFetched: true,
        });
        renderComponent({});

        const address_state_input: HTMLTextAreaElement = screen.getByRole('textbox', { name: 'State/Province' });
        expect(address_state_input).toHaveValue('Default test state');
        fireEvent.change(address_state_input, { target: { value: 'State 1' } });
        await waitFor(() => {
            expect(address_state_input.value).toBe('State 1');
        });
    });

    it('should disable the field if it is immutable from BE', async () => {
        const new_props: React.ComponentProps<typeof AddressDetails> = {
            ...mock_props,
            disabled_items: ['address_line_1', 'address_line_2'],
            value: { ...mock_props.value, address_state: '' },
        };

        renderComponent({ props: new_props });

        expect(screen.getByLabelText(address_line_1_marked)).toBeDisabled();
        expect(screen.getByLabelText(address_line_2)).toBeDisabled();
        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'State/Province' })).toBeEnabled();
        });
        expect(screen.getByLabelText(address_town_marked)).toBeEnabled();
        expect(screen.getByLabelText(address_postcode)).toBeEnabled();
    });

    it('should show validation error for postcode if adding space in the beginning', async () => {
        renderComponent({});

        const address_postcode_input: HTMLInputElement = screen.getByLabelText(address_postcode);
        await act(async () => {
            userEvent.type(address_postcode_input, '  2222');
            userEvent.tab();
        });

        mockedSplitValidationResultTypes.mockReturnValue({
            errors: {
                address_postcode: 'Only letters, numbers, space and hyphen are allowed.',
            },
            warnings: {},
        });

        const next_btn = screen.getByRole('button', { name: /next/i });
        await act(async () => {
            fireEvent.click(next_btn);
        });

        expect(mockedSplitValidationResultTypes).toHaveBeenCalled();
        expect(mock_props.onSubmit).not.toHaveBeenCalled();
        expect(screen.getByText('Only letters, numbers, space and hyphen are allowed.')).toBeInTheDocument();
    });
});
