import React from 'react';
import { FullPageMobileWrapper } from '@/components';
import { useQueryString } from '@/hooks';
import { Text } from '@deriv-com/ui';
import MyProfileStats from './MyProfileStats';

const MyProfileStatsMobile = () => {
    const { setQueryString } = useQueryString();
    return (
        <FullPageMobileWrapper
            className='absolute top-16'
            onBack={() =>
                setQueryString({
                    tab: 'default',
                })
            }
            renderHeader={() => (
                <Text lineHeight='xs' size='lg' weight='bold'>
                    Stats
                </Text>
            )}
        >
            <MyProfileStats />
        </FullPageMobileWrapper>
    );
};

export default MyProfileStatsMobile;
