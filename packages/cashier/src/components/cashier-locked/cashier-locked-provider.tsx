import React from 'react';
import { History } from 'history';
import { Localize, localize } from '@deriv/translations';
import { formatDate, routes } from '@deriv/shared';

type TProps = {
    cashier_validation: string[] | undefined;
    closeAccountTransferModal: () => void;
    excluded_until: number | undefined;
    history: History;
    is_crypto: boolean;
    is_eu: boolean;
    is_system_maintenance: boolean;
    is_cashier_locked: boolean;
    is_deposit_locked: boolean;
    is_withdrawal_locked: boolean;
    is_identity_verification_needed: boolean;
    is_pending_verification: boolean;
    is_duplicate_dob_phone: boolean;
    is_account_to_be_closed_by_residence: boolean;
    account_time_of_closure?: number;
};

const getMessage = ({
    cashier_validation,
    closeAccountTransferModal,
    excluded_until,
    history,
    is_crypto,
    is_eu,
    is_system_maintenance,
    is_cashier_locked,
    is_deposit_locked,
    is_withdrawal_locked,
    is_identity_verification_needed,
    is_pending_verification,
    is_duplicate_dob_phone,
    is_account_to_be_closed_by_residence,
    account_time_of_closure,
}: TProps) => {
    const no_residence = cashier_validation?.includes('no_residence');
    const unwelcome_status = cashier_validation?.includes('unwelcome_status');
    const self_exclusion = cashier_validation?.includes('SelfExclusion');
    const no_withdrawal_or_trading_status = cashier_validation?.includes('no_withdrawal_or_trading_status');
    const only_pa_withdrawals_allowed_status = cashier_validation?.includes('only_pa_withdrawals_allowed_status');
    const withdraw_service_unavailable_for_pa = cashier_validation?.includes('WithdrawServiceUnavailableForPA');
    const withdrawal_locked_status = cashier_validation?.includes('withdrawal_locked_status');
    const documents_expired = cashier_validation?.includes('documents_expired');
    const cashier_locked_status = cashier_validation?.includes('cashier_locked_status');
    const disabled_status = cashier_validation?.includes('disabled_status');
    const financial_assessment_required = cashier_validation?.includes('FinancialAssessmentRequired');
    const ask_currency = cashier_validation?.includes('ASK_CURRENCY');
    const ask_authenticate = cashier_validation?.includes('ASK_AUTHENTICATE');
    const ask_financial_risk_approval = cashier_validation?.includes('ASK_FINANCIAL_RISK_APPROVAL');
    const ask_tin_information = cashier_validation?.includes('ASK_TIN_INFORMATION');
    const ask_self_exclusion_max_turnover_set = cashier_validation?.includes('ASK_SELF_EXCLUSION_MAX_TURNOVER_SET');
    const ask_fix_details = cashier_validation?.includes('ASK_FIX_DETAILS');
    const pa_commision_withdrawal_limit = cashier_validation?.includes('PACommisionWithdrawalLimit');
    const pathname = history.location.pathname;

    if (is_account_to_be_closed_by_residence && pathname === routes.cashier_deposit) {
        return {
            icon: 'IcCashierNoBalance',
            title: localize('Deposits disabled'),
            description: (
                <Localize
                    i18n_default_text='Due to business changes, client accounts in Senegal are to be closed. Withdraw any remaining funds by {{date}}.'
                    values={{
                        date: formatDate(account_time_of_closure, 'DD MMM YYYY'),
                    }}
                />
            ),
        };
    }

    if (is_system_maintenance) {
        if (is_crypto && is_withdrawal_locked)
            return {
                icon: 'IcCashierLocked',
                title: localize('Withdrawals are locked'),
                description: localize(
                    'Withdrawals are temporarily unavailable due to system maintenance. You can make your withdrawals when the maintenance is complete.'
                ),
            };
        if (is_crypto && is_deposit_locked)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: localize(
                    'Deposits are temporarily unavailable due to system maintenance. You can make your deposits when the maintenance is complete.'
                ),
            };
        return {
            icon: 'IcCashierUnderMaintenance',
            title: localize('Cashier is currently down for maintenance'),
            description: (
                <Localize
                    i18n_default_text='Please check back in a few minutes.<0></0>Thank you for your patience.'
                    components={[<br key={0} />]}
                />
            ),
        };
    }

    if (is_cashier_locked) {
        if (no_residence)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: localize(
                    'You’ve not set your country of residence. To access Cashier, please update your country of residence in the Personal details section in your account settings.'
                ),
            };
        if (documents_expired)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: localize(
                    'The identification documents you submitted have expired. Please submit valid identity documents to unlock Cashier. '
                ),
            };
        if (cashier_locked_status)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: (
                    <Localize
                        i18n_default_text='Your cashier is currently locked. Please contact us via <0>live chat</0> to find out how to unlock it.'
                        components={[
                            <span
                                key={0}
                                className='link link--orange'
                                onClick={() => window.LiveChatWidget.call('maximize')}
                            />,
                        ]}
                    />
                ),
            };
        if (disabled_status)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: (
                    <Localize
                        i18n_default_text='Your account is temporarily disabled. Please contact us via <0>live chat</0> to enable deposits and withdrawals again.'
                        components={[
                            <span
                                key={0}
                                className='link link--orange'
                                onClick={() => window.LiveChatWidget.call('maximize')}
                            />,
                        ]}
                    />
                ),
            };
        if (ask_currency)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: localize('Please set your account currency to enable deposits and withdrawals.'),
            };
        if (ask_authenticate && is_identity_verification_needed)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: (
                    <Localize
                        i18n_default_text='Please submit your <0>proof of identity</0> to authenticate your account and access your Cashier.'
                        components={[<a key={0} className='link' href={'/account/proof-of-identity'} />]}
                    />
                ),
            };
        if (ask_authenticate) {
            if (is_eu) {
                const getDescription = () => {
                    let description;
                    switch (pathname) {
                        case routes.cashier_deposit:
                            description = (
                                <Localize i18n_default_text='You can make a new deposit once the verification of your account is complete.' />
                            );
                            break;
                        case routes.cashier_withdrawal:
                            description = (
                                <Localize i18n_default_text='You can make a withdrawal once the verification of your account is complete.' />
                            );
                            break;
                        case routes.cashier_acc_transfer:
                            description = (
                                <Localize i18n_default_text='You can make a funds transfer once the verification of your account is complete.' />
                            );
                            break;
                        default:
                            break;
                    }

                    return description;
                };

                return {
                    icon: 'IcCashierLocked',
                    title: localize('Cashier is locked'),
                    description: getDescription(),
                    action: {
                        onClick: () => {
                            history.push(routes.proof_of_identity);
                            closeAccountTransferModal();
                        },
                        label: localize('Verify now'),
                    },
                };
            }

            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: (
                    <Localize
                        i18n_default_text='Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and access your cashier.'
                        components={[
                            <a
                                key={0}
                                className='link'
                                rel='noopener noreferrer'
                                href={'/account/proof-of-identity'}
                            />,
                            <a key={1} className='link' rel='noopener noreferrer' href={'/account/proof-of-address'} />,
                        ]}
                    />
                ),
            };
        }
        if (is_eu && is_pending_verification) {
            const getDescription = () => {
                let description;
                switch (pathname) {
                    case routes.cashier_deposit:
                        description = (
                            <Localize i18n_default_text='You cannot make further deposits as your documents are still under review. We will notify you by email within 3 days once your verification is approved.' />
                        );
                        break;
                    case routes.cashier_withdrawal:
                        description = (
                            <Localize i18n_default_text='You cannot make a withdrawal as your documents are still under review. We will notify you by email within 3 days once your verification is approved.' />
                        );
                        break;
                    case routes.cashier_acc_transfer:
                        description = (
                            <Localize i18n_default_text='You cannot make a fund transfer as your documents are still under review. We will notify you by email within 3 days once your verification is approved.' />
                        );
                        break;
                    default:
                        break;
                }
                return description;
            };

            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: getDescription(),
            };
        }
        if (ask_financial_risk_approval)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: (
                    <Localize
                        i18n_default_text='Please complete the <0>Appropriateness Test</0> to access your cashier.'
                        components={[
                            <a
                                key={0}
                                className='link'
                                rel='noopener noreferrer'
                                href={'/account/financial-assessment'}
                                data-testid='dt_financial_assessment_link'
                            />,
                        ]}
                    />
                ),
            };
        if (financial_assessment_required)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: (
                    <Localize
                        i18n_default_text='Your cashier is locked. Please complete the <0>financial assessment</0> to unlock it.'
                        components={[
                            <a
                                key={0}
                                className='link'
                                rel='noopener noreferrer'
                                href={'/account/financial-assessment'}
                                data-testid='dt_financial_assessment_link'
                            />,
                        ]}
                    />
                ),
            };
        if (ask_tin_information)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: (
                    <Localize
                        i18n_default_text='You have not provided your tax identification number. This information is necessary for legal and regulatory requirements. Please go to <0>Personal details</0> in your account settings, and fill in your latest tax identification number.'
                        components={[
                            <a key={0} className='link' rel='noopener noreferrer' href={'/account/personal-details'} />,
                        ]}
                    />
                ),
            };
        if (ask_self_exclusion_max_turnover_set)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: (
                    <Localize
                        i18n_default_text='Your access to Cashier has been temporarily disabled as you have not set your 30-day turnover limit. Please go to <0>Self-exclusion</0> and set your 30-day turnover limit.'
                        components={[
                            <a key={0} className='link' rel='noopener noreferrer' href={'/account/self-exclusion'} />,
                        ]}
                    />
                ),
            };
        if (ask_fix_details)
            return {
                icon: 'IcCashierLocked',
                title: localize('Cashier is locked'),
                description: (
                    <Localize
                        i18n_default_text='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits and withdrawals.'
                        components={[
                            <a key={0} className='link' rel='noopener noreferrer' href={'/account/personal-details'} />,
                        ]}
                    />
                ),
            };
    }

    if (is_deposit_locked) {
        if (is_duplicate_dob_phone) {
            return {
                icon: 'IcAccountError',
                title: localize('Account already exists'),
                description: (
                    <Localize
                        i18n_default_text="Your details match an existing account. You can't <0/>make deposits or trade with a new account. <0/>Need help? Reach out via live chat."
                        components={[<br key={0} />]}
                    />
                ),
            };
        }
        if (ask_fix_details)
            return {
                icon: 'IcCashierDepositLock',
                title: localize('Deposits are locked'),
                description: (
                    <Localize
                        i18n_default_text='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits.'
                        components={[
                            <a key={0} className='link' rel='noopener noreferrer' href={'/account/personal-details'} />,
                        ]}
                    />
                ),
            };
        if (self_exclusion)
            return {
                icon: 'IcCashierDepositLock',
                title: localize('Deposits are locked'),
                description: (
                    <Localize
                        i18n_default_text='You have chosen to exclude yourself from trading on our website until {{exclude_until}}. If you are unable to place a trade or deposit after your self-exclusion period, please contact us via <0>live chat</0>.'
                        values={{ exclude_until: formatDate(excluded_until, 'DD MMM, YYYY') }}
                        components={[
                            <span
                                key={0}
                                className='link link--orange'
                                onClick={() => window.LiveChatWidget.call('maximize')}
                            />,
                        ]}
                    />
                ),
            };
        if (unwelcome_status)
            return {
                icon: 'IcCashierDepositLock',
                title: localize('Deposits are locked'),
                description: (
                    <Localize
                        i18n_default_text='Please contact us via <0>live chat</0>.'
                        components={[
                            <span
                                key={0}
                                className='link link--orange'
                                onClick={() => window.LiveChatWidget.call('maximize')}
                            />,
                        ]}
                    />
                ),
            };
    }

    if (is_withdrawal_locked) {
        if (financial_assessment_required)
            return {
                icon: 'IcCashierWithdrawalLock',
                title: localize('Withdrawals are locked'),
                description: (
                    <Localize
                        i18n_default_text='You can only make deposits. Please complete the <0>financial assessment</0> to unlock withdrawals.'
                        components={[
                            <a
                                key={0}
                                className='link'
                                href={'/account/financial-assessment'}
                                data-testid='dt_financial_assessment_link'
                            />,
                        ]}
                    />
                ),
            };
        if (ask_authenticate)
            return {
                icon: 'IcCashierWithdrawalLock',
                title: localize('Withdrawals are locked'),
                description: (
                    <Localize
                        i18n_default_text='Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and request for withdrawals.'
                        components={[
                            <a
                                key={0}
                                className='link'
                                rel='noopener noreferrer'
                                href={'/account/proof-of-identity'}
                            />,
                            <a key={1} className='link' rel='noopener noreferrer' href={'/account/proof-of-address'} />,
                        ]}
                    />
                ),
            };
        if (ask_fix_details)
            return {
                icon: 'IcCashierWithdrawalLock',
                title: localize('Withdrawals are locked'),
                description: (
                    <Localize
                        i18n_default_text='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable withdrawals.'
                        components={[
                            <a key={0} className='link' rel='noopener noreferrer' href={'/account/personal-details'} />,
                        ]}
                    />
                ),
            };
        if (withdraw_service_unavailable_for_pa)
            return {
                icon: 'IcCashierWithdrawalLock',
                title: localize('Withdrawals are locked'),
                description: localize('This feature is not available for payment agents.'),
            };
        if (no_withdrawal_or_trading_status)
            return {
                icon: 'IcCashierWithdrawalLock',
                title: localize('Withdrawals are locked'),
                description: (
                    <Localize
                        i18n_default_text='Unfortunately, you can only make deposits. Please contact us via <0>live chat</0> to enable withdrawals.'
                        components={[
                            <span
                                key={0}
                                className='link link--orange'
                                onClick={() => window.LiveChatWidget.call('maximize')}
                            />,
                        ]}
                    />
                ),
            };
        if (withdrawal_locked_status)
            return {
                icon: 'IcCashierWithdrawalLock',
                title: localize('Withdrawals are locked'),
                description: (
                    <Localize
                        i18n_default_text='Unfortunately, you can only make deposits. Please contact us via <0>live chat</0> to enable withdrawals.'
                        components={[
                            <span
                                key={0}
                                className='link link--orange'
                                onClick={() => window.LiveChatWidget.call('maximize')}
                            />,
                        ]}
                    />
                ),
            };
        if (only_pa_withdrawals_allowed_status)
            return {
                icon: 'IcCashierWithdrawalLock',
                title: localize('Withdrawals are locked'),
                description: (
                    <Localize
                        i18n_default_text='You can only make deposits. Please contact us via <0>live chat</0> for more information.'
                        components={[
                            <span
                                key={0}
                                className='link link--orange'
                                onClick={() => window.LiveChatWidget.call('maximize')}
                            />,
                        ]}
                    />
                ),
            };
        if (pa_commision_withdrawal_limit)
            return {
                icon: 'IcCashierWithdrawalLock',
                title: localize('Cashier is locked for withdrawals'),
                description: localize(
                    "It seems that you've no commissions to withdraw at the moment. You can make withdrawals once you receive your commissions."
                ),
            };
    }

    return {
        icon: 'IcCashierLocked',
        title: localize('Cashier is locked'),
        description: (
            <Localize
                i18n_default_text='Your cashier is currently locked. Please contact us via <0>live chat</0> to find out how to unlock it.'
                components={[
                    <span
                        key={0}
                        className='link link--orange'
                        onClick={() => window.LiveChatWidget.call('maximize')}
                    />,
                ]}
            />
        ),
    };
};

export default getMessage;
