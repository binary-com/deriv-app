import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import './disclaimer.scss';

const Disclaimer = () => {
    const { isDesktop } = useDevice();

    return (
        <div data-testid='dt_traders_hub_disclaimer' className='disclaimer'>
            <Text align='left' className='disclaimer-text' size={!isDesktop ? 'xxxs' : 'xs'}>
                <Localize i18n_default_text='The products offered on our website are complex derivative products that carry a significant risk of potential loss. CFDs are complex instruments with a high risk of losing money rapidly due to leverage. 70.84% of retail investor accounts lose money when trading CFDs with this provider. You should consider whether you understand how these products work and whether you can afford to take the high risk of losing your money.' />
            </Text>
            <div className='disclaimer__bottom-plug' />
        </div>
    );
};

export default Disclaimer;
