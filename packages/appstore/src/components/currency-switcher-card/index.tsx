import DemoAccountCard from './demo/demo-account-card';
import RealAccountSwitcher from './real/real-account-switcher';
import { observer, useStore } from '@deriv/stores';

const CurrencySwitcherCard = observer(() => {
    const { traders_hub, client } = useStore();
    const { has_any_real_account, has_maltainvest_account } = client;
    const { is_real, is_demo, is_eu_user } = traders_hub;

    const has_cr_account = !is_eu_user && has_any_real_account;

    const has_mf_account = is_eu_user && has_maltainvest_account;

    if (is_real && (has_cr_account || has_mf_account)) {
        return <RealAccountSwitcher />;
    } else if (is_demo) {
        return <DemoAccountCard />;
    }
    return null;
});

export default CurrencySwitcherCard;
