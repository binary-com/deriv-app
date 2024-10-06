import React from 'react';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useAuthentication,
    useCashierValidation,
    useSettings,
} from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Loader } from '@deriv-com/ui';
import getDepositLockedDesc from './DepositLockedContent';
import './DepositLocked.scss';

const DepositLocked: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: settings } = useSettings();
    const { data: authentication } = useAuthentication();
    const { data: cashierValidation } = useCashierValidation();
    const { data: accountStatus } = useAccountStatus();

    const currency = activeWallet?.currency || 'USD';
    const excludedUntil = activeWallet?.excluded_until;
    const isMFAccount = activeWallet?.loginid?.startsWith('MF') || false;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore, NOTE: no tnc_status in settings type
    const isTNCNeeded = settings?.tnc_status?.[activeWallet?.landing_company_name] === 0;

    const poaNeedsVerification = authentication?.is_poa_needed;
    const poiNeedsVerification = authentication?.is_poa_needed;
    const poaStatus = authentication?.poa_status || 'none';
    const poiStatus = authentication?.poi_status || 'none';

    const askFixDetails = cashierValidation?.ask_fix_details;
    const selfExclusion = cashierValidation?.self_exclusion;
    const unwelcomeStatus = cashierValidation?.unwelcome_status;

    const isDepositLocked = accountStatus?.is_deposit_locked;
    const financialInformationNotComplete = accountStatus?.is_financial_information_not_complete;
    const tradingExperienceNotComplete = accountStatus?.is_trading_experience_not_complete;

    if (!accountStatus) {
        return <Loader />;
    }

    if (isDepositLocked) {
        return (
            <div className='wallets-deposit-locked'>
                <ActionScreen
                    description={getDepositLockedDesc({
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
                    })}
                    title={
                        <Localize
                            i18n_default_text='Deposits into your {{currency}} Wallet are temporarily locked.'
                            values={{ currency }}
                        />
                    }
                />
            </div>
        );
    }

    return <>{children}</>;
};

export default DepositLocked;
