import React from 'react';
import { useDevice } from '@/hooks';
import { DerivLightIcCashierNoAdsIcon } from '@deriv/quill-icons';
import { ActionScreen, Button, Text } from '@deriv-com/ui';

const MyAdsEmpty = () => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'lg' : 'md';
    return (
        <div className='mt-[11.8rem] mx-[1.6rem]'>
            <ActionScreen
                actionButtons={
                    <Button size='lg' textSize={isMobile ? 'md' : 'sm'}>
                        Create new ad
                    </Button>
                }
                description={
                    <Text align='center' size={textSize}>
                        {'Looking to buy or sell USD? You can post your own ad for others to respond.'}
                    </Text>
                }
                icon={<DerivLightIcCashierNoAdsIcon height='128px' width='128px' />}
                title={
                    <Text size={textSize} weight='bold'>
                        {'You have no ads 😞'}
                    </Text>
                }
            />
        </div>
    );
};

export default MyAdsEmpty;
