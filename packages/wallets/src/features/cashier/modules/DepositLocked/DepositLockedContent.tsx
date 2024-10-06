import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { WalletLink } from '../../../../components';

type TDepositLockedDescProps = {
    askFixDetails?: boolean;
    excludedUntil?: Date;
    financialInformationNotComplete?: boolean;
    isMFAccount: boolean;
    isTNCNeeded: boolean;
    poaNeedsVerification?: boolean;
    poaStatus: string;
    poiNeedsVerification?: boolean;
    poiStatus: string;
    selfExclusion?: boolean;
    tradingExperienceNotComplete?: boolean;
    unwelcomeStatus?: boolean;
};

const getDepositLockedDesc = ({
    askFixDetails,
    excludedUntil,
    financialInformationNotComplete,
    isMFAccount,
    isTNCNeeded,
    poaNeedsVerification,
    poaStatus,
    poiNeedsVerification,
    poiStatus,
    selfExclusion,
    tradingExperienceNotComplete,
    unwelcomeStatus,
}: TDepositLockedDescProps) => {
    let description = null;

    if (poiNeedsVerification && poiStatus !== 'none') {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/proof-of-identity' key={0} variant='bold' />]}
                    i18n_default_text='You have reached the withdrawal limit. To enable deposits, you must check your <0>proof of identity document verification status</0>.'
                />
            </Text>
        );
    } else if (poaNeedsVerification && poaStatus !== 'none') {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/proof-of-address' key={0} variant='bold' />]}
                    i18n_default_text='To enable deposits, you must check your <0>proof of address document verification status</0>.'
                />
            </Text>
        );
    } else if (isTNCNeeded) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink key={0} staticUrl='/terms-and-conditions/#clients' variant='bold' />]}
                    i18n_default_text='To enable deposits, you must accept our <0>updated terms and conditions</0>.'
                />
            </Text>
        );
    } else if (isMFAccount && (financialInformationNotComplete || tradingExperienceNotComplete)) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]}
                    i18n_default_text='To enable deposits, you must complete the <0>financial assessment form</0>.'
                />
            </Text>
        );
    } else if (askFixDetails) {
        description = (
            <Text align='center'>
                <Localize
                    components={[<WalletLink href='/account/personal-details' key={0} variant='bold' />]}
                    i18n_default_text='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits.'
                />
            </Text>
        );
    } else if (selfExclusion) {
        description = (
            <Text align='center'>
                <Localize
                    components={[
                        <button
                            className='wallets-link wallets-link__variant--bold'
                            key={0}
                            onClick={() => window.LC_API.open_chat_window()}
                        />,
                    ]}
                    i18n_default_text='You have reached the withdrawal limit. You have chosen to exclude yourself from trading on our website until {{excludedUntil}}. If you are unable to place a trade or deposit after your self-exclusion period, please contact us via <0>live chat</0>.'
                    values={{
                        excludedUntil: excludedUntil?.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        }),
                    }}
                />
            </Text>
        );
    } else if (unwelcomeStatus) {
        description = (
            <Text align='center'>
                <Localize
                    components={[
                        <button
                            className='wallets-link wallets-link__variant--bold'
                            key={0}
                            onClick={() => window.LC_API.open_chat_window()}
                        />,
                    ]}
                    i18n_default_text='Please contact us via <0>live chat</0>.'
                />
            </Text>
        );
    }

    return description;
};

export default getDepositLockedDesc;
