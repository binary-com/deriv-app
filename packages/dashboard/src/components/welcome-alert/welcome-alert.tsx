import React from 'react';
import { Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

type TWelcomeAlert = {
    openQuickGuideModal: () => void;
    onRedirect: () => void;
};

const WelcomeAlert: React.FC<TWelcomeAlert> = ({ openQuickGuideModal, onRedirect }) => (
    <div className='dw-alert-box'>
        <div className='dw-alert-box__left'>
            <Text className='dw-alert-box__left-main-text' size={isMobile() ? 's' : 'xs'} weight='bold'>
                {localize('Welcome to My apps Beta!')}
            </Text>
            <Text size={isMobile() ? 'xxxs' : 'xxs'}>
                <Localize
                    i18n_default_text='Not sure where to start? See our <0>quick guide.</0>'
                    components={[
                        <Text
                            key={0}
                            className='link link--orange dw-alert-box__left-sub-text'
                            onClick={openQuickGuideModal}
                            size={isMobile() ? 'xxxs' : 'xxs'}
                        />,
                    ]}
                />
            </Text>
        </div>
        <div className='dw-alert-box__right'>
            <Text className='dw-alert-box__right-sub-text' size={isMobile() ? 'xxxs' : 'xxs'}>
                {localize('Take me back to current version')}
            </Text>
            <Icon
                className='dw-alert-box__right-icon'
                icon={isMobile() ? 'IcChevronRightBold' : 'IcArrowRightBold'}
                onClick={onRedirect}
                width={14}
            />
        </div>
    </div>
);

export default WelcomeAlert;
