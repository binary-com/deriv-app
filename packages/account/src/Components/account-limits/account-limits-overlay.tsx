import React from 'react';
import { Popup, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import AccountLimitsContext from './account-limits-context';

const AccountLimitsOverlay = () => {
    const { overlay_ref, toggleOverlay } = React.useContext(AccountLimitsContext);

    return (
        <Popup.Overlay
            descriptions={[
                {
                    key: 'account_limits_desc_1',
                    component: (
                        <Localize i18n_default_text='These are default limits that we apply to your accounts.' />
                    ),
                },
                {
                    key: 'account_limits_desc_2',
                    component: (
                        <Localize
                            i18n_default_text='To learn more about account limits and how they apply, please go to the <0>Help Centre</0>.'
                            components={[<StaticUrl key={0} className='link' href='/help-centre' />]}
                        />
                    ),
                },
            ]}
            done_text={localize('Done')}
            overlay_ref={overlay_ref}
            title={localize('Account limits')}
            toggleOverlay={toggleOverlay}
        />
    );
};

export default AccountLimitsOverlay;
