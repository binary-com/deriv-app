import { CONTRACT_TYPES, getSupportedContracts, getTotalProfit, isHighLow, isMultiplierContract } from '@deriv/shared';
import { TPortfolioPosition } from '@deriv/stores/types';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';

export const DEFAULT_DATE_FORMATTING_CONFIG = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
} as Record<string, string>;

export const filterPositions = (positions: (TPortfolioPosition | TClosedPosition)[], filter: string[]) => {
    if (!filter.length) return positions;
    // Split contract type names with '/' (e.g. Rise/Fall)
    const splittedFilter = filter.map(option => (option.includes('/') ? option.split('/') : option)).flat();

    return positions.filter(({ contract_info }) => {
        const config = getSupportedContracts(isHighLow({ shortcode: contract_info.shortcode }))[
            contract_info.contract_type as keyof ReturnType<typeof getSupportedContracts>
        ];
        if (!config) return false;
        return splittedFilter.includes('main_title' in config ? config.main_title : config.name);
    });
};
const contractTypesConfig = {
    Accumulators: [CONTRACT_TYPES.ACCUMULATOR],
    Vanillas: [CONTRACT_TYPES.VANILLA.CALL, CONTRACT_TYPES.VANILLA.PUT],
    Turbos: [CONTRACT_TYPES.TURBOS.LONG, CONTRACT_TYPES.TURBOS.SHORT],
    Multipliers: [CONTRACT_TYPES.MULTIPLIER.DOWN, CONTRACT_TYPES.MULTIPLIER.UP],
    'Rise/Fall': [CONTRACT_TYPES.CALL, CONTRACT_TYPES.PUT],
    'Higher/Lower': [CONTRACT_TYPES.CALL, CONTRACT_TYPES.PUT],
    'Touch/No touch': [CONTRACT_TYPES.TOUCH.NO_TOUCH, CONTRACT_TYPES.TOUCH.ONE_TOUCH],
    'Matches/Differs': [CONTRACT_TYPES.MATCH_DIFF.DIFF, CONTRACT_TYPES.MATCH_DIFF.MATCH],
    'Even/Odd': [CONTRACT_TYPES.EVEN_ODD.EVEN, CONTRACT_TYPES.EVEN_ODD.ODD],
    'Over/Under': [CONTRACT_TYPES.OVER_UNDER.OVER, CONTRACT_TYPES.OVER_UNDER.UNDER],
};

export const getFilteredContractTypes = (filter: string[] = []) => {
    if (!filter.length) return [];
    const filteredContractTypes = filter
        .map(option => contractTypesConfig[option as keyof typeof contractTypesConfig] ?? [])
        .flat();
    return [...new Set(filteredContractTypes)];
};

export const getProfit = (
    contract_info: TPortfolioPosition['contract_info'] | TClosedPosition['contract_info']
): string | number => {
    return (
        (contract_info as TClosedPosition['contract_info']).profit_loss ??
        (isMultiplierContract(contract_info.contract_type)
            ? getTotalProfit(contract_info as TPortfolioPosition['contract_info'])
            : (contract_info as TPortfolioPosition['contract_info']).profit)
    );
};

export const getTotalPositionsProfit = (positions: (TPortfolioPosition | TClosedPosition)[]) => {
    return positions.reduce((sum, { contract_info }) => sum + Number(getProfit(contract_info)), 0);
};
