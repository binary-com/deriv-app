import { GetSettings, ResidenceList } from '@deriv/api-types';
import { filterDisabledPositions, formatPortfolioPosition, isVerificationServiceSupported } from '../format-response';
import { LocalStore } from '../../storage';
import { getContractTypeFeatureFlag } from '../../constants';

jest.mock('../../constants', () => ({
    ...jest.requireActual('../../constants'),
    getContractTypeFeatureFlag: jest.fn(() => 'rise_fall'),
}));
jest.mock('../../storage', () => ({
    ...jest.requireActual('../../storage'),
    LocalStore: {
        getObject: jest.fn(() => ({ data: { rise_fall: false } })),
    },
}));

describe('format-response', () => {
    const mock_active_symbols = [{ display_name: 'Volatility 25 Index', symbol: 'R_25' }];
    const portfolio_pos = {
        buy_price: 2500.5,
        contract_id: 1234,
        contract_type: 'ASIANU',
        longcode: 'test \n test \n test',
        payout: 3500.1,
        symbol: 'R_25',
        shortcode: 'ASIANU_R_25_',
        transaction_id: 5678,
    };

    const get_settings: GetSettings = {
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
        first_name: 'deriv',
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
        user_hash: 'mock_hash',
    };

    const residence_list: ResidenceList = [
        {
            disabled: 'DISABLED',
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
            phone_idd: '65',
            text: 'Singapore',
            tin_format: [
                '^[SsTtFfGg]\\d{7}[A-Za-z]$',
                '^[A-Za-z]{9,10}$',
                '^[Ff]0000\\d{6}$',
                '^[Ff]\\d{9}$',
                '^([Ss]|[Tt][4])\\d{9}$',
                '^[Aa]\\d{9}$',
            ],
            value: 'sg',
        },
    ];

    it('should return an object with values in object passed as argument to formatPortfolioPosition', () => {
        expect(formatPortfolioPosition(portfolio_pos, mock_active_symbols)).toEqual({
            details: 'test <br /> test <br /> test',
            display_name: 'Volatility 25 Index',
            id: 1234,
            indicative: 0,
            is_unsupported: false,
            payout: 3500.1,
            contract_update: undefined,
            purchase: 2500.5,
            reference: +5678,
            type: 'ASIANU',
            contract_info: portfolio_pos,
        });
    });
    it('should return true if residence is in the list of supported countries for onfido', () => {
        expect(isVerificationServiceSupported(residence_list, get_settings, 'onfido')).toBeTruthy();
    });
    describe('filterDisabledPositions', () => {
        const position = {
            contract_type: 'CALL',
            shortcode: 'CALL_1HZ100V_19.53_1695913929_5T_S0P_0',
        };
        it('should return false if a feature flag for position.contract_type is disabled', () => {
            (LocalStore.getObject as jest.Mock).mockReturnValueOnce({ data: { rise_fall: false } });
            expect(filterDisabledPositions(position)).toBeFalsy();
        });
        it('should return true if a feature flag for position.contract_type is enabled', () => {
            (LocalStore.getObject as jest.Mock).mockReturnValueOnce({ data: { rise_fall: true } });
            expect(filterDisabledPositions(position)).toBeTruthy();
        });
        it('should return true if a feature flag for position.contract_type is not defined', () => {
            (getContractTypeFeatureFlag as jest.Mock).mockReturnValueOnce(undefined);
            expect(filterDisabledPositions(position)).toBeTruthy();
        });
        it(`should return true if a feature flag for transaction contract category is enabled
            based on shortcode when contract_type property is missing`, () => {
            const transaction = {
                shortcode: 'CALL_1HZ100V_19.53_1695913929_5T_S0P_0',
            };
            (LocalStore.getObject as jest.Mock).mockReturnValueOnce({ data: { rise_fall: true } });
            expect(filterDisabledPositions(transaction)).toBeTruthy();
        });
    });
});
