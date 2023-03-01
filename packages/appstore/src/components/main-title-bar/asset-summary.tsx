import React from 'react';
import { Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import BalanceText from 'Components/elements/text/balance-text';
import './asset-summary.scss';

const AssetSummary = observer(() => {
    const { traders_hub } = useStore();
    const { selected_account_type, is_eu_user, no_CR_account, no_MF_account, total_balance } = traders_hub;
    // if selected region is non-eu, check active cr accounts, if selected region is eu- check active mf accounts
    const has_active_related_deriv_account = !((no_CR_account && !is_eu_user) || (no_MF_account && is_eu_user));

    if (!(has_active_related_deriv_account || selected_account_type === 'demo'))
        return <div className='asset-summary' />;

    return (
        <div className='asset-summary'>
            {!isMobile() ? (
                <Text align='right' size='xs' line_height='s'>
                    {localize('Total assets')}
                </Text>
            ) : null}
            <Popover
                alignment={isMobile() ? 'top' : 'left'}
                message={localize('Total assets in all your accounts')}
                zIndex={9999}
                is_bubble_hover_enabled
            >
                <BalanceText
                    currency={total_balance.currency}
                    balance={total_balance.balance}
                    underline_style='dotted'
                />
            </Popover>
        </div>
    );
});

export default AssetSummary;
