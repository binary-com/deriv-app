import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useAvailableMT5Accounts } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { ModalStepWrapper, WalletButton } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { DynamicLeverageContext } from '../../components/DynamicLeverageContext';
import { PlatformDetails } from '../../constants';
import { DynamicLeverageScreen, DynamicLeverageTitle } from '../../screens/DynamicLeverage';
import { JurisdictionScreen } from '../../screens/Jurisdiction';
import { MT5PasswordModal } from '..';
import './JurisdictionModal.scss';

const LazyVerification = lazy(
    () => import(/* webpackChunkName: "wallets-verification-flow" */ '../../flows/Verification/Verification')
);

const JurisdictionModal = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const [isDynamicLeverageVisible, setIsDynamicLeverageVisible] = useState(false);
    const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);

    const { getModalState, setModalState, show } = useModal();
    const { isLoading } = useAvailableMT5Accounts();
    const { isMobile } = useDevice();

    const marketType = getModalState('marketType') ?? 'all';
    const platform = getModalState('platform') ?? PlatformDetails.mt5.platform;

    const toggleDynamicLeverage = useCallback(() => {
        setIsDynamicLeverageVisible(!isDynamicLeverageVisible);
    }, [isDynamicLeverageVisible, setIsDynamicLeverageVisible]);

    const JurisdictionFlow = () => {
        if (selectedJurisdiction === 'svg') {
            return <MT5PasswordModal marketType={marketType} platform={platform} />;
        }

        return (
            <Suspense fallback={<Loader />}>
                <LazyVerification selectedJurisdiction={selectedJurisdiction} />
            </Suspense>
        );
    };

    const modalFooter = isDynamicLeverageVisible
        ? undefined
        : () => (
              <WalletButton
                  disabled={!selectedJurisdiction || (selectedJurisdiction !== 'svg' && !isCheckBoxChecked)}
                  isFullWidth={isMobile}
                  onClick={() => show(<JurisdictionFlow />)}
              >
                  Next
              </WalletButton>
          );

    useEffect(() => {
        setModalState('selectedJurisdiction', selectedJurisdiction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedJurisdiction]);

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <DynamicLeverageContext.Provider value={{ isDynamicLeverageVisible, toggleDynamicLeverage }}>
            <ModalStepWrapper
                renderFooter={modalFooter}
                shouldHideHeader={isDynamicLeverageVisible}
                title='Choose a jurisdiction'
            >
                {isDynamicLeverageVisible && <DynamicLeverageTitle />}
                <div className='wallets-jurisdiction-modal'>
                    <JurisdictionScreen
                        isCheckBoxChecked={isCheckBoxChecked}
                        selectedJurisdiction={selectedJurisdiction}
                        setIsCheckBoxChecked={setIsCheckBoxChecked}
                        setSelectedJurisdiction={setSelectedJurisdiction}
                    />
                    <DynamicLeverageScreen />
                </div>
            </ModalStepWrapper>
        </DynamicLeverageContext.Provider>
    );
};

export default JurisdictionModal;
