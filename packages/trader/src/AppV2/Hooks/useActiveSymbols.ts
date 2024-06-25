import { useState, useEffect, useCallback } from 'react';
import { WS } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { ActiveSymbols } from '@deriv/api-types';

const useActiveSymbols = () => {
    const [activeSymbols, setActiveSymbols] = useState<ActiveSymbols[] | []>([]);
    const { client } = useStore();
    const { is_logged_in } = client;

    const fetchActiveSymbols = useCallback(async () => {
        let response;
        if (is_logged_in) {
            response = await WS.authorized.activeSymbols();
        } else {
            response = await WS.activeSymbols();
        }

        const { active_symbols, error } = response;

        if (!active_symbols.length || error) {
            setActiveSymbols([]);
        } else {
            setActiveSymbols(active_symbols);
        }
    }, [is_logged_in]);

    useEffect(() => {
        fetchActiveSymbols();
    }, [fetchActiveSymbols]);

    return { activeSymbols, fetchActiveSymbols };
};

export default useActiveSymbols;
