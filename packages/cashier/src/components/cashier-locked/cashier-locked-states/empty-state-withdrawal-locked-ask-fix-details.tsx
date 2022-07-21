import { localize, Localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import React from 'react';

const EmptyStateWithdrawalLockedAskFixDetails: React.FC = () => (
    <EmptyState
        icon={'IcCashierWithdrawalLock'}
        title={localize('Withdrawals are locked')}
        description={
            <Localize
                i18n_default_text='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable withdrawals.'
                components={[
                    <a key={0} className='link' rel='noopener noreferrer' href={'/account/personal-details'} />,
                ]}
            />
        }
    />
);

export default EmptyStateWithdrawalLockedAskFixDetails;
