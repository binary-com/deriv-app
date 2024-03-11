import React from 'react';
import { Text } from '@deriv-com/ui';

const EUDisclaimerMessage = () => (
    <div className='absolute bottom-0 w-full bg-system-light-secondary-background'>
        <div className='mx-auto px-10 lg:px-30'>
            <Text className='w-full text-xs lg:text-default leading-[1.5] py-10'>
                The products offered on our website are complex derivative products that carry a significant risk of
                potential loss. CFDs are complex instruments with a high risk of losing money rapidly due to leverage.
                70.1% of retail investor accounts lose money when trading CFDs with this provider. You should consider
                whether you understand how these products work and whether you can afford to take the high risk of
                losing your money.
            </Text>
        </div>
    </div>
);

export default EUDisclaimerMessage;
