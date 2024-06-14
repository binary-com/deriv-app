import React from 'react';
import { observer } from 'mobx-react-lite';
import { DesktopWrapper, Icon, MobileOrTabletWrapper, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

const BlockUserEmpty = () => {
    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='block-user-empty' data-testid='dt_desktop_content'>
                    <Icon
                        className='block-user-empty__icon'
                        icon='IcEmptyBlockedAdvertisers'
                        height={128}
                        width={128}
                    />
                    <Text className='block-user-empty__text' weight='bold'>
                        <Localize i18n_default_text='No one to show here' />
                    </Text>
                </div>
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <div className='block-user-empty__mobile-content'>
                    <Icon
                        icon='IcEmptyBlockedAdvertisers'
                        className='block-user-empty__icon'
                        height={128}
                        width={128}
                    />
                    <Text className='block-user-empty__text' weight='bold'>
                        <Localize i18n_default_text='No one to show here' />
                    </Text>
                </div>
            </MobileOrTabletWrapper>
        </React.Fragment>
    );
};

export default observer(BlockUserEmpty);
