import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { WalletLink } from '../../../../components';

type TWithdrawalLimitReachedDescProps = {
    askFinancialRiskApproval?: boolean;
    poaNeedsVerification?: boolean;
    poaStatus: string;
    poiNeedsVerification?: boolean;
    poiStatus: string;
};

type TWithdrawalLockedDescProps = {
    askAuthenticate?: boolean;
    askFixDetails?: boolean;
    financialAssessmentRequired?: boolean;
    noWithdrawalOrTradingStatus?: boolean;
    withdrawalLockedStatus?: boolean;
};

export const getWithdrawalLimitReachedDesc = ({
    askFinancialRiskApproval,
    poaNeedsVerification,
    poaStatus,
    poiNeedsVerification,
    poiStatus,
}: TWithdrawalLimitReachedDescProps) => {
    let description = null;

    if (poiNeedsVerification || poaNeedsVerification || poaStatus !== 'verified' || poiStatus !== 'verified') {
        description = (
            <Text align='center'>
                <Localize
                    components={[
                        <WalletLink href='/account/proof-of-identity' key={0} variant='bold' />,
                        <WalletLink href='/account/proof-of-address' key={1} variant='bold' />,
                    ]}
                    i18n_default_text='You have reached the withdrawal limit. Please check your <0>proof of identity</0> and <1>address</1> document verification status to lift the limit to continue your withdrawal.'
                />
            </Text>
        );
    } else if (askFinancialRiskApproval) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]}
                    i18n_default_text='Please complete the <0>financial assessment form</0> to lift the limit to continue your withdrawal.'
                />
            </Text>
        );
    }

    return description;
};

const getWithdrawalLockedDesc = ({
    askAuthenticate,
    askFixDetails,
    financialAssessmentRequired,
    noWithdrawalOrTradingStatus,
    withdrawalLockedStatus,
}: TWithdrawalLockedDescProps) => {
    let description = null;

    if (financialAssessmentRequired) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]}
                    i18n_default_text='Please complete the <0>financial assessment</0> to unlock withdrawals.'
                />
            </Text>
        );
    } else if (askAuthenticate) {
        description = (
            <Text align='center'>
                <Localize
                    components={[
                        <WalletLink href='/account/proof-of-identity' key={0} variant='bold' />,
                        <WalletLink href='/account/proof-of-address' key={1} variant='bold' />,
                    ]}
                    i18n_default_text='Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and request for withdrawals.'
                />
            </Text>
        );
    } else if (askFixDetails) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/personal-details' key={0} variant='bold' />]}
                    i18n_default_text='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable withdrawals.'
                />
            </Text>
        );
    } else if (noWithdrawalOrTradingStatus || withdrawalLockedStatus) {
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
                    i18n_default_text='Unfortunately, you can only make deposits. Please contact us via <0>live chat</0> to enable withdrawals.'
                />
            </Text>
        );
    }

    return description;
};

export default getWithdrawalLockedDesc;
