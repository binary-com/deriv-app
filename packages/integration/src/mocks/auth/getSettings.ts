import { Context } from '../../utils/mocks/mocks';

export default function mockGetSettings(context: Context) {
    if ('get_settings' in context.request && context.request.get_settings === 1) {
        context.response = {
            echo_req: {
                get_settings: 1,
                req_id: context.req_id,
            },
            get_settings: {
                account_opening_reason: '',
                address_city: 'test',
                address_line_1: 'test',
                address_line_2: '',
                address_postcode: '',
                address_state: '',
                allow_copiers: 0,
                citizen: 'th',
                client_tnc_status: 'Version 4.2.0 2020-08-07',
                country: 'Thailand',
                country_code: 'th',
                date_of_birth: 315532859,
                dxtrade_user_exception: 0,
                email: 'jane.smith@example.com',
                email_consent: 1,
                feature_flag: {
                    wallet: 0,
                },
                first_name: 'Jane',
                has_secret_answer: 1,
                immutable_fields: ['residence'],
                is_authenticated_payment_agent: 0,
                last_name: 'Smith',
                non_pep_declaration: 1,
                phone: '+66111111111',
                phone_number_verification: {
                    next_attempt: 0,
                    verified: 0,
                },
                place_of_birth: 'Thailand',
                preferred_language: 'EN',
                request_professional_status: 0,
                residence: 'Thailand',
                salutation: '',
                tax_identification_number: null,
                tax_residence: null,
                trading_hub: 0,
                user_hash: 'kYk8h4q605qCEBgOdiarruohRrFZemZwhgkHedMQEQ6EDhEgScm25lFIK42dSMK5',
            },
            msg_type: 'get_settings',
            req_id: context.req_id,
        };
    }
}
