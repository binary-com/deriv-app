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
import { usePrevious } from '@deriv/components';
import { useTraderStore } from 'Stores/useTraderStores';
import useContractsForCompany from './useContractsForCompany';
import { useDtraderQuery } from './useDtraderQuery';
import { isLoginidDefined } from 'AppV2/Utils/client';

const useActiveSymbols = () => {
    const { client, common } = useStore();
    const { loginid, is_switching, is_logged_in } = client;
    const { showError } = common;
    const {
        active_symbols: symbols_from_store,
        contract_type,
        has_symbols_for_v2,
        is_vanilla,
        is_turbos,
        onChange,
        setActiveSymbolsV2,
        symbol,
    } = useTraderStore();
    const [activeSymbols, setActiveSymbols] = useState<ActiveSymbols | []>(symbols_from_store);

    const { available_contract_types, is_fetching_ref: is_contracts_loading_ref } = useContractsForCompany();

    const default_symbol_ref = useRef('');
    const previous_contract_type = usePrevious(contract_type);
    const prev_loginid = useRef(loginid);

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
        if (!available_contract_types) return false;
        if (is_contracts_loading_ref.current) return false;
        return true;
    }, [available_contract_types, is_contracts_loading_ref]);

    const { data: response, refetch } = useDtraderQuery<ActiveSymbolsResponse>(
        ['active_symbols', contract_type],
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
            const checkSymbolChange = (new_symbol: string) => {
                // To call contracts_for during initialization
                const is_initailization = !default_symbol_ref.current && new_symbol;
                const has_symbol_changed = symbol != new_symbol;
                if (is_initailization || has_symbol_changed) {
                    onChange({ target: { name: 'symbol', value: new_symbol } });
                }
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

                    setActiveSymbols(active_symbols);
                    setActiveSymbolsV2(active_symbols);
                    checkSymbolChange(new_symbol);
                    setTradeURLParams({ symbol: new_symbol, contractType: contract_type });
                    default_symbol_ref.current = new_symbol;
                }
            };
            process();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [response]
    );
    useEffect(() => {
        const has_contract_type_changed =
            previous_contract_type && contract_type && previous_contract_type !== contract_type;

        if (
            (isVanillaContract(previous_contract_type) && is_vanilla) ||
            (isTurbosContract(previous_contract_type) && is_turbos)
        ) {
            return;
        }

        if (!symbols_from_store.length || !has_symbols_for_v2 || has_contract_type_changed) {
            refetch();
        } else {
            setActiveSymbols(symbols_from_store);
        }
    }, [
        available_contract_types,
        contract_type,
        refetch,
        has_symbols_for_v2,
        is_logged_in,
        previous_contract_type,
        symbols_from_store,
        is_vanilla,
        is_turbos,
    ]);

    useEffect(() => {
        if (
            isQueryEnabled() &&
            isLoginidDefined(prev_loginid.current) &&
            prev_loginid.current !== loginid &&
            !is_switching
        ) {
            refetch();
            prev_loginid.current = loginid;
        }
    }, [loginid, is_switching, refetch, isQueryEnabled]);

    return { default_symbol: default_symbol_ref.current, activeSymbols };
};

export default useActiveSymbols;
