import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { WalletLink } from '../../../../components';

type TSystemMaintenanceDescProps = {
    currency?: string;
    isCashierLocked?: boolean;
    isCrypto?: boolean;
    isDepositLocked?: boolean;
    isWithdrawalLocked?: boolean;
};

type TCashierLockedDescProps = {
    askAuthenticate?: boolean;
    askCurrency?: boolean;
    askFinancialRiskApproval?: boolean;
    askFixDetails?: boolean;
    askSelfExclusionMaxTurnoverSet?: boolean;
    askTinInformation?: boolean;
    cashierLockedStatus?: boolean;
    currency?: string;
    disabledStatus?: boolean;
    documentsExpired?: boolean;
    financialAssessmentRequired?: boolean;
    noResidence?: boolean;
    poaNeedsVerification?: boolean;
    poiNeedsVerification?: boolean;
};

export const getSystemMaintenanceContent = ({
    currency,
    isCashierLocked,
    isCrypto,
    isDepositLocked,
    isWithdrawalLocked,
}: TSystemMaintenanceDescProps) => {
    let content = null;

    if (isCashierLocked) {
        content = {
            description: (
                <Text align='center'>
                    <Localize
                        i18n_default_text='Due to system maintenance, deposits and withdrawals with your {{currency}} Wallet are unavailable at the moment. Please try again later.'
                        values={{ currency }}
                    />
                </Text>
            ),
            title: (
                <Localize
                    i18n_default_text='{{currency}} Wallet deposits and withdrawals are temporarily unavailable.'
                    values={{ currency }}
                />
            ),
        };
    } else if (isCrypto) {
        if (isDepositLocked) {
            content = {
                description: (
                    <Text align='center'>
                        <Localize
                            i18n_default_text='Due to system maintenance, deposits with your {{currency}} Wallet are unavailable at the moment. Please try again later.'
                            values={{ currency }}
                        />
                    </Text>
                ),
                title: (
                    <Localize
                        i18n_default_text='{{currency}} Wallet deposits are temporarily unavailable.'
                        values={{ currency }}
                    />
                ),
            };
        } else if (isWithdrawalLocked) {
            content = {
                description: (
                    <Text align='center'>
                        <Localize
                            i18n_default_text='Due to system maintenance, withdrawals with your {{currency}} Wallet are unavailable at the moment. Please try again later.'
                            values={{ currency }}
                        />
                    </Text>
                ),
                title: (
                    <Localize
                        i18n_default_text='{{currency}} Wallet withdrawals are temporarily unavailable.'
                        values={{ currency }}
                    />
                ),
            };
        }
    }

    return content;
};

const getCashierLockedDesc = ({
    askAuthenticate,
    askCurrency,
    askFinancialRiskApproval,
    askFixDetails,
    askSelfExclusionMaxTurnoverSet,
    askTinInformation,
    cashierLockedStatus,
    currency,
    disabledStatus,
    documentsExpired,
    financialAssessmentRequired,
    noResidence,
    poaNeedsVerification,
    poiNeedsVerification,
}: TCashierLockedDescProps) => {
    let description = null;

    if (noResidence) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/personal-details' key={0} variant='bold' />]}
                    i18n_default_text="You've not set your country of residence. To access {{currency}} Wallet, please update your country of residence in the <0>Personal details section</0> in your account settings."
                    values={{ currency }}
                />
            </Text>
        );
    } else if (documentsExpired) {
        description = (
            <Text align='center'>
                <Localize
                    i18n_default_text='The identification documents you submitted have expired. Please submit valid identity documents to unlock your {{currency}} Wallet.'
                    values={{ currency }}
                />
            </Text>
        );
    } else if (cashierLockedStatus || disabledStatus) {
        description = (
            <Text align='center'>
                <Localize
                    components={[
                        <button
                            className='wallets-link wallets-link__variant--bold'
                            key={0}
                            onClick={() => window.LiveChatWidget.call('maximize')}
                        />,
                    ]}
                    i18n_default_text='Please contact us via <0>live chat</0> to enable deposits and withdrawals again.'
                />
            </Text>
        );
    } else if (askCurrency) {
        description = (
            <Text align='center'>
                <Localize i18n_default_text='Please set your account currency to enable deposits and withdrawals.' />
            </Text>
        );
    } else if (askAuthenticate && poiNeedsVerification) {
        if (poaNeedsVerification) {
            description = (
                <Text align='center'>
                    <Localize
                        components={[
                            <WalletLink href='/account/proof-of-identity' key={0} variant='bold' />,
                            <WalletLink href='/account/proof-of-address' key={1} variant='bold' />,
                        ]}
                        i18n_default_text='Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and access your {{currency}} Wallet.'
                        values={{ currency }}
                    />
                </Text>
            );
        } else if (!poaNeedsVerification) {
            description = (
                <Text align='center'>
                    <Localize
                        components={[<WalletLink href='/account/proof-of-identity' key={0} variant='bold' />]}
                        i18n_default_text='Please submit your <0>proof of identity</0> to authenticate your account and access your {{currency} Wallet.'
                        values={{ currency }}
                    />
                </Text>
            );
        }
    } else if (askFinancialRiskApproval) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]}
                    i18n_default_text='Please complete the <0>Appropriateness Test</0> to access your {{currency}} Wallet.'
                    values={{ currency }}
                />
            </Text>
        );
    } else if (financialAssessmentRequired) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]}
                    i18n_default_text='Please complete the <0>financial assessment</0> to unlock it.'
                />
            </Text>
        );
    } else if (askTinInformation) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/personal-details' key={0} variant='bold' />]}
                    i18n_default_text='You have not provided your tax identification number. This information is necessary for legal and regulatory requirements. Please go to <0>Personal details</0> in your account settings and fill in your latest tax identification number.'
                />
            </Text>
        );
    } else if (askSelfExclusionMaxTurnoverSet) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/self-exclusion' key={0} variant='bold' />]}
                    i18n_default_text='Your access to {{currency}} Wallet has been temporarily disabled as you have not set your 30-day turnover limit. Please go to <0>Self-exclusion</0> and set your 30-day turnover limit.'
                    values={{ currency }}
                />
            </Text>
        );
    } else if (askFixDetails) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/personal-details' key={0} variant='bold' />]}
                    i18n_default_text='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits and withdrawals.'
                />
            </Text>
        );
    }

    return description;
};

export default getCashierLockedDesc;
