import { Localize } from '@deriv/translations';
import React from 'react';
import { getContractDetailsConfig } from 'AppV2/Utils/contract-details-config';
import { observer } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import RiskManagementItem from '../RiskManagementItem';

const StopLoss = observer(() => {
    const { contract_info } = useContractDetails();
    const { limit_order } = contract_info;
    const { isStopLossVisible } = getContractDetailsConfig(contract_info.contract_type ?? '');

    return isStopLossVisible ? (
        <RiskManagementItem
            label={<Localize i18n_default_text='Stop loss' />}
            modal_body_content={
                <Localize i18n_default_text='When your loss reaches or exceeds the set amount, your trade will be closed automatically.' />
            }
            value={limit_order?.stop_loss?.order_amount}
            type='stop_loss'
        />
    ) : null;
});

export default StopLoss;
