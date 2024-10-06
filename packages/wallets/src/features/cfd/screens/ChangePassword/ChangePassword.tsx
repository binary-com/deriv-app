import React from 'react';
import { useTranslations } from '@deriv-com/translations';
import { ModalStepWrapper } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import { PlatformDetails } from '../../constants';
import MT5ChangePasswordScreens from './MT5ChangePasswordScreens';
import TradingPlatformChangePasswordScreens from './TradingPlatformChangePasswordScreens';
import './ChangePassword.scss';

const ChangePassword = () => {
    const { getModalState } = useModal();
    const { localize } = useTranslations();
    const platform = getModalState('platform') ?? PlatformDetails.mt5.platform;
    const { title } = PlatformDetails[platform];

    const isDerivX = platform === PlatformDetails.dxtrade.platform;

    return (
        <ModalStepWrapper title={localize('Manage {{title}} password', { title })}>
            <div className='wallets-change-password__modal-wrapper'>
                <div className='wallets-change-password__container'>
                    {isDerivX ? (
                        <TradingPlatformChangePasswordScreens platform={platform} />
                    ) : (
                        <MT5ChangePasswordScreens />
                    )}
                </div>
            </div>
        </ModalStepWrapper>
    );
};

export default ChangePassword;
