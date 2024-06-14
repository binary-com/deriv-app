import React from 'react';
import { InlineMessage, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import ConnectedAppsInfoBullets from './connected-apps-info-bullets';

const ConnectedAppsInfo = observer(() => {
    const { ui } = useStore();
    const { is_mobile_or_tablet } = ui;

    const text_size = is_mobile_or_tablet ? 'xxxs' : 'xxs';

    return (
        <InlineMessage
            type='information'
            size='md'
            message={
                <React.Fragment>
                    <Text as='h4' weight='bold' size={text_size}>
                        <Localize i18n_default_text='What are connected apps?' />
                    </Text>
                    <ConnectedAppsInfoBullets class_name='connected-apps__bullets--with-apps' />
                </React.Fragment>
            }
        />
    );
});

export default ConnectedAppsInfo;
