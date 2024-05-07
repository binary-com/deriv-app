import React from 'react';
import { Localize } from '@deriv/translations';
import { contract_stages } from 'Constants/contract-stage';

type TContractStageText = {
    contract_stage: number;
};

const ContractStageText: React.FC<TContractStageText> = ({ contract_stage }) => {
    switch (contract_stage) {
        case contract_stages.STARTING:
            return <Localize i18n_default_text='Bot is starting' />;
        case contract_stages.PURCHASE_SENT:
            return <Localize i18n_default_text='Buying contract' />;
        case contract_stages.STARTED:
            return <Localize i18n_default_text='Seeking for contract' />;
        case contract_stages.PURCHASE_RECEIVED:
            return <Localize i18n_default_text='Contract bought' />;
        case contract_stages.IS_STOPPING:
            return <Localize i18n_default_text='Bot is stopping' />;
        case contract_stages.CONTRACT_CLOSED:
            return <Localize i18n_default_text='Contract closed' />;
        case contract_stages.NOT_RUNNING:
        default:
            return <Localize i18n_default_text='Bot is not running' />;
    }
};

export default ContractStageText;
