import React, { Fragment, useState } from 'react';
import { getCfdsAccountTitle } from '@/helpers/cfdsAccountHelpers';
import { useQueryParams, useRegulationFlags } from '@/hooks';
import { useCFDContext } from '@/providers';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { URLUtils } from '@deriv-com/utils';
import {
    GetADerivAccountDialog,
    IconComponent,
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '../../../../../../components';
import { PlatformDetails } from '../../../../constants';

const { getDerivStaticURL } = URLUtils;

const LeadingIcon = () => (
    <div>
        <IconComponent
            icon='DerivX'
            onClick={() => {
                window.open(getDerivStaticURL('/derivx'));
            }}
        />
    </div>
);

const AvailableDxtradeAccountsList = () => {
    const { hasActiveDerivAccount } = useRegulationFlags();
    const { openModal } = useQueryParams();
    const { setCfdState } = useCFDContext();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const [isDerivedAccountModalOpen, setIsDerivedAccountModalOpen] = useState(false);

    const TrailingButton = () => <TradingAccountCardLightButton onSubmit={trailingButtonClick} />;

    const title = getCfdsAccountTitle(PlatformDetails.dxtrade.title, activeTradingAccount?.is_virtual);

    const trailingButtonClick = () => {
        if (!hasActiveDerivAccount) {
            setIsDerivedAccountModalOpen(true);
        } else {
            setCfdState({ platform: PlatformDetails.dxtrade.platform });
            openModal('DxtradePasswordModal');
        }
    };
    return (
        <Fragment>
            <TradingAccountCard leading={LeadingIcon} trailing={TrailingButton}>
                <TradingAccountCardContent title={title}>
                    This account offers CFDs on a highly customisable CFD trading platform.
                </TradingAccountCardContent>
            </TradingAccountCard>
            <GetADerivAccountDialog
                isOpen={isDerivedAccountModalOpen}
                onClose={() => setIsDerivedAccountModalOpen(false)}
            />
        </Fragment>
    );
};

export default AvailableDxtradeAccountsList;
