import React from 'react';
import classNames from 'classnames';
import { Button, Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { useStores } from 'Stores';
import './app-banner.scss';

const TradingApp: React.FC<TTradingAppProps> = ({ small, icon }) => (
    <div
        className={classNames(
            'app-banner__column-item',
            {
                'app-banner__column-item--small': small,
            },
            'app-banner__column-item--trading-app'
        )}
    >
        <div
            className={classNames(
                'app-banner__column-item-app-wrapper',
                'app-banner__column-item-app-wrapper--trading-app',
                {
                    'app-banner__column-item-app-wrapper--small': small,
                }
            )}
        >
            <Icon
                className={classNames('app-banner__column-item-app-icon', {
                    'app-banner__column-item-app-icon--small': small,
                })}
                icon={icon}
            />
            <Text className='app-banner__column-item-app-name--trading-app' color='prominent' size='xs'>
                <Localize i18n_default_text='DTrader' />
            </Text>
        </div>
    </div>
);

const TradingAppBanner: React.FC<TTradingAppBannerProps> = ({ getTradingAppClick, small }) => {
    const { config_store } = useStores();

    return (
        <div className='app-banner'>
            <img src={`${config_store.asset_path}/images/banner-get-apps${small ? '-small' : ''}.svg`} />
            <div className='app-banner__container'>
                <Text
                    align='left'
                    className={classNames({ 'app-banner__text': !small, 'app-banner__text--trading-app': !small })}
                    color='prominent'
                    size='s'
                    weight='bold'
                >
                    <Localize i18n_default_text='Get trading with Options and Multipliers' />
                </Text>
                <div
                    className={classNames('app-banner__apps-wrapper', {
                        'app-banner__apps-wrapper--trading-app': !small,
                    })}
                >
                    <div
                        className={classNames('app-banner__column', {
                            'app-banner__column--small': small,
                            'app-banner__column--small-trading-app': small,
                            'app-banner__column--trading-app': !small,
                        })}
                    >
                        <TradingApp icon='IcBrandDtrader' small={small} />
                        <TradingApp icon='IcBrandDbot' small={small} />
                        <TradingApp icon='IcBrandSmarttrader' small={small} />
                        <TradingApp icon='IcBrandBinarybot' small={small} />
                    </div>
                    <Button className='app-banner__button' medium onClick={getTradingAppClick} text={localize('Get')} />
                </div>
            </div>
        </div>
    );
};

type TTradingAppProps = {
    small: boolean;
    icon: String;
};
type TTradingAppBannerProps = {
    getTradingAppClick: React.MouseEventHandler<HTMLButtonElement>;
    small: boolean;
};
export default TradingAppBanner;
