import { useState, useEffect, useCallback, useRef } from 'react';
import {
    CONTRACT_TYPES,
    TRADE_TYPES,
    getContractTypesConfig,
    isTurbosContract,
    isVanillaContract,
    pickDefaultSymbol,
    setTradeURLParams,
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
        processContractsForV2,
        contract_type,
        is_vanilla,
        is_turbos,
        onChange,
        setActiveSymbolsV2,
        symbol,
    } = useTraderStore();
    const [activeSymbols, setActiveSymbols] = useState<ActiveSymbols | []>(symbols_from_store);

    const { available_contract_types, is_fetching_ref: is_contracts_loading_ref } = useContractsForCompany();

    const default_symbol_ref = useRef('');

    const has_initialized_ref = useRef(false);

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

    const isSymbolAvailable = (active_symbols: ActiveSymbols) => {
        return active_symbols.some(symbol_info => symbol_info.symbol === symbol);
    };

    useEffect(
        () => {
            const processNewSymbol = async (new_symbol: string) => {
                // To call contracts_for during initialization
                const has_initialized = has_initialized_ref.current;
                const is_initailization = !has_initialized && new_symbol;
                const has_symbol_changed = symbol != new_symbol && new_symbol;
                default_symbol_ref.current = new_symbol;

                if (is_initailization || has_symbol_changed) {
                    await onChange({ target: { name: 'symbol', value: new_symbol } });
                    processContractsForV2();
                }
                setTradeURLParams({ symbol: new_symbol });
            };

            const process = async () => {
                if (!response) return;

                const { active_symbols = [], error } = response;
                if (error) {
                    showError({ message: localize('Trading is unavailable at this time.') });
                } else if (!active_symbols?.length) {
                    setActiveSymbols([]);
                } else {
                    const new_symbol = isSymbolAvailable(active_symbols)
                        ? symbol
                        : (await pickDefaultSymbol(active_symbols)) || '1HZ100V';

                    processNewSymbol(new_symbol);
                    setActiveSymbols(active_symbols);
                    setActiveSymbolsV2(active_symbols);
                    has_initialized_ref.current = true;
                }
            };
            process();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [response]
    );

    return { default_symbol: default_symbol_ref.current, activeSymbols };
};

export default useActiveSymbols;
