import React from 'react';
import {
    formatDate,
    getStaticUrl,
    getUrlBase,
    isEmptyObject,
    isMobile,
    LocalStore,
    routes,
    State,
    website_name,
    platform_name,
} from '@deriv/shared';
import { StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { BinaryLink } from 'App/Components/Routes';
import { WS } from 'Services';

// TODO: Update links to app_2 links when components are done.
/* eslint-disable react/jsx-no-target-blank */
export const clientNotifications = (ui = {}, client = {}) => {
    const notifications = {
        dp2p: {
            key: 'dp2p',
            header: localize('Payment problems?'),
            message: localize('There’s an app for that'),
            primary_btn: {
                text: localize('Learn more'),
                onClick: () => {
                    window.open(getStaticUrl('/p2p/v1'), '_blank');
                },
            },
            secondary_btn: { text: localize('Skip') },
            img_src: getUrlBase('/public/images/common/dp2p_banner.png'),
            img_alt: 'DP2P',
            type: 'news',
        },
        currency: {
            action: {
                text: localize('Set currency'),
                onClick: () => {
                    ui.toggleNotificationsModal();
                    ui.openRealAccountSignup('set_currency');
                },
            },
            key: 'currency',
            header: localize('Set account currency'),
            message: localize('Please set the currency of your account to enable trading.'),
            type: 'danger',
        },
        self_exclusion: excluded_until => {
            let message, header, action;
            if (client.is_uk) {
                header = localize('You’re taking a break from trading');
                message = (
                    <Localize
                        i18n_default_text='You chose to exclude yourself from trading until {{exclusion_end}}. If you want to remove this self-exclusion, you can do so after {{exclusion_end}} by contacting Customer Support at +447723580049.'
                        values={{
                            exclusion_end: formatDate(excluded_until, 'DD/MM/YYYY'),
                            interpolation: { escapeValue: false },
                        }}
                    />
                );
            } else if (client.is_eu) {
                action = {
                    onClick: () => window.LC_API.open_chat_window(),
                    text: localize('Chat now'),
                };
                header = localize('You’re taking a break from trading');
                message = (
                    <Localize
                        i18n_default_text='You chose to exclude yourself from trading until {{exclusion_end}}. If you want to remove this self-exclusion, you can do so at any time by contacting Customer Support via chat.'
                        values={{
                            exclusion_end: formatDate(excluded_until, 'DD/MM/YYYY'),
                            interpolation: { escapeValue: false },
                        }}
                    />
                );
            } else {
                header = localize('Self-exclusion detected');
                message = (
                    <Localize
                        i18n_default_text='You have opted to be excluded from {{website_domain}} until {{exclusion_end}}. Please <0>contact us</0> for assistance.'
                        values={{
                            website_domain: website_name,
                            exclusion_end: formatDate(excluded_until, 'DD/MM/YYYY'),
                            interpolation: { escapeValue: false },
                        }}
                        components={[<StaticUrl key={0} className='link' href='contact-us' />]}
                    />
                );
            }
            return {
                key: 'self_exclusion',
                header,
                message,
                action,
                type: 'danger',
            };
        },
        authenticate: {
            action: {
                route: routes.proof_of_identity,
                text: localize('Authenticate'),
            },
            key: 'authenticate',
            header: localize('Account authentication'),
            message: localize('Authenticate your account now to take full advantage of all payment methods available.'),
            type: 'info',
        },
        cashier_locked: {
            key: 'cashier_locked',
            header: localize('Cashier disabled'),
            message: (
                <Localize
                    i18n_default_text='We’re updating our cashier system and it’ll be back online soon. Please see our <0>status page</0> for updates.'
                    components={[
                        <a
                            key={0}
                            className='link'
                            rel='noopener noreferrer'
                            target='_blank'
                            href='https://deriv.statuspage.io/'
                        />,
                    ]}
                />
            ),
            type: 'warning',
        },
        system_maintenance: {
            key: 'system_maintenance',
            header: localize('System Maintenance'),
            message: (
                <Localize
                    i18n_default_text='We’re updating our cashier system and it’ll be back online soon. Please see our <0>status page</0> for updates.'
                    components={[
                        <a
                            key={0}
                            className='link'
                            rel='noopener noreferrer'
                            target='_blank'
                            href='https://deriv.statuspage.io/'
                        />,
                    ]}
                />
            ),
            type: 'warning',
        },
        withdrawal_locked_review: {
            key: 'withdrawal_locked_review',
            header: localize('Withdrawal disabled'),
            message: localize(
                'Withdrawals have been disabled on your account. Please wait until your uploaded documents are verified.'
            ),
            type: 'warning',
        },
        withdrawal_locked: {
            key: 'withdrawal_locked',
            header: localize('Withdrawal disabled'),
            message: localize(
                'Withdrawals have been disabled on your account. Please check your email for more details.'
            ),
            type: 'warning',
        },
        mt5_withdrawal_locked: {
            key: 'mt5_withdrawal_locked',
            header: localize('MT5 withdrawal disabled'),
            message: localize(
                'MT5 withdrawals have been disabled on your account. Please check your email for more details.'
            ),
            type: 'warning',
        },
        document_needs_action: {
            key: 'document_needs_action',
            header: localize('Authentication failed'),
            message: (
                <Localize
                    i18n_default_text='<0>Your Proof of Identity or Proof of Address</0> did not meet our requirements. Please check your email for further instructions.'
                    components={[<BinaryLink key={0} className='link' to={routes.proof_of_identity} />]}
                />
            ),
            type: 'warning',
        },
        unwelcome: {
            ...(isMobile() && {
                action: {
                    text: localize('Contact us'),
                    onClick: ({ is_dashboard }) => {
                        window.open(getStaticUrl('contact-us', { is_dashboard }));
                    },
                },
            }),
            key: 'unwelcome',
            header: localize('Trading and deposits disabled'),
            message: isMobile() ? (
                <Localize i18n_default_text='Trading and deposits have been disabled on your account. Kindly contact customer support for assistance.' />
            ) : (
                <Localize
                    i18n_default_text='Trading and deposits have been disabled on your account. Kindly contact <0>customer support</0> for assistance.'
                    components={[<StaticUrl key={0} className='link' href='contact-us' />]}
                />
            ),
            type: 'danger',
        },
        max_turnover_limit_not_set: {
            key: 'max_turnover_limit_not_set',
            header: localize('Remove deposit limits'),
            message: (
                <Localize
                    i18n_default_text='Please set your <0>30-day turnover limit</0> to remove deposit limits.'
                    components={[<BinaryLink key={0} className='link' to={routes.cashier_deposit} />]}
                />
            ),
            type: 'danger',
        },
        risk: {
            action: {
                text: localize('Complete form'),
                route: routes.financial_assessment,
            },
            key: 'risk',
            header: localize('Withdrawal and trading limits'),
            message: localize(
                'Please complete the Financial Assessment form to lift your withdrawal and trading limits.'
            ),
            type: 'warning',
        },
        tax: {
            action: {
                route: routes.personal_details,
                text: localize('Complete details'),
            },
            key: 'tax',
            header: localize('Complete your personal details'),
            message: localize('Please complete your Personal Details before you proceed.'),
            type: 'danger',
        },
        tnc: {
            action: {
                onClick: async () => {
                    await WS.tncApproval();
                    WS.getSettings();
                },
                text: localize('I accept'),
            },
            key: 'tnc',
            header: localize('Terms & conditions updated'),
            message: (
                <Localize
                    i18n_default_text='Please accept our <0>updated Terms and Conditions</0> to proceed.'
                    components={[<StaticUrl key={0} className='link' href='terms-and-conditions' />]}
                />
            ),
            type: 'warning',
        },
        required_fields: {
            action: {
                route: routes.personal_details,
                text: localize('Complete details'),
            },
            key: 'required_fields',
            header: localize('Complete your personal details'),
            message: localize('Please complete your Personal Details before you proceed.'),
            type: 'danger',
        },
        you_are_offline: {
            key: 'you_are_offline',
            header: localize('You are offline'),
            message: <Localize i18n_default_text='Check your connection.' />,
            type: 'danger',
        },
        password_changed: {
            key: 'password_changed',
            header: localize('Password updated.'),
            message: <Localize i18n_default_text='Please log in with your updated password.' />,
            type: 'info',
        },
        reset_virtual_balance: {
            key: 'reset_virtual_balance',
            header: localize('Reset your balance'),
            message: client.message,
            type: 'info',
            is_persistent: true,
            should_show_again: true,
            platform: [platform_name.DTrader],
            is_disposable: true,
            action: {
                text: localize('Reset balance'),
                onClick: async () => {
                    await client.resetVirtualBalance();
                },
            },
        },
        needs_poi: {
            action: {
                route: routes.proof_of_identity,
                text: localize('Verify identity'),
            },
            key: 'needs_poi',
            header: localize('Please verify your proof of identity'),
            message: localize('To continue trading with us, please confirm who you are.'),
            type: 'danger',
        },
        needs_poa: {
            action: {
                route: routes.proof_of_address,
                text: localize('Verify address'),
            },
            key: 'needs_poa',
            header: localize('Please verify your proof of address'),
            message: localize('To continue trading with us, please confirm where you live.'),
            type: 'danger',
        },
        needs_poi_virtual: {
            action: {
                onClick: async () => {
                    const { switchAccount, first_switchable_real_loginid } = client;

                    await switchAccount(first_switchable_real_loginid);
                },
                text: localize('Verify identity'),
            },
            key: 'needs_poi_virtual',
            header: localize('Please Verify your identity'),
            message: localize(
                'We couldn’t verify your personal details with our records, to enable deposit, withdrawals and trading, you need to upload proof of your identity.'
            ),
            type: 'danger',
        },
        needs_poa_virtual: {
            action: {
                route: routes.proof_of_address,
                text: localize('Verify address'),
            },
            key: 'needs_poa_virtual',
            header: localize('Please Verify your address'),
            message: localize(
                'We couldn’t verify your personal details with our records, to enable deposit, withdrawals and trading, you need to upload proof of your address.'
            ),
            type: 'danger',
        },
        poa_expired: {
            action: {
                route: routes.proof_of_address,
                text: localize('Proof of address'),
            },
            key: 'poa_expired',
            header: localize('Document expired'),
            message: localize('Your documents for proof of address is expired. Please submit again.'),
            type: 'danger',
        },
        poa_rejected: {
            key: 'poa_rejected',
            header: localize('We could not verify your proof of address'),
            message: (
                <Localize i18n_default_text='We have disabled trading, deposits and withdrawals for this account.' />
            ),
            type: 'danger',
        },
        poi_expired: {
            action: {
                route: routes.proof_of_identity,
                text: localize('Proof of identity'),
            },
            key: 'poi_expired',
            header: localize('Proof of identity expired'),
            message: localize('Your proof of identity document has expired. Please submit a new one.'),
            type: 'danger',
        },
        new_version_available: {
            action: {
                onClick: () => window.location.reload(),
                text: localize('Refresh now'),
            },
            key: 'new_version_available',
            header: localize('A new version of Deriv is available'),
            message: localize('This page will automatically refresh in 5 minutes to load the latest version.'),
            type: 'warning',
            should_hide_close_btn: true,
            timeout: 300000,
            timeoutMessage: remaining => localize('Auto update in {{ remaining }} seconds', { remaining }),
        },
        install_pwa: {
            key: 'install_pwa',
            action: {
                onClick: () => ui.installWithDeferredPrompt(),
                text: localize('Install'),
            },
            header: localize('Install the DTrader web app'),
            message: localize('Launch DTrader in seconds the next time you want to trade.'),
            type: 'announce',
            should_hide_close_btn: false,
        },
    };
    return notifications;
};

const hasMissingRequiredField = (account_settings, client, isAccountOfType) => {
    if (!account_settings || isEmptyObject(account_settings)) return false;

    const { is_svg, landing_company_shortcode } = client;

    // TODO: [deriv-eu] refactor into its own function once more exceptions are added.
    let required_fields;
    if (is_svg) {
        required_fields = getSVGRequiredFields();
    } else {
        required_fields = getRequiredFields();
    }

    return required_fields.some(field => !account_settings[field]);

    function getSVGRequiredFields() {
        const necessary_withdrawal_fields =
            State.getResponse('landing_company.financial_company.requirements.withdrawal') || [];
        const necessary_signup_fields = State.getResponse('landing_company.financial_company.requirements.signup');

        const necessary_signup_fields_mapped = necessary_signup_fields
            ? necessary_signup_fields.map(field => (field === 'residence' ? 'country' : field))
            : [];

        return [...necessary_withdrawal_fields, ...necessary_signup_fields_mapped];
    }

    function getRequiredFields() {
        if (!isAccountOfType('financial')) return [];

        const { residence } = client;
        const required_settings_fields = [
            'account_opening_reason',
            'address_line_1',
            'address_city',
            'phone',
            'tax_identification_number',
            'tax_residence',
        ];

        const address_postcode_is_required = residence === 'gb' || landing_company_shortcode === 'iom';
        if (address_postcode_is_required) required_settings_fields.push('address_postcode');

        return [...required_settings_fields];
    }
};

const getStatusValidations = status_arr => {
    return status_arr.reduce((validations, stats) => {
        validations[stats] = true;
        return validations;
    }, {});
};

const getCashierValidations = cashier_arr => {
    return cashier_arr.reduce((validations, code) => {
        validations[code] = true;
        return validations;
    }, {});
};

const addVerificationNotifications = (identity, document, addNotificationMessage) => {
    if (identity.status === 'expired') addNotificationMessage(clientNotifications().poi_expired);

    if (document.status === 'expired') addNotificationMessage(clientNotifications().poa_expired);
};

const checkAccountStatus = (
    account_status,
    client,
    addNotificationMessage,
    loginid,
    getRiskAssessment,
    shouldCompleteTax
) => {
    if (isEmptyObject(account_status)) return {};
    if (loginid !== LocalStore.get('active_loginid')) return {};

    const {
        authentication: { document, identity, needs_verification },
        prompt_client_to_authenticate,
        risk_classification,
        status,
        cashier_validation,
    } = account_status;

    const {
        authenticated,
        cashier_locked,
        withdrawal_locked,
        mt5_withdrawal_locked,
        document_needs_action,
        unwelcome,
        max_turnover_limit_not_set,
        allow_document_upload,
    } = getStatusValidations(status);

    const { system_maintenance } = getCashierValidations(cashier_validation);

    addVerificationNotifications(identity, document, addNotificationMessage);

    const should_show_max_turnover = client.landing_company_shortcode === 'iom' && max_turnover_limit_not_set;

    const needs_authentication = needs_verification.length || allow_document_upload;
    const has_risk_assessment = getRiskAssessment(account_status);
    const needs_poa =
        needs_authentication &&
        needs_verification.includes('document') &&
        (document?.status !== 'expired' || document?.status !== 'pending');
    const needs_poi =
        needs_authentication &&
        needs_verification.includes('identity') &&
        (identity?.status !== 'expired' || identity?.status !== 'pending');

    if (needs_poa && !(document.status === 'expired')) addNotificationMessage(clientNotifications().needs_poa);
    if (needs_poi && !(identity.status === 'expired')) addNotificationMessage(clientNotifications().needs_poi);

    if (system_maintenance) addNotificationMessage(clientNotifications().system_maintenance);
    else if (cashier_locked) addNotificationMessage(clientNotifications().cashier_locked);
    else if (withdrawal_locked) {
        // if client is withdrawal locked but it's because they need to authenticate
        // and they have submitted verification documents,
        // we should wait for review of documents to be done and show a different message
        const is_high_risk = risk_classification === 'high';
        const should_authenticate = !authenticated || prompt_client_to_authenticate;
        const doc_is_under_review = document.status === 'pending';
        if (is_high_risk && should_authenticate && doc_is_under_review) {
            addNotificationMessage(clientNotifications().withdrawal_locked_review);
        } else {
            addNotificationMessage(clientNotifications().withdrawal_locked);
        }
    }
    if (mt5_withdrawal_locked) addNotificationMessage(clientNotifications().mt5_withdrawal_locked);
    if (document_needs_action) addNotificationMessage(clientNotifications().document_needs_action);

    // if client is unwelcome because they need to submit verification, we don't need to show unwelcome message as well
    const should_hide_unwelcome =
        needs_verification.length ||
        /^pending|expired$/.test(document.status) ||
        /^pending|expired$/.test(identity.status);

    if (unwelcome && !should_show_max_turnover && !should_hide_unwelcome) {
        addNotificationMessage(clientNotifications().unwelcome);
    }

    if (has_risk_assessment) addNotificationMessage(clientNotifications().risk);
    if (shouldCompleteTax(account_status)) addNotificationMessage(clientNotifications().tax);

    if (should_show_max_turnover) addNotificationMessage(clientNotifications().max_turnover_limit_not_set);

    return {
        has_risk_assessment,
    };
};

export const excluded_notifications = isMobile()
    ? ['contract_sold']
    : [
          'you_are_offline',
          'password_changed',
          'switch_to_tick_chart',
          'contract_sold',
          'maintenance',
          'bot_switch_account',
          'new_version_available',
      ];

export const handleClientNotifications = (client, client_store, ui_store, cashier_store) => {
    const { currency, excluded_until } = client;
    const {
        loginid,
        account_status,
        account_settings,
        getRiskAssessment,
        is_tnc_needed,
        isAccountOfType,
        shouldCompleteTax,
    } = client_store;
    const { addNotificationMessage, removeNotificationMessageByKey } = ui_store;
    const { is_p2p_visible } = cashier_store;

    if (loginid !== LocalStore.get('active_loginid')) return {};
    if (!currency) addNotificationMessage(clientNotifications(ui_store).currency);
    if (excluded_until) {
        addNotificationMessage(clientNotifications(ui_store, client_store).self_exclusion(excluded_until));
    }

    const { has_risk_assessment } = checkAccountStatus(
        account_status,
        client,
        addNotificationMessage,
        loginid,
        getRiskAssessment,
        shouldCompleteTax
    );
    if (is_p2p_visible) {
        addNotificationMessage(clientNotifications().dp2p);
    } else {
        removeNotificationMessageByKey({ key: clientNotifications().dp2p.key });
    }

    if (is_tnc_needed) addNotificationMessage(clientNotifications(ui_store).tnc);

    const has_missing_required_field = hasMissingRequiredField(account_settings, client, isAccountOfType);
    if (has_missing_required_field) {
        addNotificationMessage(clientNotifications(ui_store).required_fields);
    }

    return {
        has_missing_required_field,
        has_risk_assessment,
    };
};
