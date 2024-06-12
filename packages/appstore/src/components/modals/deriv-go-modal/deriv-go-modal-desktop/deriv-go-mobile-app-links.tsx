import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Icon } from '@deriv/components';
import { getPlatformDerivGoDownloadLink, MOBILE_PLATFORMS } from 'Constants/platform-config';
import './deriv-go-modal-desktop.scss';

type TMobilePlatfromsIcons = {
    [key in keyof typeof MOBILE_PLATFORMS]: string;
};

const mobilePlatfromsIcons: TMobilePlatfromsIcons = {
    ANDROID: 'IcInstallationGoogle',
    IOS: 'IcInstallationApple',
    HAUWEI: 'IcInstallationHuawei',
} as const;

export const DerivGoMoblieAppLinks = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;

    return (
        <>
            {Object.entries(mobilePlatfromsIcons).map(([platform, icon]) => (
                <a
                    key={platform}
                    href={getPlatformDerivGoDownloadLink(
                        MOBILE_PLATFORMS[platform as keyof typeof mobilePlatfromsIcons]
                    )}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Icon icon={is_dark_mode_on ? icon : `${icon}Light`} width={139} height={46} />
                </a>
            ))}
        </>
    );
});
