import { useState, useEffect, useCallback } from 'react';
import {
    CONTRACT_TYPES,
    TRADE_TYPES,
    getContractTypesConfig,
    isTurbosContract,
    isVanillaContract,
} from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { ActiveSymbols, ActiveSymbolsResponse } from '@deriv/api-types';
import { useTraderStore } from 'Stores/useTraderStores';
import useContractsForCompany from './useContractsForCompany';
import { useDtraderQuery } from './useDtraderQuery';

const useActiveSymbols = () => {
    const { client, common } = useStore();
    const { loginid, is_switching } = client;
    const { showError } = common;
    const {
        active_symbols: symbols_from_store,
        contract_type,
        is_vanilla,
        is_turbos,
        setActiveSymbolsV2,
    } = useTraderStore();
    const [activeSymbols, setActiveSymbols] = useState<ActiveSymbols | []>(symbols_from_store);

    const { available_contract_types, is_fetching_ref: is_contracts_loading_ref } = useContractsForCompany();

    const trade_types_with_barrier_category = [
        TRADE_TYPES.RISE_FALL,
        TRADE_TYPES.RISE_FALL_EQUAL,
        TRADE_TYPES.HIGH_LOW,
    ] as string[];

    const getContractTypesList = () => {
        if (is_turbos) return [CONTRACT_TYPES.TURBOS.LONG, CONTRACT_TYPES.TURBOS.SHORT];
        if (is_vanilla) return [CONTRACT_TYPES.VANILLA.CALL, CONTRACT_TYPES.VANILLA.PUT];
        return getContractTypesConfig()[contract_type]?.trade_types ?? [];
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { barrier_category } = (available_contract_types?.[contract_type]?.config || {}) as any;

    const isQueryEnabled = useCallback(() => {
        if (!available_contract_types || is_contracts_loading_ref.current || is_switching) return false;
        return true;
    }, [available_contract_types, is_switching, is_contracts_loading_ref]);

    const getContractType = () => {
        if (isTurbosContract(contract_type)) {
            return 'turbos';
        } else if (isVanillaContract(contract_type)) {
            return 'vanilla';
        }
        return contract_type;
    };

    const { data: response } = useDtraderQuery<ActiveSymbolsResponse>(
        ['active_symbols', loginid ?? '', getContractType()],
        {
            active_symbols: 'brief',
            contract_type: getContractTypesList(),
            ...(trade_types_with_barrier_category.includes(contract_type) && barrier_category
                ? { barrier_category: [barrier_category] }
                : {}),
        },
        {
            enabled: isQueryEnabled(),
        }
    );

    useEffect(
        () => {
            const process = async () => {
                if (!response) return;

                const { active_symbols = [], error } = response;
                if (error) {
                    showError({ message: localize('Trading is unavailable at this time.') });
                } else if (!active_symbols?.length) {
                    setActiveSymbols([]);
                } else {
                    setActiveSymbols(active_symbols);
                    setActiveSymbolsV2(active_symbols);
                }
            };
            process();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [response]
    );

    return { activeSymbols };
};

export default useActiveSymbols;
