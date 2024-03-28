import React from 'react';
import { Text } from '@deriv/components';
import { AUTH_STATUS_CODES, MT5_ACCOUNT_RIGHTS, MT5_ACCOUNT_STATUS, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TAuthStatusCodes, TMT5AccountStatus } from '../Types/common.type';
import { Link } from 'react-router-dom';

const getStatusBadgeConfig = (
    mt5_account_status: TMT5AccountStatus,
    openFailedVerificationModal?: (selected_account_type: string) => void,
    selected_account_type?: string,
    setIsVerificationModalVisible?: (value: boolean) => void,
    user_account_status?: { poi_status: TAuthStatusCodes; poa_status: TAuthStatusCodes }
) => {
    const BadgeTextComponent = <Text key={0} weight='bold' size='xxxs' color='warning' />;

    switch (mt5_account_status) {
        case MT5_ACCOUNT_STATUS.PENDING:
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Pending verification</0>'
                        components={[<Text key={0} weight='bold' size='xxxs' color='var(--status-warning)' />]}
                    />
                ),
                icon: 'IcAlertWarning',
            };
        case MT5_ACCOUNT_STATUS.FAILED:
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Verification failed.</0> <1>Why?</1>'
                        components={[
                            <Text key={0} weight='bold' size='xxxs' color='var(--status-danger)' />,
                            <Text
                                key={1}
                                className='link-verification-failed'
                                onClick={() => {
                                    openFailedVerificationModal?.(selected_account_type ?? '');
                                }}
                            />,
                        ]}
                    />
                ),
                icon: 'IcRedWarning',
            };
        case MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION: {
            const redirect_url =
                user_account_status?.poi_status === AUTH_STATUS_CODES.NONE
                    ? routes.proof_of_identity
                    : routes.proof_of_address;
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Needs verification.</0><1>Verify now</1>'
                        components={[
                            <Text key={0} weight='bold' size='xxxs' color='var(--status-info)' />,
                            setIsVerificationModalVisible ? (
                                <Text
                                    key={1}
                                    className='link-need-verification'
                                    onClick={() => setIsVerificationModalVisible?.(true)}
                                />
                            ) : (
                                <Link key={1} className='link-need-verification' to={redirect_url} />
                            ),
                        ]}
                    />
                ),
                icon: 'IcAlertInfo',
            };
        }
        case MT5_ACCOUNT_STATUS.MIGRATED_WITH_POSITION:
            return {
                text: <Localize i18n_default_text='<0>No new positions</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        case MT5_ACCOUNT_STATUS.MIGRATED_WITHOUT_POSITION:
            return {
                text: <Localize i18n_default_text='<0>Account closed</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        case MT5_ACCOUNT_RIGHTS.DISABLED:
            return {
                text: (
                    <Text weight='bold' size='xxxs' color='var(--status-danger)'>
                        <Localize i18n_default_text='Disabled' />
                    </Text>
                ),
                icon: 'IcAlertDanger',
            };
        default:
            return {
                text: '',
                icon: '',
            };
    }
};

export default getStatusBadgeConfig;
