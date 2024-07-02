import React, { ComponentProps, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { splitValidationResultTypes } from '../../real-account-signup/helpers/utils';
import PersonalDetails from '../personal-details';
import { shouldShowIdentityInformation, isDocumentTypeValid, isAdditionalDocumentValid } from '../../../Helpers/utils';
import { StoreProvider, mockStore } from '@deriv/stores';
import { Analytics } from '@deriv-com/analytics';
import { FormikErrors } from 'formik';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightNameDobPoiIcon: () => 'DerivLightNameDobPoiIcon',
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Popover: jest.fn(props => props.is_open && <span>{props.message}</span>),
}));

jest.mock('../../real-account-signup/helpers/utils.ts', () => ({
    splitValidationResultTypes: jest.fn(() => ({
        warnings: mock_warnings,
        errors: mock_errors,
    })),
}));

jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (node: ReactNode) => node,
}));

jest.mock('Helpers/utils', () => ({
    ...jest.requireActual('Helpers/utils'),
    isDocumentTypeValid: jest.fn(),
    shouldShowIdentityInformation: jest.fn(() => false),
    isAdditionalDocumentValid: jest.fn(),
}));

type TPersonalDetailsSectionForm = ComponentProps<typeof PersonalDetails>['value'];

const mock_warnings = {};
const mock_errors: FormikErrors<TPersonalDetailsSectionForm> = {
    account_opening_reason: 'Account opening reason is required.',
    salutation: 'Salutation is required.',
    first_name: 'First name is required.',
    last_name: 'Last name is required.',
    date_of_birth: 'Date of birth is required.',
    place_of_birth: 'Place of birth is required.',
    citizen: 'Citizenship is required',
    phone: 'Phone is required.',
    tax_residence: 'Tax residence is required.',
    tax_identification_number: 'Tax Identification Number is required.',
    tax_identification_confirm: 'Please confirm your tax information.',
};

const tax_residence_pop_over_text =
    /the country in which you meet the criteria for paying taxes\. usually the country in which you physically reside\./i;
const tin_pop_over_text = /don't know your tax identification number\?/i;

