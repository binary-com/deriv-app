// TODO: Mock data only for testing.
export const idv_unsupported_pob = {
    echo_req: { get_account_status: 1, req_id: 6 },
    get_account_status: {
        authentication: {
            attempts: {
                count: 3,
                history: [
                    {
                        country_code: 'aq',
                        id: '4733c3d7-df0b-42be-ab06-967b9033bc2f',
                        service: 'onfido',
                        status: 'verified',
                        timestamp: 1626345707,
                    },
                    { country_code: 'ke', id: '25', service: 'idv', status: 'rejected', timestamp: 1626328805 },
                    { country_code: 'ke', id: '23', service: 'idv', status: 'rejected', timestamp: 1626328148 },
                ],
                latest: {
                    country_code: 'aq',
                    id: '4733c3d7-df0b-42be-ab06-967b9033bc2f',
                    service: 'idv',
                    status: 'rejected',
                    timestamp: 1626345707,
                },
            },
            document: { status: 'none' },
            identity: {
                expiry_date: 1893456000,
                services: {
                    idv: { last_rejected: [], reported_properties: {}, status: 'rejected', submissions_left: 0 },
                    manual: { status: 'pending' },
                    onfido: {
                        country_code: 'GBR',
                        documents_supported: ['Passport'],
                        is_country_supported: 1,
                        last_rejected: [],
                        reported_properties: { first_name: 'melika', last_name: 'mahi' },
                        status: 'none',
                        submissions_left: 3,
                    },
                },
                status: 'pending',
            },
            needs_verification: [],
        },
        currency_config: { USD: { is_deposit_suspended: 0, is_withdrawal_suspended: 0 } },
        prompt_client_to_authenticate: 0,
        risk_classification: 'low',
        status: [
            'allow_document_upload',
            'financial_information_not_complete',
            'trading_experience_not_complete',
            'trading_password_required',
        ],
    },
    msg_type: 'get_account_status',
    req_id: 6,
};

export const idv_supported_pob = {
    echo_req: { get_account_status: 1, req_id: 6 },
    get_account_status: {
        authentication: {
            attempts: {
                count: 2,
                history: [
                    { country_code: 'gh', id: '31', service: 'idv', status: 'rejected', timestamp: 1626334125 },
                    { country_code: 'gh', id: '29', service: 'idv', status: 'rejected', timestamp: 1626334048 },
                ],
                latest: { country_code: 'gh', id: '31', service: 'idv', status: 'rejected', timestamp: 1626334125 },
            },
            document: { status: 'none' },
            identity: {
                services: {
                    idv: { last_rejected: [], reported_properties: {}, status: 'rejected', submissions_left: 0 },
                    manual: { status: 'none' },
                    onfido: {
                        country_code: 'IND',
                        documents_supported: [
                            'National Identity Card (Aadhaar Card)',
                            'Passport',
                            'Tax Id (PAN Card)',
                            'Voter Id',
                        ],
                        is_country_supported: 1,
                        last_rejected: [],
                        reported_properties: {},
                        status: 'none',
                        submissions_left: 3,
                    },
                },
                status: 'rejected',
            },
            needs_verification: ['identity'],
        },
        currency_config: { EUR: { is_deposit_suspended: 0, is_withdrawal_suspended: 0 } },
        prompt_client_to_authenticate: 0,
        risk_classification: 'low',
        status: [
            'allow_document_upload',
            'financial_information_not_complete',
            'trading_experience_not_complete',
            'trading_password_required',
        ],
    },
    msg_type: 'get_account_status',
    req_id: 6,
};

export const idv_uk_new = {
    echo_req: { get_account_status: 1, req_id: 18 },
    get_account_status: {
        authentication: {
            attempts: { count: 0, history: [], latest: null },
            document: { status: 'none' },
            identity: {
                services: {
                    idv: { last_rejected: [], reported_properties: {}, status: 'none', submissions_left: 2 },
                    manual: { status: 'none' },
                    onfido: {
                        country_code: 'GBR',
                        documents_supported: [
                            'Asylum Registration Card',
                            'Certificate of Naturalisation',
                            'Driving Licence',
                            'Home Office Letter',
                            'Immigration Status Document',
                            'Passport',
                            'Residence Permit',
                            'Visa',
                        ],
                        is_country_supported: 1,
                        last_rejected: [],
                        reported_properties: {},
                        status: 'none',
                        submissions_left: 3,
                    },
                },
                status: 'none',
            },
            needs_verification: ['document', 'identity'],
        },
        cashier_validation: ['ASK_SELF_EXCLUSION_MAX_TURNOVER_SET', 'ASK_UK_FUNDS_PROTECTION', 'unwelcome_status'],
        currency_config: { USD: { is_deposit_suspended: 0, is_withdrawal_suspended: 0 } },
        prompt_client_to_authenticate: 1,
        risk_classification: 'low',
        status: [
            'allow_document_upload',
            'cashier_locked',
            'financial_information_not_complete',
            'max_turnover_limit_not_set',
            'trading_experience_not_complete',
            'trading_password_required',
            'unwelcome',
        ],
    },
    msg_type: 'get_account_status',
    req_id: 18,
};

