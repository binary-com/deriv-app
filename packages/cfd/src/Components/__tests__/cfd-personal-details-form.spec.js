import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import React from 'react';
import ReactDOM from 'react-dom';
import CFDPersonalDetailsForm from '../cfd-personal-details-form';
import { StoreProvider, mockStore } from '@deriv/stores';
import { CFDStoreProvider } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { useLandingCompanyDetails } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useLandingCompanyDetails: jest.fn(() => ({
        data: {
            tin_not_mandatory: 0,
        },
        isLoading: false,
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

window.LiveChatWidget = {
    call: jest.fn(),
    get: jest.fn(),
    init: jest.fn(),
    on: jest.fn(),
};

describe('<CFDPersonalDetailsForm />', () => {
    beforeAll(() => (ReactDOM.createPortal = jest.fn(component => component)));
    afterAll(() => ReactDOM.createPortal.mockClear());
    beforeEach(() => {
        isMobile.mockReturnValue(false);
    });

    const props = {
        form_error: undefined,
        index: 0,
        is_fully_authenticated: false,
        is_loading: false,
        landing_company: {
            config: {
                tax_details_required: 1,
                tin_format: ['^\\d{15}$'],
                tin_format_description: '999999999999999',
            },
            dxtrade_financial_company: {},
            dxtrade_gaming_company: {},
            financial_company: {},
            gaming_company: {},
            id: 'id',
            minimum_age: 18,
            mt_financial_company: {},
            mt_gaming_company: {},
            name: 'Indonesia',
            virtual_company: 'virtual',
        },
        onSubmit: jest.fn(),
        residence_list: [
            {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {},
                            has_visual_sample: 0,
                            is_country_supported: 0,
                        },
                        onfido: {
                            documents_supported: {
                                driving_licence: {
                                    display_name: 'Driving Licence',
                                },
                                national_identity_card: {
                                    display_name: 'National Identity Card',
                                },
                                passport: {
                                    display_name: 'Passport',
                                },
                            },
                            is_country_supported: 1,
                        },
                    },
                },
                phone_idd: '62',
                text: 'Indonesia',
                tin_format: ['^\\d{15}$'],
                value: 'id',
            },
            {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {},
                            has_visual_sample: 0,
                            is_country_supported: 0,
                        },
                        onfido: {
                            documents_supported: {},
                            is_country_supported: 0,
                        },
                    },
                },
                phone_idd: '35818',
                text: 'Aland Islands',
                value: 'ax',
            },
        ],
        initial_values: {
            citizen: '',
            tax_residence: '',
            tax_identification_number: '',
            account_opening_reason: '',
            place_of_birth: '',
        },
    };

    const citizenship_required_error = 'Citizenship is required';
    const place_of_birth_required_error = 'Place of birth is required';
    const tax_residence_required_error = 'Tax residence is required';
    const tax_id_required_error = 'Tax identification number is required';
    const opening_reason_required_error = 'Account opening reason is required';

    const mock_store = mockStore({
        client: {
            account_settings: {
                residence: 'id',
            },
        },
        modules: {
            cfd: {
                jurisdiction_selected_shortcode: 'vanuatu',
            },
        },
    });

    const wrapper = ({ children }) => (
        <StoreProvider store={mock_store}>
            <CFDStoreProvider>{children}</CFDStoreProvider>;
        </StoreProvider>
    );

    it('should render properly on desktop', async () => {
        render(<CFDPersonalDetailsForm {...props} />, { wrapper });

        expect(screen.getByTestId('dt_cfd_details_form_description')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /citizenship/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /tax residence/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /tax identification number/i })).toBeInTheDocument();
        expect(screen.getByText(/account opening reason/i)).toBeInTheDocument();
        await waitFor(() => expect(screen.getByRole('button', { name: /next/i })).toBeDisabled());
    });

    it('should not render scrollbars or modal footer wrapper on mobile', () => {
        isMobile.mockReturnValue(true);
        render(<CFDPersonalDetailsForm {...props} />, { wrapper });

        expect(screen.queryByTestId('dt_themed_scrollbars')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_modal_footer')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it("should show that it's loading when is_loading is true", () => {
        render(<CFDPersonalDetailsForm {...props} is_loading />, { wrapper });
        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_cfd_details_form_description')).not.toBeInTheDocument();
    });

    it("should show that it's loading when residence_list is still empty", () => {
        render(<CFDPersonalDetailsForm {...props} residence_list={[]} />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_cfd_details_form_description')).not.toBeInTheDocument();
    });

    it('should disable Citizenship and Tax residence fields if they were submitted earlier & immutable from BE', async () => {
        const initial_values = {
            citizen: 'Indonesia',
            tax_residence: 'Indonesia',
            tax_identification_number: '',
            account_opening_reason: '',
            place_of_birth: 'Indonesia',
        };

        const changeable_fields = ['tax_identification_number'];
        render(
            <CFDPersonalDetailsForm
                {...props}
                is_fully_authenticated
                initial_values={initial_values}
                changeable_fields={changeable_fields}
            />,
            { wrapper }
        );

        expect(screen.getByRole('textbox', { name: /citizenship/i })).toBeDisabled();
        expect(screen.getByRole('textbox', { name: /tax residence/i })).toBeDisabled();
        expect(screen.getByRole('textbox', { name: /place of birth/i })).toBeDisabled();
        expect(screen.getByRole('textbox', { name: /tax identification number/i })).toBeEnabled();
        expect(screen.getByText(/account opening reason/i)).toBeEnabled();
        await waitFor(() => expect(screen.getByRole('button', { name: /next/i })).toBeDisabled());
    });

    it('should show an error message received from server that is passed via props as form_error', async () => {
        const form_error = 'Input validation failed: citizen!';
        render(<CFDPersonalDetailsForm {...props} form_error={form_error} />, { wrapper });

        expect(screen.getByTestId('form_submit_error')).toHaveClass('dc-icon');
        expect(screen.getByText(form_error)).toBeInTheDocument();
        await waitFor(() => expect(screen.getByRole('button', { name: /next/i })).toBeDisabled());
    });

    it('should show validation errors in fields', async () => {
        render(<CFDPersonalDetailsForm {...props} />, { wrapper });

        const citizenship_input = screen.getByRole('textbox', { name: /citizenship/i });
        const place_of_birth_input = screen.getByRole('textbox', { name: /place of birth/i });
        const tax_residence_input = screen.getByRole('textbox', { name: /tax residence/i });
        const tax_id_input = screen.getByRole('textbox', { name: /tax identification number/i });
        const opening_reason_input = screen.getByTestId(/dt_dropdown_display/i);
        const next_button = screen.getByRole('button', { name: /next/i });

        fireEvent.blur(citizenship_input);
        expect(await screen.findByText(citizenship_required_error)).toBeInTheDocument();

        fireEvent.blur(place_of_birth_input);
        expect(await screen.findByText(place_of_birth_required_error)).toBeInTheDocument();

        fireEvent.blur(tax_residence_input);
        expect(await screen.findByText(tax_residence_required_error)).toBeInTheDocument();

        fireEvent.blur(tax_id_input);
        expect(await screen.findByText(tax_id_required_error)).toBeInTheDocument();

        fireEvent.click(opening_reason_input);
        const hedging = within(screen.getByRole('list')).getByText('Hedging');
        fireEvent.click(hedging);
        await waitFor(() => expect(screen.queryByText(opening_reason_required_error)).not.toBeInTheDocument());

        expect(next_button).toBeDisabled();
    });

    it('should enable the Next button for form submission when all required fields are filled', async () => {
        render(<CFDPersonalDetailsForm {...props} />, { wrapper });

        const citizenship_input = screen.getByRole('textbox', { name: /citizenship/i });
        const place_of_birth_input = screen.getByRole('textbox', { name: /place of birth/i });
        const tax_residence_input = screen.getByRole('textbox', { name: /tax residence/i });
        const tax_id_input = screen.getByRole('textbox', { name: /tax identification number/i });
        const opening_reason_input = screen.getByTestId(/dt_dropdown_display/i);
        const next_button = screen.getByRole('button', { name: /next/i });

        await waitFor(() => expect(screen.getByRole('button', { name: /next/i })).toBeDisabled());

        fireEvent.change(citizenship_input, { target: { value: 'Aland Islands' } });
        fireEvent.change(place_of_birth_input, { target: { value: 'Indonesia' } });
        fireEvent.change(tax_residence_input, { target: { value: 'Indonesia' } });
        fireEvent.change(tax_id_input, { target: { value: '023124224563456' } });
        fireEvent.click(opening_reason_input);
        const income_earning = within(screen.getByRole('list')).getByText('Income Earning');
        fireEvent.click(income_earning);

        const crs_confirmation_checkbox = screen.getByRole('checkbox', {
            name: /i confirm that my tax information is accurate and complete/i,
        });
        fireEvent.click(crs_confirmation_checkbox);

        await waitFor(() => {
            expect(screen.queryByText(citizenship_required_error)).not.toBeInTheDocument();
            expect(screen.queryByText(tax_residence_required_error)).not.toBeInTheDocument();
            expect(screen.queryByText(tax_id_required_error)).not.toBeInTheDocument();
            expect(screen.queryByText(opening_reason_required_error)).not.toBeInTheDocument();
            expect(next_button).toBeEnabled();
        });

        fireEvent.click(next_button);

        await waitFor(() => {
            expect(props.onSubmit).toHaveBeenCalledTimes(1);
        });
    });

    it('should disable the Next button in case of invalid input in a required field', async () => {
        render(<CFDPersonalDetailsForm {...props} />, { wrapper });

        const tax_id_input = screen.getByRole('textbox', { name: /tax identification number/i });

        fireEvent.change(tax_id_input, { target: { value: 'invalid_text_id_0' } });
        fireEvent.blur(tax_id_input);

        expect(await screen.findByText('Tax identification number is not properly formatted.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('should disable the Next button in case a required field is empty', async () => {
        render(<CFDPersonalDetailsForm {...props} />, { wrapper });

        const citizenship_input = screen.getByRole('textbox', { name: /citizenship/i });

        fireEvent.change(citizenship_input, { target: { value: '' } });
        fireEvent.blur(citizenship_input);

        expect(await screen.findByText(citizenship_required_error)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('should not show TIN field if the country is NPJ based on the landing_company_details response', async () => {
        useLandingCompanyDetails.mockReturnValue({
            data: {
                tin_not_mandatory: 1,
            },
            isLoading: false,
        });

        render(<CFDPersonalDetailsForm {...props} />, { wrapper });

        const citizenship_input = screen.getByRole('textbox', { name: /citizenship/i });
        const place_of_birth_input = screen.getByRole('textbox', { name: /place of birth/i });
        const tax_residence_input = screen.getByRole('textbox', { name: /tax residence/i });
        const opening_reason_input = screen.getByTestId(/dt_dropdown_display/i);
        const next_button = screen.getByRole('button', { name: /next/i });
        const tax_id_input = screen.queryByRole('textbox', { name: /tax identification number/i });

        expect(tax_id_input).not.toBeInTheDocument();
        await waitFor(() => expect(screen.getByRole('button', { name: /next/i })).toBeDisabled());

        fireEvent.change(citizenship_input, { target: { value: 'Aland Islands' } });
        fireEvent.change(place_of_birth_input, { target: { value: 'Indonesia' } });
        fireEvent.change(tax_residence_input, { target: { value: 'Indonesia' } });
        fireEvent.click(opening_reason_input);
        const income_earning = within(screen.getByRole('list')).getByText('Income Earning');
        fireEvent.click(income_earning);

        await waitFor(() => {
            expect(screen.queryByText(citizenship_required_error)).not.toBeInTheDocument();
            expect(screen.queryByText(tax_residence_required_error)).not.toBeInTheDocument();
            expect(screen.queryByText(opening_reason_required_error)).not.toBeInTheDocument();
            expect(next_button).toBeEnabled();
        });

        fireEvent.click(next_button);

        await waitFor(() => {
            expect(props.onSubmit).toHaveBeenCalledTimes(1);
        });
    });

    it('Should not show TIN field if tin_manually_approved is true in account_status', () => {
        mock_store.client.account_status.status = ['tin_manually_approved'];
        render(<CFDPersonalDetailsForm {...props} />, { wrapper });

        expect(screen.queryByRole('textbox', { name: /tax identification number/i })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
    });

    it('Should show inline message live chat and open chat window when link is clicked', async () => {
        render(<CFDPersonalDetailsForm {...props} />, { wrapper });

        const linkElement = screen.getByText(/live chat/i);
        expect(linkElement).toBeInTheDocument();
        fireEvent.click(linkElement);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });
});
