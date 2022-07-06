import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDFinancialStpRealAccountSignup from '../cfd-financial-stp-real-account-signup';
import { localize } from '@deriv/translations';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    FormSubHeader: () => <div>FormSubHeader</div>,
}));

jest.mock('../../Components/cfd-personal-details-form', () => jest.fn(() => <div>CFDPersoinalDetails</div>));
jest.mock('../../Components/cfd-poa', () => jest.fn(() => <div>CFDPOA</div>));
jest.mock('../../Components/cfd-poi', () => jest.fn(() => <div>CFDPOI</div>));

describe('<CFDFinancialStpRealAccountSignup />', () => {
    const getSteps = screen => {
        const personal_details = screen.getByText('Personal details');
        const proof_of_identity = screen.getByText('Proof of identity');
        const proof_of_address = screen.getByText('Proof of address');

        return {
            step1: personal_details.parentElement.firstChild,
            step2: proof_of_identity.parentElement.firstChild,
            step3: proof_of_address.parentElement.firstChild,
        };
    };

    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        let modal_root_el = document.getElementById('modal_root');
        document.body.removeChild(modal_root_el);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mock_props = {
        addNotificationByKey: jest.fn(),
        openPendingDialog: jest.fn(),
        refreshNotifications: jest.fn(),
        removeNotificationByKey: jest.fn(),
        removeNotificationMessage: jest.fn(),
        storeProofOfAddress: jest.fn(),
        toggleModal: jest.fn(),
        authentication_status: {
            document_status: 'none',
            identity_status: 'none',
        },
        client_email: 'mock@gmail.com',
        get_settings: {
            account_opening_reason: '',
            address_city: 'MUDGEERABA',
            address_line_1: "29 Ross Street, .'",
            address_line_2: ".'",
            address_postcode: '111',
            address_state: '',
            allow_copiers: 0,
            citizen: '',
            client_tnc_status: 'Version 4.2.0 2020-08-07',
            country: 'Singapore',
            country_code: 'sg',
            date_of_birth: 984960000,
            email: 'mock@gmail.com',
            email_consent: 1,
            feature_flag: {
                wallet: 0,
            },
            first_name: 'mahdiyeh',
            has_secret_answer: 1,
            immutable_fields: ['residence'],
            is_authenticated_payment_agent: 0,
            last_name: 'am',
            non_pep_declaration: 1,
            phone: '+651213456',
            place_of_birth: null,
            preferred_language: 'EN',
            request_professional_status: 0,
            residence: 'Singapore',
            salutation: '',
            tax_identification_number: null,
            tax_residence: null,
            user_hash: '823341c18bfccb391b6bb5d77ab7e6a83991f82669c1ba4e5b01dbd2fd71c7fe',
        },
        is_fully_authenticated: true,
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
                                passport: {
                                    display_name: 'Passport',
                                },
                            },
                            is_country_supported: 0,
                        },
                    },
                },
                phone_idd: '93',
                text: 'Afghanistan',
                value: 'af',
            },
        ],
        states_list: {
            text: 'Central Singapore',
            value: '01',
        },
    };

    it('should render CFDFinancialStpRealAccountSignup component', () => {
        render(<CFDFinancialStpRealAccountSignup {...mock_props} />);

        expect(screen.getByTestId('dt_cfd_financial_stp_modal_heading')).toBeInTheDocument();
    });

    it('should show headers properly', () => {
        render(<CFDFinancialStpRealAccountSignup {...mock_props} />);

        expect(screen.getByText('Complete your personal details')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('Personal details')).toBeInTheDocument();
        expect(screen.getByText('Proof of identity')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Proof of address')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should render properly for the first step content', () => {
        render(<CFDFinancialStpRealAccountSignup {...mock_props} />);
        const { step1, step2, step3 } = getSteps(screen);

        expect(step1).toHaveClass('identifier--active');
        expect(step2).not.toHaveClass('identifier--active');
        expect(step3).not.toHaveClass('identifier--active');
    });

    it('should render properly for the second step content', () => {
        jest.spyOn(React, 'useState').mockReturnValueOnce([1, () => {}]);
        render(<CFDFinancialStpRealAccountSignup {...mock_props} />);

        const { step1, step2, step3 } = getSteps(screen);

        expect(step1).toHaveClass('identifier--active');
        expect(step2).toHaveClass('identifier--active');
        expect(step3).not.toHaveClass('identifier--active');
    });

    it('should render properly for the third step content', () => {
        jest.spyOn(React, 'useState').mockReturnValueOnce([2, () => {}]);
        render(<CFDFinancialStpRealAccountSignup {...mock_props} />);

        const { step1, step2, step3 } = getSteps(screen);
        expect(step1).toHaveClass('identifier--active');
        expect(step2).toHaveClass('identifier--active');
        expect(step3).toHaveClass('identifier--active');
    });
});
