import React from 'react';
import classNames from 'classnames';
import { Button, Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { useStores } from 'Stores';
import './app-banner.scss';

const SwapFreeApp: React.FC<TSwapFreeAppProps> = ({ app_name, icon, onClick, small }) => (
    <div
        className={classNames('app-banner__column-item', {
            'app-banner__column-item--small': small,
        })}
    >
        <div
            className={classNames('app-banner__column-item-app-wrapper', {
                'app-banner__column-item-app-wrapper--small': small,
            })}
        >
            <Icon
                className={classNames('app-banner__column-item-app-icon', {
                    'app-banner__column-item-app-icon--small': small,
                })}
                icon={icon}
            />
            <Text className='app-banner__column-item-app-name' color='prominent' size='xs'>
                <Localize i18n_default_text={app_name} />
            </Text>
        </div>
        <Button className='app-banner__button' medium onClick={onClick} text={localize('Get')} />
    </div>
);

const SwapFreeBanner: React.FC<TSwapFreeBannerProps> = ({ getDmt5SyntheticsClick, getDmt5FinancialClick, small }) => {
    const { config_store } = useStores();

    return (
        <div className='app-banner'>
            <img src={`${config_store.asset_path}/images/banner-get-apps${small ? '-small' : ''}.svg`} />
            <div className='app-banner__container'>
                <Text
                    align='left'
                    className={classNames({ 'app-banner__text': !small })}
                    color='prominent'
                    size='s'
                    weight='bold'
                >
                    <Localize i18n_default_text='Get trading with Swap free' />
                </Text>
                <div
                    className={classNames('app-banner__column', {
                        'app-banner__column--small': small,
                        'app-banner__column--small-swap-free': small,
                    })}
                >
                    <SwapFreeApp
                        app_name='DMT5 Financial'
                        icon='IcBrandDmt5Financial'
                        onClick={getDmt5FinancialClick}
                        small={small}
                    />
                    <SwapFreeApp
                        app_name='DMT5 Synthetics'
                        icon='IcBrandDmt5Synthetics'
                        onClick={getDmt5SyntheticsClick}
                        small={small}
                    />
                </div>
            </div>
        </div>
    );
};

type TSwapFreeAppProps = {
    app_name: String;
    icon: String;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    small: boolean;
};
type TSwapFreeBannerProps = {
    getDmt5SyntheticsClick: React.MouseEventHandler<HTMLButtonElement>;
    getDmt5FinancialClick: React.MouseEventHandler<HTMLButtonElement>;
    small: boolean;
};
export default SwapFreeBanner;
