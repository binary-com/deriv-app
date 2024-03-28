import { personal_details_config } from 'Configs/personal-details-config';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getErrorMessages: jest.fn().mockReturnValue({
        name: jest.fn(),
        password: jest.fn(),
    }),
    generateValidationFunction: jest.fn(),
    getDefaultFields: jest.fn(),
    toMoment: jest.fn(),
    validLength: jest.fn(),
}));

describe('personal-details-config', () => {
    const mock_props: Parameters<typeof personal_details_config>[0] = {
        residence_list: [
            {
                phone_idd: '62',
                text: 'Indonesia',
                value: 'is',
                tin_format: [],
                disabled: '1',
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
                                residence_permit: {
                                    display_name: 'Residence Permit',
                                },
                            },
                            is_country_supported: 1,
                        },
                    },
                },
            },
        ],
        account_settings: {
            tax_residence: 'id',
            residence: 'Indonesia',
            document_type: '',
            document_number: '',
        },
        real_account_signup_target: 'maltainvest',
        account_status: {
            p2p_poa_required: 0,
            cashier_validation: ['system_maintenance'],
            currency_config: {
                USD: {
                    is_deposit_suspended: 0,
                    is_withdrawal_suspended: 0,
                },
            },
            p2p_status: 'active',
            prompt_client_to_authenticate: 0,
            risk_classification: '',
            status: [''],
        },
        residence: 'af',
    };

    it('should return account tax residence as default value if it is already set', () => {
        const personal_details = personal_details_config(mock_props);
        expect(personal_details.tax_residence.default_value).toEqual('Indonesia');
    });

    it('should return residence as the default value for MF clients, If the account tax residence is not set', () => {
        const new_props = {
            ...mock_props,
            account_settings: {
                ...mock_props.account_settings,
                tax_residence: '',
            },
        };
        const personal_details = personal_details_config(new_props);
        expect(personal_details.tax_residence.default_value).toEqual(new_props.account_settings.residence);
    });

    it('should not set default value for CR clients, If the account tax residence is not set', () => {
        const new_props = {
            ...mock_props,
            real_account_signup_target: 'svg',
            account_settings: {
                ...mock_props.account_settings,
                tax_residence: '',
            },
        };
        const personal_details = personal_details_config(new_props);
        expect(personal_details.tax_residence.default_value).toEqual('');
    });

    it('should include svg in additional fields if client is not high risk for mt5', () => {
        const new_props = {
            ...mock_props,
            real_account_signup_target: 'svg',
        };
        const personal_details = personal_details_config(new_props);
        const additional_fields = [
            'place_of_birth',
            'tax_residence',
            'tax_identification_number',
            'account_opening_reason',
        ];
        additional_fields.forEach(field => {
            expect(personal_details[field].supported_in).toContain('svg');
        });
    });
});
