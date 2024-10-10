import { ACCOUNT_BADGE_STATUS } from '@deriv/shared';
import useHasMaltaInvestAccount from './useHasMaltaInvestAccount';
import useGetMFAccountStatus from './useGetMFAccountStatus';
import { useStore } from '@deriv/stores';

const useMFAccountStatus = () => {
    const {
        client: { is_eu },
    } = useStore();
    const has_malta_invest_account = useHasMaltaInvestAccount();
    const { mf_account_status } = useGetMFAccountStatus();

    const should_show_status_for_multipliers_account =
        is_eu &&
        has_malta_invest_account &&
        mf_account_status &&
        [ACCOUNT_BADGE_STATUS.PENDING, ACCOUNT_BADGE_STATUS.FAILED, ACCOUNT_BADGE_STATUS.NEEDS_VERIFICATION].includes(
            mf_account_status
        );
    return should_show_status_for_multipliers_account ? mf_account_status : null;
};

export default useMFAccountStatus;
