import React, { useState } from 'react';
import { useAvailableMT5Accounts } from '@deriv/api';
import { ModalStepWrapper, WalletButton } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { useModal } from '../../../../components/ModalProvider';
import { MarketTypeToTitleMapper } from '../../constants';
import { JurisdictionScreen } from '../../screens/Jurisdiction';
import { MT5PasswordModal } from '..';

const JurisdictionModal = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const { modalState, show } = useModal();
    const { isLoading } = useAvailableMT5Accounts();
    const { isMobile } = useDevice();

    const marketType = modalState?.marketType || 'all';
    const platform = modalState?.platform || 'mt5';

    const capitalizedMarketType = MarketTypeToTitleMapper[marketType];

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <ModalStepWrapper
            renderFooter={() => (
                <WalletButton
                    disabled={!selectedJurisdiction}
                    isFullWidth={isMobile}
                    onClick={() => show(<MT5PasswordModal marketType={marketType} platform={platform} />)}
                    text='Next'
                />
            )}
            title={`Choose a jurisdiction for your Deriv MT5 ${capitalizedMarketType} account`}
        >
            <JurisdictionScreen
                selectedJurisdiction={selectedJurisdiction}
                setSelectedJurisdiction={setSelectedJurisdiction}
            />
        </ModalStepWrapper>
    );
};

export default JurisdictionModal;
