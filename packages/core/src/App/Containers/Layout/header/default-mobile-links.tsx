import React from 'react';

import { Button, Icon } from '@deriv/components';
import { routes } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

import { BinaryLink } from 'App/Components/Routes';
import ShowNotifications from './show-notifications';

type TDefaultMobileLinks = {
    handleClickCashier: () => void;
};

const DefaultMobileLinks = React.memo(({ handleClickCashier }: TDefaultMobileLinks) => {
    const { client } = useStore();
    const { has_wallet } = client;

    return (
        <React.Fragment>
            <div className='traders-hub-header__menu-right--items--notifications'>
                <ShowNotifications />
            </div>
            <BinaryLink className='traders-hub-header__setting' to={routes.personal_details}>
                <Icon icon='IcUserOutline' size={20} />
            </BinaryLink>
            {!has_wallet && (
                <div className='traders-hub-header__cashier-button'>
                    <Button primary small onClick={handleClickCashier}>
                        <Localize i18n_default_text='Cashier' />
                    </Button>
                </div>
            )}
        </React.Fragment>
    );
});

DefaultMobileLinks.displayName = 'DefaultMobileLinks';

export default DefaultMobileLinks;
