import React, { useCallback, useEffect, useState } from 'react';
import { useAvailableMT5Accounts } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, Heading, useBreakpoint } from '@deriv/quill-design';
import { Modal } from '../../../../components/Modal';
import { DynamicLeverageContext } from '../../components/DynamicLeverageContext';
import { Jurisdiction, MarketType, MarketTypeDetails } from '../../constants';
import { DynamicLeverageScreen, DynamicLeverageTitle } from '../../screens/DynamicLeverage';
import { JurisdictionScreen } from '../../screens/Jurisdiction';

const JurisdictionModal = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const [isDynamicLeverageVisible, setIsDynamicLeverageVisible] = useState(false);
    const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);

    const { show } = Provider.useModal();
    const { getCFDState, setCfdState } = Provider.useCFDContext();

    const { isLoading } = useAvailableMT5Accounts();
    const { isMobile } = useBreakpoint();

    const marketType = getCFDState('marketType') ?? MarketType.ALL;

    const { title } = MarketTypeDetails[marketType];

    const toggleDynamicLeverage = useCallback(() => {
        setIsDynamicLeverageVisible(!isDynamicLeverageVisible);
    }, [isDynamicLeverageVisible, setIsDynamicLeverageVisible]);

    const jurisdictionTitle = `Choose a jurisdiction for your Deriv MT5 ${title} account`;

    const JurisdictionFlow = () => {
        if (selectedJurisdiction === Jurisdiction.SVG) {
            return null; // MT5PasswordModal
        }

        return null; // Verification flow
    };

    useEffect(() => {
        setCfdState('selectedJurisdiction', selectedJurisdiction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedJurisdiction]);

    if (isLoading) return <Heading.H1>Loading...</Heading.H1>;

    return (
        <DynamicLeverageContext.Provider value={{ isDynamicLeverageVisible, toggleDynamicLeverage }}>
            <Modal className='bg-background-primary-container'>
                {!isDynamicLeverageVisible ? <Modal.Header title={jurisdictionTitle} /> : undefined}
                <Modal.Content>
                    {isDynamicLeverageVisible && <DynamicLeverageTitle />}
                    <div className='relative [perspective:200rem]'>
                        <JurisdictionScreen
                            isCheckBoxChecked={isCheckBoxChecked}
                            selectedJurisdiction={selectedJurisdiction}
                            setIsCheckBoxChecked={setIsCheckBoxChecked}
                            setSelectedJurisdiction={setSelectedJurisdiction}
                        />
                        <DynamicLeverageScreen />
                    </div>
                </Modal.Content>
                {!isDynamicLeverageVisible ? (
                    <Modal.Footer>
                        <Button
                            className='rounded-200'
                            disabled={
                                !selectedJurisdiction ||
                                (selectedJurisdiction !== Jurisdiction.SVG && !isCheckBoxChecked)
                            }
                            fullWidth={isMobile}
                            onClick={() => show(<JurisdictionFlow />)}
                        >
                            Next
                        </Button>
                    </Modal.Footer>
                ) : undefined}
            </Modal>
        </DynamicLeverageContext.Provider>
    );
};

export default JurisdictionModal;
