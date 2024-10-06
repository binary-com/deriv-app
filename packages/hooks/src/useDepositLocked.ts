import { useStore } from '@deriv/stores';
import useNeedAuthentication from './useNeedAuthentication';
import useNeedFinancialAssessment from './useNeedFinancialAssessment';
import useIsTNCNeeded from './useIsTNCNeeded';

const useDepositLocked = () => {
    const { client } = useStore();
    const {
        is_deposit_lock,
        is_trading_experience_incomplete,
        landing_company_shortcode,
        is_account_to_be_closed_by_residence,
    } = client;
    const is_need_authentication = useNeedAuthentication();
    const is_tnc_needed = useIsTNCNeeded();
    const is_need_financial_assessment = useNeedFinancialAssessment();
    const is_malta_invest = landing_company_shortcode === 'maltainvest';
    const is_trading_experience_incomplete_or_need_financial_assessment = is_malta_invest
        ? is_trading_experience_incomplete
        : is_need_financial_assessment;

    const is_deposit_locked =
        is_deposit_lock ||
        is_need_authentication ||
        is_tnc_needed ||
        is_trading_experience_incomplete_or_need_financial_assessment ||
        is_account_to_be_closed_by_residence;

    return is_deposit_locked;
};

export default useDepositLocked;
