import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';

type TCompareAccount = {
    accounts_sub_text: string;
    is_desktop?: boolean;
};

const CompareAccount = observer(({ accounts_sub_text, is_desktop }: TCompareAccount) => {
    const history = useHistory();
    const { traders_hub } = useStore();
    const { selected_account_type } = traders_hub;

    const [tradrshub_dashboard_form] = useGrowthbookGetFeatureValue({
        featureFlag: 'ce_tradershub_dashboard_tracking',
        defaultValue: false,
    });

    return (
        <div
            className='cfd-accounts__compare-table-title'
            onClick={() => {
                history.push(routes.compare_cfds);
                if (tradrshub_dashboard_form) {
                    Analytics.trackEvent('ce_tradershub_dashboard_form', {
                        action: 'compare_accounts_push',
                        form_name: 'traders_hub_default',
                        account_mode: selected_account_type,
                    });
                }
            }}
        >
            <Text
                size={is_desktop ? 'xxs' : 'xs'}
                color='red'
                weight='bold'
                line_height='s'
                styles={is_desktop ? { marginInlineStart: '1rem' } : ''}
            >
                <Localize i18n_default_text={accounts_sub_text} />
            </Text>
        </div>
    );
});

export default CompareAccount;
