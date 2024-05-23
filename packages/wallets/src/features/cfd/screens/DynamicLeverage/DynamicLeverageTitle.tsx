import React, { FC } from 'react';
import { LegacyArrowLeft2pxIcon } from '@deriv/quill-icons';
import { WalletText } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';
import { useDynamicLeverageModalState } from '../../components/DynamicLeverageContext';
import './DynamicLeverageTitle.scss';

export const DynamicLeverageTitle: FC = () => {
    const { isMobile } = useDevice();

    const { toggleDynamicLeverage } = useDynamicLeverageModalState();

    return (
        <div className='wallets-dynamic-leverage-screen__title'>
            <LegacyArrowLeft2pxIcon
                className='wallets-dynamic-leverage-screen__title-back'
                data-testid='back_icon'
                iconSize='xs'
                onClick={toggleDynamicLeverage}
            />
            <WalletText color='prominent' size={isMobile ? 'sm' : 'md'} weight='bold'>
                Get more out of Deriv MT5 Financial
            </WalletText>
        </div>
    );
};

export default DynamicLeverageTitle;