// idv_none - Initial document verification for idv supported country
// idv_none_poa - Initial document verification for idv supported country that needs POA
// idv_result_pass - Idv verification pass
// idv_result_pass_poa - Idv verification pass and needs POA
// idv_result_expired - Idv verification expired
// idv_result_rejected - Idv verification rejected have submissions left
// idv_result_rejected_limited - Idv verification rejected but no submissions left
// Usage Guide:
// const account_status = figmaAccountStatus('idv_result_rejected_limited');
export const figmaAccountStatus = type => {
    switch (type) {
        case 'idv_none': {
            return {
                authentication: {
                    attempts: {
                        latest: null,
                        count: 0,
                    },
                    document: {
                        status: 'none',
                    },
                    identity: {
                        services: {
                            idv: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                country_code: 'GBR',
                                documents_supported: [
                                    'Asylum Registration Card',
                                    'Certificate of Naturalisation',
                                    'Driving Licence',
                                    'Home Office Letter',
                                    'Immigration Status Document',
                                    'Passport',
                                    'Residence Permit',
                                    'Visa',
                                ],
                                is_country_supported: 1,
                                last_rejected: [],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        status: 'none',
                    },
                    needs_verification: ['identity'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_none_poa': {
            return {
                authentication: {
                    attempts: {
                        latest: null,
                        count: 0,
                    },
                    document: {
                        status: 'none',
                    },
                    identity: {
                        services: {
                            idv: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                country_code: 'GBR',
                                documents_supported: [
                                    'Asylum Registration Card',
                                    'Certificate of Naturalisation',
                                    'Driving Licence',
                                    'Home Office Letter',
                                    'Immigration Status Document',
                                    'Passport',
                                    'Residence Permit',
                                    'Visa',
                                ],
                                is_country_supported: 1,
                                last_rejected: [],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        status: 'none',
                    },
                    needs_verification: ['identity', 'document'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_result_pass': {
            return {
                authentication: {
                    attempts: {
                        latest: {
                            id: 1,
                            service: 'idv',
                            country_code: 'za',
                            time: 166321,
                        },
                        count: 0,
                    },
                    document: {
                        status: 'none',
                    },
                    identity: {
                        services: {
                            idv: {
                                reported_properties: {},
                                status: 'verified',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        status: 'verified',
                    },
                    needs_verification: ['identity'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_result_pass_poa': {
            return {
                authentication: {
                    attempts: {
                        latest: {
                            id: 1,
                            service: 'idv',
                            country_code: 'za',
                            time: 166321,
                        },
                        count: 0,
                    },
                    document: {
                        status: 'none',
                    },
                    identity: {
                        services: {
                            idv: {
                                reported_properties: {},
                                status: 'verified',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        status: 'verified',
                    },
                    needs_verification: ['identity', 'document'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_result_expired': {
            return {
                authentication: {
                    attempts: {
                        latest: {
                            id: 1,
                            service: 'idv',
                            country_code: 'za',
                            time: 166321,
                        },
                        count: 0,
                    },
                    document: {
                        status: 'none',
                    },
                    identity: {
                        services: {
                            idv: {
                                reported_properties: {},
                                status: 'expired',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        status: 'expired',
                    },
                    needs_verification: ['identity'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_result_rejected': {
            return {
                authentication: {
                    attempts: {
                        latest: {
                            id: 1,
                            service: 'idv',
                            country_code: 'za',
                            time: 166321,
                        },
                        count: 1,
                    },
                    document: {
                        status: 'pending',
                    },
                    identity: {
                        services: {
                            idv: {
                                last_rejected: [],
                                reported_properties: {},
                                status: 'rejected',
                                submissions_left: 2,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                // last_rejected: [
                                //     'The document you provided is not supported for your country. Please provide a supported document for your country.',
                                //     "Your selfie isn't clear. Please take a clearer photo and try again. Ensure that there's enough light where you are and that your entire face is in the frame.",
                                // ],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        status: 'rejected',
                    },
                    needs_verification: ['identity'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        case 'idv_result_rejected_limited': {
            return {
                authentication: {
                    attempts: {
                        latest: {
                            id: 1,
                            service: 'idv',
                            country_code: 'za',
                            time: 166321,
                        },
                        count: 1,
                    },
                    document: {
                        status: 'pending',
                    },
                    identity: {
                        services: {
                            idv: {
                                last_rejected: [],
                                reported_properties: {},
                                status: 'rejected',
                                submissions_left: 0,
                            },
                            manual: {
                                status: 'none',
                            },
                            onfido: {
                                // last_rejected: [
                                //     'The document you provided is not supported for your country. Please provide a supported document for your country.',
                                //     "Your selfie isn't clear. Please take a clearer photo and try again. Ensure that there's enough light where you are and that your entire face is in the frame.",
                                // ],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        status: 'rejected',
                    },
                    needs_verification: ['identity'],
                },
                cashier_validation: [
                    'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET',
                    'ASK_UK_FUNDS_PROTECTION',
                    'unwelcome_status',
                ],
                currency_config: {
                    GBP: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                prompt_client_to_authenticate: 1,
                risk_classification: 'low',
                status: [
                    'allow_document_upload',
                    'cashier_locked',
                    'document_under_review',
                    'financial_information_not_complete',
                    'max_turnover_limit_not_set',
                    'trading_experience_not_complete',
                    'trading_password_required',
                    'unwelcome',
                ],
            };
        }
        default:
            return {};
    }
};
