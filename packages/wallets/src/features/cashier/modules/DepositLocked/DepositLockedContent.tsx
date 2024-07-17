import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { WalletLink } from '../../../../components';

type TDepositLockedDescProps = {
    askFixDetails?: boolean;
    clientTncStatus?: string | null;
    excludedUntil?: Date;
    financialInformationNotComplete?: boolean;
    isMFAccount: boolean;
    poaNeedsVerification?: boolean;
    poaStatus: string;
    poiNeedsVerification?: boolean;
    poiStatus: string;
    selfExclusion?: boolean;
    tradingExperienceNotComplete?: boolean;
    unwelcomeStatus?: boolean;
    websiteTncVersion?: string;
};

const getDepositLockedDesc = ({
    askFixDetails,
    clientTncStatus,
    excludedUntil,
    financialInformationNotComplete,
    isMFAccount,
    poaNeedsVerification,
    poaStatus,
    poiNeedsVerification,
    poiStatus,
    selfExclusion,
    tradingExperienceNotComplete,
    unwelcomeStatus,
    websiteTncVersion,
}: TDepositLockedDescProps) => {
    let description = null;
    const generateDescription = (description: string, components?: JSX.Element[], values?: string) => (
        <Text align='center'>
            <Localize
                components={components}
                i18n_default_text={
                    unwelcomeStatus ? description : `You have reached the withdrawal limit. ${description}`
                }
                values={{ values }}
            />
        </Text>
    );

    if (poiNeedsVerification && poiStatus !== 'none') {
        description = generateDescription(
            'To enable deposits, you must check your <0>proof of identity document verification status</0>.',
            [<WalletLink href='/account/proof-of-identity' key={0} variant='bold' />]
        );
    } else if (poaNeedsVerification && poaStatus !== 'none') {
        description = generateDescription(
            'To enable deposits, you must check your <0>proof of address document verification status</0>.',
            [<WalletLink href='/account/proof-of-address' key={0} variant='bold' />]
        );
    } else if (clientTncStatus !== websiteTncVersion) {
        description = generateDescription(
            'To enable deposits, you must accept our <0>updated terms and conditions</0>.',
            [<WalletLink key={0} staticUrl='/terms-and-conditions/#clients' variant='bold' />]
        );
    } else if (isMFAccount && (financialInformationNotComplete || tradingExperienceNotComplete)) {
        description = generateDescription(
            'To enable deposits, you must complete the <0>financial assessment form</0>.',
            [<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]
        );
    } else if (askFixDetails) {
        description = generateDescription(
            'Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits.',
            [<WalletLink href='/account/personal-details' key={0} variant='bold' />]
        );
    } else if (selfExclusion) {
        description = generateDescription(
            'You have chosen to exclude yourself from trading on our website until {{values}}. If you are unable to place a trade or deposit after your self-exclusion period, please contact us via <0>live chat</0>.',
            [
                <button
                    className='wallets-link wallets-link__variant--bold'
                    key={0}
                    onClick={() => window.LC_API.open_chat_window()}
                />,
            ],
            excludedUntil?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        );
    } else if (unwelcomeStatus) {
        description = generateDescription('Please contact us via <0>live chat</0>.', [
            <button
                className='wallets-link wallets-link__variant--bold'
                key={0}
                onClick={() => window.LC_API.open_chat_window()}
            />,
        ]);
    }

    return description;
};

export default getDepositLockedDesc;