const runCommonFormfieldsTests = (is_svg: boolean) => {
    expect(screen.getByRole('radio', { name: /mr/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /ms/i })).toBeInTheDocument();
    expect(screen.getByTestId('first_name')).toBeInTheDocument();
    expect(screen.getByTestId('last_name')).toBeInTheDocument();
    expect(screen.getByTestId('date_of_birth')).toBeInTheDocument();
    expect(screen.queryByTestId('place_of_birth')).toBeInTheDocument();
    expect(screen.queryByTestId('place_of_birth_mobile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('citizenship')).toBeInTheDocument();
    expect(screen.queryByTestId('citizenship_mobile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('phone')).toBeInTheDocument();
    expect(screen.queryByTestId('tax_residence')).toBeInTheDocument();
    expect(screen.queryByTestId('tax_residence_mobile')).not.toBeInTheDocument();

    if (is_svg) {
        expect(screen.getByText(/your first name as in your identity document/i)).toBeInTheDocument();

        expect(screen.getByText(/your last name as in your identity document/i)).toBeInTheDocument();

        expect(screen.getByText(/your date of birth as in your identity document/i)).toBeInTheDocument();
    } else {
        expect(
            screen.getByText(/Please enter your first name as in your official identity documents./i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Please enter your last name as in your official identity documents./i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Please enter your date of birth as in your official identity documents./i)
        ).toBeInTheDocument();
    }

    const tax_residence_pop_over = screen.queryByTestId('tax_residence_pop_over');
    if (tax_residence_pop_over) {
        fireEvent.click(tax_residence_pop_over);
    }

    expect(screen.getByText(tax_residence_pop_over_text)).toBeInTheDocument();

    expect(screen.getByLabelText(/tax identification number/i)).toBeInTheDocument();
    const tax_identification_number_pop_over = screen.queryByTestId('tax_identification_number_pop_over');
    expect(tax_identification_number_pop_over).toBeInTheDocument();

    if (tax_identification_number_pop_over) {
        fireEvent.click(tax_identification_number_pop_over);
    }

    expect(screen.getByText(tin_pop_over_text)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'here' })).toBeInTheDocument();

    if (is_svg)
        expect(
            screen.getByRole('heading', {
                name: /additional information/i,
            })
        ).toBeInTheDocument();
    expect(screen.queryByTestId('dt_dropdown_display')).toBeInTheDocument();
    expect(screen.queryByTestId('account_opening_reason_mobile')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
};

describe('<PersonalDetails/>', () => {
    const idv_document_data = {
        document_type: {
            value: 'national_id',
            text: 'National ID',
            id: '0',
        },
        document_number: '1234567890123',
    };

    const default_IDV_config = {
        documents_supported: {},
        has_visual_sample: 0,
        is_country_supported: 0,
    };

    const default_residence_details = [
        {
            value: 'tc',
            identity: {
                services: {
                    idv: {
                        documents_supported: {
                            document_1: {
                                display_name: 'Test document 1 name',
                                format: '5436454364243',
                            },
                            document_2: {
                                display_name: 'Test document 2 name',
                                format: 'A54321',
                            },
                        },
                        has_visual_sample: 1 as any,
                    },
                },
            },
        },
    ];

    const mock_props: ComponentProps<typeof PersonalDetails> = {
        is_svg: true,
        account_opening_reason_list: [
            {
                text: 'Hedging',
                value: 'Hedging',
            },
            {
                text: 'Income Earning',
                value: 'Income Earning',
            },
            {
                text: 'Speculative',
                value: 'Speculative',
            },
        ],
        salutation_list: [
            {
                label: 'Mr',
                value: 'Mr',
            },

            {
                label: 'Ms',
                value: 'Ms',
            },
        ],
        disabled_items: [],
        residence_list: [
            {
                identity: {
                    services: {
                        idv: default_IDV_config as any,
                        onfido: {
                            documents_supported: {
                                passport: {
                                    display_name: 'Passport',
                                },
                            },
                            is_country_supported: 1,
                        },
                    },
                },
                phone_idd: '93',
                text: 'Afghanistan',
                value: 'af',
            },
            {
                identity: {
                    services: {
                        idv: default_IDV_config as any,
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
                phone_idd: '355',
                text: 'Albania',
                tin_format: ['^[A-Ta-t0-9]\\d{8}[A-Wa-w]$'],
                value: 'al',
            },
        ],
        closeRealAccountSignup: jest.fn(),
        validate: jest.fn(),
        value: {
            account_opening_reason: '',
            salutation: '',
            first_name: '',
            last_name: '',
            date_of_birth: '',
            place_of_birth: '',
            citizen: '',
            phone: '+34',
            tax_residence: '',
            tax_identification_number: '',
            tax_identification_confirm: false,
        },
        onSubmit: jest.fn(),
        getCurrentStep: jest.fn(() => 1),
        onSave: jest.fn(),
        onCancel: jest.fn(),
        account_settings: {},
        goToPreviousStep: jest.fn(),
        goToNextStep: jest.fn(),
        is_virtual: false,
        is_fully_authenticated: false,
        has_real_account: false,
        account_status: undefined,
        residence: '',
        real_account_signup_target: '',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mock_store = mockStore({});

    const renderwithRouter = ({ props = mock_props, store = mock_store }) => {
        render(
            <StoreProvider store={store ?? mock_store}>
                <BrowserRouter>
                    <PersonalDetails {...props} />
                </BrowserRouter>
            </StoreProvider>
        );
    };

    it('should have called trackEvent on mount', () => {
        renderwithRouter({});
        expect(Analytics.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should have validation errors on form fields', async () => {
        const new_props = { ...mock_props, is_svg: false };

        renderwithRouter({ props: new_props });

        const first_name = screen.getByTestId('first_name');
        const last_name = screen.getByTestId('last_name');
        const date_of_birth = screen.getByTestId('date_of_birth');
        const place_of_birth = screen.getByTestId('place_of_birth');
        const citizenship = screen.getByTestId('citizenship');
        const phone = screen.getByTestId('phone');
        const tax_residence = screen.getByTestId('tax_residence');
        const tax_identification_number = screen.getByTestId('tax_identification_number');

        fireEvent.blur(first_name);
        fireEvent.blur(last_name);
        fireEvent.blur(date_of_birth);
        fireEvent.blur(place_of_birth);
        fireEvent.blur(citizenship);
        fireEvent.blur(phone);
        fireEvent.blur(tax_residence);
        fireEvent.blur(tax_identification_number);

        expect(await screen.findByText(/first name is required\./i)).toBeInTheDocument();
        expect(await screen.findByText(/last name is required\./i)).toBeInTheDocument();
        expect(await screen.findByText(/date of birth is required\./i)).toBeInTheDocument();
        expect(await screen.findByText(/place of birth is required\./i)).toBeInTheDocument();
        expect(await screen.findByText(/citizenship is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/phone is required\./i)).toBeInTheDocument();
        expect(await screen.findByText(/tax residence is required\./i)).toBeInTheDocument();
        expect(await screen.findByText(/tax identification number is required\./i)).toBeInTheDocument();
        (splitValidationResultTypes as jest.Mock).mockReturnValue({
            ...mock_warnings,
            errors: {
                ...mock_errors,
                first_name: 'letters, spaces, periods, hyphens, apostrophes only',
                last_name: 'last name should be between 2 and 50 characters.',
                date_of_birth: 'You must be 18 years old and above.',
                tax_identification_number: "Tax Identification Number can't be longer than 25 characters.",
            },
        });
        fireEvent.change(first_name, { target: { value: '123' } });
        fireEvent.change(last_name, { target: { value: 'a' } });
        fireEvent.change(date_of_birth, { target: { value: '2021-04-13' } });
        fireEvent.change(tax_identification_number, { target: { value: '123456789012345678901234567890' } });

        expect(await screen.findByText(/letters, spaces, periods, hyphens, apostrophes only/i)).toBeInTheDocument();
        expect(await screen.findByText(/last name should be between 2 and 50 characters/i)).toBeInTheDocument();
        expect(await screen.findByText(/you must be 18 years old and above\./i)).toBeInTheDocument();
        expect(
            await screen.findByText(/tax Identification Number can't be longer than 25 characters\./i)
        ).toBeInTheDocument();
    });

    it('submit button should be enabled if TIN or tax_residence is optional in case of CR accounts', () => {
        const new_props = {
            ...mock_props,
            is_svg: true,
            value: {
                first_name: '',
                last_name: '',
                date_of_birth: '',
                place_of_birth: '',
                phone: '+34',
                tax_residence: '',
                tax_identification_number: '',
            },
        };
        renderwithRouter({ props: new_props });

        const first_name = screen.getByTestId('first_name');
        const last_name = screen.getByTestId('last_name');
        const date_of_birth = screen.getByTestId('date_of_birth');
        const phone = screen.getByTestId('phone');

        userEvent.type(first_name, 'test firstname');
        userEvent.type(last_name, 'test lastname');
        userEvent.type(date_of_birth, '2000-12-12');
        userEvent.type(phone, '+49123456789012');
        expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
    });

    it('should not display confirmation checkbox if opt-out of IDV', async () => {
        (splitValidationResultTypes as jest.Mock).mockReturnValue({ warnings: {}, errors: {} });
        const new_props = {
            ...mock_props,
            value: {
                first_name: '',
                last_name: '',
                date_of_birth: '',
                phone: '+93',
                account_opening_reason: '',
                place_of_birth: '',
            },
        };

        renderwithRouter({ props: new_props });

        const first_name = screen.getByTestId('first_name');
        const last_name = screen.getByTestId('last_name');
        const date_of_birth = screen.getByTestId('date_of_birth');
        const phone = screen.getByTestId('phone');

        userEvent.type(first_name, 'test firstname');
        userEvent.type(last_name, 'test lastname');
        userEvent.type(date_of_birth, '2000-12-12');
        userEvent.type(phone, '+49123456789012');

        const previous_btn = screen.getByRole('button', { name: /previous/i });
        const next_btn = screen.getByRole('button', { name: /next/i });

        const confirmation_checkbox = screen.queryByLabelText(
            /i confirm that the name and date of birth above match my chosen identity document/i
        );
        expect(confirmation_checkbox).not.toBeInTheDocument();

        expect(previous_btn).toBeEnabled();
        expect(next_btn).toBeEnabled();
        userEvent.click(next_btn);

        await waitFor(() => {
            expect(new_props.onSubmit).toBeCalled();
        });
    });

    it('should autopopulate tax_residence for MF clients', () => {
        const new_props = {
            ...mock_props,
            is_svg: false,
            value: {
                ...mock_props.value,
                tax_residence: 'Malta',
            },
        };
        renderwithRouter({ props: new_props });
        expect(
            screen.getByRole('textbox', {
                name: /tax residence\*/i,
            })
        ).toHaveValue('Malta');
    });

    it('should render PersonalDetails component', () => {
        renderwithRouter({});
        expect(screen.getByTestId('personal_details_form')).toBeInTheDocument();
    });

    it('should show proper salutation message when is_virtual is true', () => {
        const new_props = { ...mock_props, is_virtual: true };
        renderwithRouter({ props: new_props });

        expect(
            screen.getByText(
                /please remember that it is your responsibility to keep your answers accurate and up to date\. you can update your personal details at any time in your account settings\./i
            )
        ).toBeInTheDocument();
    });

    it('should show proper salutation message when is_virtual is false', () => {
        renderwithRouter({});

        expect(
            screen.getByText(
                /please remember that it is your responsibility to keep your answers accurate and up to date\. you can update your personal details at any time in your \./i
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /account settings/i })).toBeInTheDocument();

        fireEvent.click(screen.getByText('account settings'));

        expect(mock_props.closeRealAccountSignup).toHaveBeenCalledTimes(1);
    });

    it('should disable tax_residence field if it is immutable from BE', () => {
        const new_props = {
            ...mock_props,
            value: {
                ...mock_props.value,
                ...idv_document_data,
                tax_residence: 'France',
            },
            disabled_items: ['salutation', 'first_name', 'last_name', 'date_of_birth', 'tax_residence'],
        };
        renderwithRouter({ props: new_props });
        expect(screen.getByTestId('tax_residence')).toBeDisabled();
    });

    it('should show title and Name label when salutation is passed', () => {
        const mock_store = mockStore({
            traders_hub: {
                is_eu_user: true,
            },
        });
        renderwithRouter({ store: mock_store });

        expect(
            screen.getByRole('heading', {
                name: /title and name/i,
            })
        ).toBeInTheDocument();
    });

    it('should show Name label when salutation is not passed', () => {
        const newprops = { ...mock_props, value: {} };
        renderwithRouter({ props: newprops });

        expect(screen.getByRole('heading', { name: /details/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /title and name/i })).not.toBeInTheDocument();
    });

    it('should show salutation options', () => {
        renderwithRouter({});

        const mr_radio_btn: HTMLInputElement = screen.getByRole('radio', { name: /mr/i }) as HTMLInputElement;
        const mrs_radio_btn: HTMLInputElement = screen.getByRole('radio', { name: /ms/i }) as HTMLInputElement;
        expect(mr_radio_btn).toBeInTheDocument();
        expect(mrs_radio_btn).toBeInTheDocument();
        expect(mr_radio_btn.checked).toEqual(false);

        fireEvent.click(mr_radio_btn);

        expect(mr_radio_btn.checked).toEqual(true);
        expect(mrs_radio_btn.checked).toEqual(false);
    });

    it('should display the correct field details ', () => {
        renderwithRouter({});

        expect(screen.getByText(/first name\*/i)).toBeInTheDocument();
        expect(screen.getByText(/date of birth\*/i)).toBeInTheDocument();
        expect(screen.getByText(/phone number\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone number\*/i)).toBeInTheDocument();

        runCommonFormfieldsTests(mock_props.is_svg);
    });

    it('should display the correct field details when is_svg is true ', () => {
        renderwithRouter({});

        expect(screen.queryByRole('heading', { name: 'Details' })).toBeInTheDocument();
        expect(screen.getByText(/first name\*/i)).toBeInTheDocument();
        expect(screen.getByText(/last name\*/i)).toBeInTheDocument();
        expect(screen.getByText(/date of birth\*/i)).toBeInTheDocument();
        expect(screen.getByText(/phone number\*/i)).toBeInTheDocument();

        runCommonFormfieldsTests(mock_props.is_svg);
    });

    it('should display the correct field details when is_svg is false ', () => {
        const mock_store = mockStore({
            traders_hub: {
                is_eu_user: true,
            },
        });
        renderwithRouter({ store: mock_store });

        expect(screen.getByRole('heading', { name: 'Title and name' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'name' })).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /other details/i })).toBeInTheDocument();
        expect(screen.getByText(/first name\*/i)).toBeInTheDocument();
        expect(screen.getByText(/last name\*/i)).toBeInTheDocument();
        expect(screen.getByText(/date of birth\*/i)).toBeInTheDocument();
        expect(screen.getByText(/phone number\*/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Phone number*')).toBeInTheDocument();

        runCommonFormfieldsTests(false);
    });

    it('should not enable fields which are disabled and empty', () => {
        const new_props = {
            ...mock_props,
            disabled_items: ['salutation', 'first_name', 'last_name', 'date_of_birth', 'account_opening_reason'],
        };
        renderwithRouter({ props: new_props });
        expect(screen.getByRole('radio', { name: /mr/i })).toBeEnabled();
        expect(screen.getByRole('radio', { name: /ms/i })).toBeEnabled();
        expect(screen.getByTestId('first_name')).toBeDisabled();
        expect(screen.getByTestId('last_name')).toBeDisabled();
        expect(screen.getByTestId('date_of_birth')).toBeDisabled();
        expect(screen.getByTestId('place_of_birth')).toBeEnabled();
        expect(screen.getByTestId('citizenship')).toBeEnabled(); // citizenship value is not disabled by BE, so enable the field
    });

    it('should disable citizen field if the client is_fully_authenticated', () => {
        const new_props = {
            ...mock_props,
            is_fully_authenticated: true,
            value: {
                ...mock_props.value,
                citizen: 'france',
            },
        };
        renderwithRouter({ props: new_props });

        expect(screen.getByTestId('citizenship')).toBeDisabled();
    });

    it('should display proper data in mobile mode', () => {
        // [TODO] - Remove this when PersonalDetailsForm is migrated to TSX

        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });

        const new_props = { ...mock_props, is_svg: false };
        renderwithRouter({ props: new_props });

        expect(screen.getByRole('radio', { name: /mr/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /ms/i })).toBeInTheDocument();
        expect(screen.getByTestId('first_name')).toBeInTheDocument();
        expect(screen.getByTestId('last_name')).toBeInTheDocument();
        expect(screen.getByTestId('date_of_birth')).toBeInTheDocument();
        expect(screen.queryByTestId('place_of_birth_mobile')).toBeInTheDocument();
        expect(screen.queryByTestId('place_of_birth')).not.toBeInTheDocument();
        expect(screen.queryByTestId('citizenship_mobile')).toBeInTheDocument();
        expect(screen.queryByTestId('citizenship')).not.toBeInTheDocument();
        expect(screen.queryByTestId('phone')).toBeInTheDocument();
        expect(screen.queryByTestId('tax_residence_mobile')).toBeInTheDocument();
        expect(screen.queryByTestId('tax_residence')).not.toBeInTheDocument();
        expect(screen.getByText(/tax identification number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tax identification number/i)).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /account opening reason/i })).toBeInTheDocument();
        expect(screen.queryByTestId('dt_dropdown_display')).not.toBeInTheDocument();
        expect(screen.queryByTestId('account_opening_reason_mobile')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should select correct dropdown options in mobile mode', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

        const new_props = { ...mock_props, is_svg: false };

        renderwithRouter({ props: new_props });
        const place_of_birth_mobile = screen.queryByTestId('place_of_birth_mobile');

        expect(place_of_birth_mobile).toBeInTheDocument();

        if (place_of_birth_mobile) {
            fireEvent.change(place_of_birth_mobile, { target: { value: 'Afghanistan' } });
        }

        const { getByText } = within(screen.getAllByTestId('selected_value')[0]);
        expect(getByText('Afghanistan')).toBeInTheDocument();
    });

    it('should show error for invalid TIN', async () => {
        const newvalidate = {
            errors: {
                ...mock_errors,
                tax_identification_number: 'Tax Identification Number is not properly formatted.',
            },
        };
        (splitValidationResultTypes as jest.Mock).mockReturnValue(newvalidate);
        renderwithRouter({});
        const tax_identification_number = screen.getByTestId('tax_identification_number');

        fireEvent.blur(tax_identification_number);
        fireEvent.change(tax_identification_number, { target: { value: '123456789012345678901234567890' } });

        expect(await screen.findByText(/tax identification number is not properly formatted/i)).toBeInTheDocument();
    });

    it('should submit the form if there is no validation error on desktop', async () => {
        (splitValidationResultTypes as jest.Mock).mockReturnValue({ warnings: {}, errors: {} });
        const new_props = {
            ...mock_props,
            value: {
                first_name: '',
                last_name: '',
                date_of_birth: '',
                phone: '+93',
            },
        };

        renderwithRouter({ props: new_props });

        const first_name = screen.getByTestId('first_name');
        const last_name = screen.getByTestId('last_name');
        const date_of_birth = screen.getByTestId('date_of_birth');
        const phone = screen.getByTestId('phone');

        fireEvent.change(first_name, { target: { value: 'test firstname' } });
        fireEvent.change(last_name, { target: { value: 'test lastname' } });
        fireEvent.change(date_of_birth, { target: { value: '2000-12-12' } });
        fireEvent.change(phone, { target: { value: '+931234567890' } });

        const previous_btn = screen.getByRole('button', { name: /previous/i });
        const next_btn = screen.getByRole('button', { name: /next/i });

        const checkbox = screen.queryByLabelText(
            /i confirm that the name and date of birth above match my chosen identity document/i
        );
        expect(checkbox).not.toBeInTheDocument();

        expect(previous_btn).toBeEnabled();
        expect(next_btn).toBeEnabled();
        fireEvent.click(next_btn);

        await waitFor(() => {
            expect(new_props.onSubmit).toBeCalled();
        });
    });

    it('should submit the form if there is no validation error on mobile', async () => {
        // [TODO] - Remove this when PersonalDetailsForm is migrated to TSX
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

        (splitValidationResultTypes as jest.Mock).mockReturnValue({ warnings: {}, errors: {} });
        const new_props = {
            ...mock_props,
            is_svg: false,
            value: {
                account_opening_reason: '',
                citizen: '',
                date_of_birth: '',
                first_name: '',
                last_name: '',
                phone: '+49',
                place_of_birth: '',
                salutation: '',
                tax_identification_confirm: false,
                tax_identification_number: '',
                tax_residence: '',
            },
        };

        renderwithRouter({ props: new_props });

        const mr_radio_btn = screen.getByRole('radio', { name: /mr/i }) as HTMLInputElement;
        const first_name = screen.getByTestId('first_name');
        const last_name = screen.getByTestId('last_name');
        const date_of_birth = screen.getByTestId('date_of_birth');
        const place_of_birth_mobile = screen.getByTestId('place_of_birth_mobile');
        const citizenship = screen.getByTestId('citizenship_mobile');
        const phone = screen.getByTestId('phone');
        const tax_residence_mobile = screen.getByTestId('tax_residence_mobile');
        const tax_identification_number = screen.getByTestId('tax_identification_number');
        const tax_identification_confirm = screen.getByTestId('tax_identification_confirm');
        const account_opening_reason_mobile = screen.getByTestId('account_opening_reason_mobile');

        const checkbox = screen.queryByLabelText(
            /i confirm that the name and date of birth above match my chosen identity document/i
        );
        expect(checkbox).not.toBeInTheDocument();

        fireEvent.click(mr_radio_btn);
        fireEvent.change(first_name, { target: { value: 'test firstname' } });
        fireEvent.change(last_name, { target: { value: 'test lastname' } });
        fireEvent.change(date_of_birth, { target: { value: '2000-12-12' } });
        fireEvent.change(place_of_birth_mobile, { target: { value: 'Albania' } });
        fireEvent.change(citizenship, { target: { value: 'Albania' } });
        fireEvent.change(phone, { target: { value: '+49123456789012' } });
        fireEvent.change(tax_residence_mobile, { target: { value: 'Afghanistan' } });
        fireEvent.change(tax_identification_number, { target: { value: '123123123123' } });
        fireEvent.change(tax_identification_confirm, { target: { value: true } });
        fireEvent.change(account_opening_reason_mobile, { target: { value: 'Income Earning' } });

        expect(mr_radio_btn.checked).toEqual(true);
        const next_btn = screen.getByRole('button', { name: /next/i });

        expect(next_btn).toBeEnabled();
        fireEvent.click(next_btn);

        await waitFor(() => {
            expect(new_props.onSubmit).toBeCalled();
        });
    });

    it('should save filled date when cancel button is clicked ', async () => {
        (splitValidationResultTypes as jest.Mock).mockReturnValue({ warnings: {}, errors: {} });
        const new_props = {
            ...mock_props,
            value: {
                first_name: '',
                last_name: '',
            },
        };

        renderwithRouter({ props: new_props });

        const first_name = screen.getByTestId('first_name');
        const last_name = screen.getByTestId('last_name');

        fireEvent.change(first_name, { target: { value: 'test firstname' } });
        fireEvent.change(last_name, { target: { value: 'test lastname' } });

        const previous_btn = screen.getByRole('button', { name: /previous/i });
        expect(previous_btn).toBeEnabled();
        fireEvent.click(previous_btn);

        await waitFor(() => {
            expect(mock_props.onSave).toBeCalledWith(0, { first_name: 'test firstname', last_name: 'test lastname' });
        });
    });

    it('should close tax_residence pop-over when clicked outside', () => {
        const new_props = { ...mock_props, is_svg: false };
        renderwithRouter({ props: new_props });

        const tax_residence_pop_over = screen.getByTestId('tax_residence_pop_over');
        expect(tax_residence_pop_over).toBeInTheDocument();

        fireEvent.click(tax_residence_pop_over);
        expect(screen.getByText(tax_residence_pop_over_text)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('heading', { name: /account opening reason/i }));

        expect(screen.queryByText(tax_residence_pop_over_text)).not.toBeInTheDocument();
    });

    it('should close tax_identification_number_pop_over when clicked outside', () => {
        const new_props = { ...mock_props, is_svg: false };
        renderwithRouter({ props: new_props });

        const tin_pop_over = screen.getByTestId('tax_identification_number_pop_over');
        expect(tin_pop_over).toBeInTheDocument();
        fireEvent.click(tin_pop_over);

        expect(screen.getByText(tin_pop_over_text)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'here' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('heading', { name: /account opening reason/i }));

        expect(screen.queryByText(tin_pop_over_text)).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'here' })).not.toBeInTheDocument();
    });

    it('should close tax_residence pop-over when scrolled', () => {
        renderwithRouter({});

        const tax_residence_pop_over = screen.getByTestId('tax_residence_pop_over');
        expect(tax_residence_pop_over).toBeInTheDocument();
        fireEvent.click(tax_residence_pop_over);

        expect(screen.getByText(tax_residence_pop_over_text)).toBeInTheDocument();

        fireEvent.scroll(screen.getByTestId('dt_personal_details_container'), {
            target: { scrollY: 100 },
        });

        expect(screen.queryByText(tax_residence_pop_over_text)).not.toBeInTheDocument();
    });

    it('should close tax_identification_number_pop_over when scrolled', () => {
        renderwithRouter({});

        const tax_identification_number_pop_over = screen.getByTestId('tax_identification_number_pop_over');
        expect(tax_identification_number_pop_over).toBeInTheDocument();
        fireEvent.click(tax_identification_number_pop_over);
        expect(screen.getByText(tin_pop_over_text)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'here' })).toBeInTheDocument();

        fireEvent.scroll(screen.getByTestId('dt_personal_details_container'), {
            target: { scrollY: 100 },
        });

        expect(screen.queryByText(tax_residence_pop_over_text)).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'here' })).not.toBeInTheDocument();
    });

    it('should validate idv values when a document type is selected', async () => {
        (shouldShowIdentityInformation as jest.Mock).mockReturnValue(true);
        const new_props = {
            ...mock_props,
            value: {
                ...mock_props.value,
                ...idv_document_data,
            },
            residence_list: default_residence_details as any,
        };
        renderwithRouter({ props: new_props });

        await waitFor(() => {
            expect(isDocumentTypeValid).toHaveBeenCalled();
            expect(isAdditionalDocumentValid).not.toHaveBeenCalled();
        });
    });

    it('should validate idv values along with additional document number when a document type is selected', async () => {
        (shouldShowIdentityInformation as jest.Mock).mockReturnValue(true);

        const new_document_data = {
            ...idv_document_data,
            document_type: {
                ...idv_document_data.document_type,
                additional: {
                    display_name: '12345',
                },
            },
        };

        const new_props = {
            ...mock_props,
            value: {
                ...mock_props.value,
                ...new_document_data,
            },
            residence_list: default_residence_details,
        };
        renderwithRouter({ props: new_props });

        await waitFor(() => {
            expect(isAdditionalDocumentValid).toHaveBeenCalled();
        });
    });
});
