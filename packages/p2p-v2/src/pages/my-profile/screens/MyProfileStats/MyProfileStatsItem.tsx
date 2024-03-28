import React, { useState } from 'react';
import { Text, useDevice } from '@deriv-com/ui';
import './MyProfileStatsItem.scss';

type TMyProfileStatsItemProps = {
    currency?: string;
    label: string;
    onClickLifetime?: (isLifetimeClicked: boolean) => void;
    shouldShowDuration?: boolean;
    shouldShowLifetime?: boolean;
    testId?: string;
    value: string;
};
const MyProfileStatsItem = ({
    currency,
    label,
    onClickLifetime,
    shouldShowDuration = true,
    shouldShowLifetime,
    testId,
    value,
}: TMyProfileStatsItemProps) => {
    const [hasClickedLifetime, setHasClickedLifetime] = useState(false);
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'xs' : 'sm';

    const onClickLabel = (showLifetime: boolean) => {
        setHasClickedLifetime(showLifetime);
        onClickLifetime?.(showLifetime);
    };

    // TODO: Replace the button components below with Button once you can remove hover effect from Button
    return (
        <div className='p2p-v2-my-profile-stats__item' data-testid={testId}>
            <div>
                <Text color='less-prominent' size={textSize}>
                    {label}{' '}
                </Text>
                {shouldShowDuration && (
                    <button className='p2p-v2-my-profile-stats__item--inactive' onClick={() => onClickLabel(false)}>
                        <Text
                            color={!hasClickedLifetime && shouldShowLifetime ? 'red' : 'less-prominent'}
                            size={textSize}
                        >
                            30d{' '}
                        </Text>
                    </button>
                )}{' '}
                {shouldShowLifetime && (
                    <>
                        <Text color='less-prominent' size={textSize}>
                            |{' '}
                        </Text>
                        <button className='p2p-v2-my-profile-stats__item--inactive' onClick={() => onClickLabel(true)}>
                            <Text color={hasClickedLifetime ? 'red' : 'less-prominent'} size={textSize}>
                                lifetime
                            </Text>
                        </button>
                    </>
                )}
            </div>
            <Text size={isMobile ? 'md' : 'sm'} weight='bold'>
                {value} {currency}
            </Text>
        </div>
    );
};

export default MyProfileStatsItem;
