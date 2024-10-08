import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize } from '@deriv/translations';

const CFDsDescription = () => {
    return (
        <Text size='xs' line_height='s'>
            <Localize
                i18n_default_text='Trade bigger positions with less capital on a wide range of global markets. Learn more about <0>CFDs trading</0>.'
                components={[<StaticUrl key={0} className='options' href='/trade/cfds' />]}
            />
        </Text>
    );
};

export default CFDsDescription;
