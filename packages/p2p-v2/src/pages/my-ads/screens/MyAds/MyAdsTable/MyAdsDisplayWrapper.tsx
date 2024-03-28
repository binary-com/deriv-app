import React, { PropsWithChildren } from 'react';
import { useHistory } from 'react-router-dom';
import { FullPageMobileWrapper } from '@/components';
import { MY_ADS_URL } from '@/constants';
import { Button, useDevice } from '@deriv-com/ui';
import { MyAdsToggle } from '../MyAdsToggle';

type TMyAdsDisplayWrapperProps = {
    isPaused: boolean;
    onClickToggle: () => void;
};

const MyAdsDisplayWrapper = ({ children, isPaused, onClickToggle }: PropsWithChildren<TMyAdsDisplayWrapperProps>) => {
    const { isMobile } = useDevice();
    const history = useHistory();

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                renderFooter={() => (
                    <Button
                        isFullWidth
                        onClick={() => history.push(`${MY_ADS_URL}?formAction=create`)}
                        size='lg'
                        textSize='md'
                    >
                        Create new ad
                    </Button>
                )}
                renderHeader={() => <MyAdsToggle isPaused={isPaused} onClickToggle={onClickToggle} />}
                shouldShowBackIcon={false}
            >
                {children}
            </FullPageMobileWrapper>
        );
    }

    return (
        <>
            <div className='flex items-center justify-between my-[1.6rem]'>
                <Button onClick={() => history.push(`${MY_ADS_URL}?formAction=create`)} size='lg' textSize='sm'>
                    Create new ad
                </Button>
                <MyAdsToggle isPaused={isPaused} onClickToggle={onClickToggle} />
            </div>
            {children}
        </>
    );
};

export default MyAdsDisplayWrapper;
