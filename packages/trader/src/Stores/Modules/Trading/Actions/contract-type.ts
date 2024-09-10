import { isDtraderV2Enabled } from '@deriv/shared';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import { TTradeStore } from 'Types';

export const onChangeContractTypeList = ({
    root_store,
    contract_types_list,
    contract_types_list_v2,
    contract_type,
}: TTradeStore) => {
    const is_dtrader_v2_enabled = isDtraderV2Enabled(root_store?.ui.is_mobile);
    const list = is_dtrader_v2_enabled ? contract_types_list_v2 : contract_types_list;
    return ContractType.getContractType(list, contract_type);
};

export const onChangeContractType = (store: TTradeStore) => {
    return ContractType.getContractValues(store);
};
