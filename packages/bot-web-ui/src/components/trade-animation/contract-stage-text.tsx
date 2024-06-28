import React from 'react';
import { Localize } from '@deriv/translations';
import { contract_stages } from 'Constants/contract-stage';

type TContractStageText = {
    contract_stage: number;
};

export const text_contract_stages = Object.freeze({
    NOT_RUNNING: 'Bot is not running',
    RUNNING: 'Bot running',
    STARTING: 'Bot is starting',
    PURCHASE_SENT: 'Buying contract',
    PURCHASE_RECEIVED: 'Contract bought',
    IS_STOPPING: 'Bot is stopping',
    CONTRACT_CLOSED: 'Contract closed',
});

const ContractStageText: React.FC<TContractStageText> = ({ contract_stage }) => {
    switch (contract_stage) {
        case contract_stages.STARTING:
            return <Localize i18n_default_text={text_contract_stages.STARTING} />;
        case contract_stages.RUNNING:
            return <Localize i18n_default_text={text_contract_stages.RUNNING} />;
        case contract_stages.PURCHASE_SENT:
            return <Localize i18n_default_text={text_contract_stages.PURCHASE_SENT} />;
        case contract_stages.PURCHASE_RECEIVED:
            return <Localize i18n_default_text={text_contract_stages.PURCHASE_RECEIVED} />;
        case contract_stages.IS_STOPPING:
            return <Localize i18n_default_text={text_contract_stages.IS_STOPPING} />;
        case contract_stages.CONTRACT_CLOSED:
            return <Localize i18n_default_text={text_contract_stages.CONTRACT_CLOSED} />;
        case contract_stages.NOT_RUNNING:
        default:
            return <Localize i18n_default_text={text_contract_stages.NOT_RUNNING} />;
    }
};

export default ContractStageText;
