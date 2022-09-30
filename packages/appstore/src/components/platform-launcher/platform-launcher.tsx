import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';
import { Link } from 'react-router-dom';

type TPlatformLauncherProps = {
    icon: string;
    title?: string;
    description?: string;
    link_to?: string;
    href?: string;
    has_real_account: boolean;
};

const PlatformLauncher = ({ icon, title, description, link_to, href, has_real_account }: TPlatformLauncherProps) => {
    return (
        <div className={`platform-launcher ${has_real_account ? '' : 'applauncher'}`}>
            <div className='platform-launcher__container'>
                <div className='platform-launcher__container--icon'>
                    <WalletIcon icon={icon} />
                </div>
                <div className='platform-launcher__container--title-desc-wrapper'>
                    <Text className='platform-launcher__container--title-desc-wrapper--title' weight='bold'>
                        <Localize i18n_default_text={title} />
                    </Text>
                    <Text className='platform-launcher__container--title-desc-wrapper--description'>
                        <Localize i18n_default_text={description} />
                    </Text>
                </div>
            </div>
            {has_real_account && (
                <div className='platform-launcher__trade-link'>
                    {link_to ? (
                        <Link to={link_to}>
                            <Localize i18n_default_text='Trade' />
                        </Link>
                    ) : (
                        <a href={href}>
                            <Localize i18n_default_text='Trade' />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlatformLauncher;
