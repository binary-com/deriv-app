import React from 'react';
import { TContractInfo } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Loading } from '@deriv/components';
import { EmptyPositions, TEmptyPositionsProps } from 'AppV2/Components/EmptyPositions';
import { TPortfolioPosition } from '@deriv/stores/types';
import { ContractCardList, ContractCardsSections } from 'AppV2/Components/ContractCard';
import { ContractTypeFilter, TimeFilter } from 'AppV2/Components/Filter';
import TotalProfitLoss from 'AppV2/Components/TotalProfitLoss';
import { filterPositions, getTotalPositionsProfit, TAB_NAME } from '../../Utils/positions-utils';
import { TReportsStore, useReportsStore } from '../../../../../reports/src/Stores/useReportsStores';
import useTradeTypeFilter from 'AppV2/Hooks/useTradeTypeFilter';
import useTimeFilter from 'AppV2/Hooks/useTimeFilter';

type TPositionsContentProps = Omit<TEmptyPositionsProps, 'noMatchesFound'> & {
    hasButtonsDemo?: boolean;
    setHasButtonsDemo?: React.Dispatch<React.SetStateAction<boolean>>;
};

export type TClosedPosition = {
    contract_info: TReportsStore['profit_table']['data'][number];
};

const PositionsContent = observer(({ hasButtonsDemo, isClosedTab, setHasButtonsDemo }: TPositionsContentProps) => {
    const { contractTypeFilter, setContractTypeFilter } = useTradeTypeFilter({ isClosedTab });
    const { timeFilter, setTimeFilter, customTimeRangeFilter, setCustomTimeRangeFilter } = useTimeFilter();
    const [filteredPositions, setFilteredPositions] = React.useState<(TPortfolioPosition | TClosedPosition)[]>([]);
    const [noMatchesFound, setNoMatchesFound] = React.useState(false);

    const { common, client, portfolio } = useStore();
    const { server_time = undefined } = isClosedTab ? {} : common; // Server time is required only to update cards timers in Open positions
    const { currency } = client;
    const {
        active_positions,
        is_active_empty,
        is_loading,
        onClickCancel,
        onClickSell,
        onMount: onOpenTabMount,
    } = portfolio;
    const {
        clearTable,
        data,
        fetchNextBatch: fetchMoreClosedPositions,
        handleScroll,
        handleDateChange,
        is_empty,
        is_loading: isFetchingClosedPositions,
        onMount: onClosedTabMount,
        onUnmount: onClosedTabUnmount,
    } = useReportsStore().profit_table;
    const closedPositions = React.useMemo(() => data.map(d => ({ contract_info: d })), [data]);
    const positions = React.useMemo(
        () => (isClosedTab ? closedPositions : active_positions),
        [active_positions, isClosedTab, closedPositions]
    );
    const hasNoActiveFilters = isClosedTab
        ? !timeFilter && !customTimeRangeFilter && !contractTypeFilter.length
        : !contractTypeFilter.length;
    const hasNoPositions = hasNoActiveFilters && (isClosedTab ? is_empty : is_active_empty);
    const shouldShowEmptyMessage = hasNoPositions || noMatchesFound;
    const shouldShowContractCards =
        !!filteredPositions.length && (isClosedTab || (filteredPositions[0]?.contract_info as TContractInfo)?.status);
    const shouldShowLoading = isClosedTab ? isFetchingClosedPositions && !filteredPositions.length : is_loading;
    const shouldShowTakeProfit = !isClosedTab || !!(timeFilter || customTimeRangeFilter);

    const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (isClosedTab) handleScroll(e, true);
    };

    const contractCards = isClosedTab ? (
        <ContractCardsSections
            positions={filteredPositions as TClosedPosition[]}
            isLoadingMore={isFetchingClosedPositions}
            hasBottomMargin={shouldShowTakeProfit}
        />
    ) : (
        <ContractCardList
            currency={currency}
            hasButtonsDemo={hasButtonsDemo}
            onClickCancel={isClosedTab ? undefined : onClickCancel}
            onClickSell={isClosedTab ? undefined : onClickSell}
            positions={filteredPositions}
            setHasButtonsDemo={setHasButtonsDemo}
            serverTime={server_time}
        />
    );

    const onApplyContractTypeFilter = (filters: string[] | []) => {
        setContractTypeFilter(filters);
        if (isClosedTab) {
            clearTable();
            fetchMoreClosedPositions(true);
        }
    };

    React.useEffect(() => {
        if (contractTypeFilter.length) {
            const result = filterPositions(positions, contractTypeFilter);
            setFilteredPositions(result);
            if (!isClosedTab) setNoMatchesFound(!result.length);
        } else {
            setNoMatchesFound(false);
            setFilteredPositions(positions);
        }
        if (isClosedTab)
            setNoMatchesFound(
                !positions.length && !!(timeFilter || customTimeRangeFilter || contractTypeFilter.length)
            );
    }, [isClosedTab, positions, contractTypeFilter, timeFilter, customTimeRangeFilter]);

    React.useEffect(() => {
        isClosedTab ? onClosedTabMount(true) : onOpenTabMount();

        return () => {
            isClosedTab && onClosedTabUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (shouldShowLoading || (!shouldShowContractCards && !shouldShowEmptyMessage))
        return <Loading.DTraderV2 is_positions is_closed_tab={isClosedTab} />;
    return (
        <div
            className={`positions-page__${isClosedTab ? TAB_NAME.CLOSED.toLowerCase() : TAB_NAME.OPEN.toLowerCase()}`}
            onScroll={isClosedTab ? onScroll : undefined}
        >
            {!hasNoPositions && (
                <div className='positions-page__filter__wrapper'>
                    {isClosedTab && (
                        <TimeFilter
                            timeFilter={timeFilter}
                            setTimeFilter={setTimeFilter}
                            handleDateChange={handleDateChange}
                            customTimeRangeFilter={customTimeRangeFilter}
                            setCustomTimeRangeFilter={setCustomTimeRangeFilter}
                            setNoMatchesFound={setNoMatchesFound}
                        />
                    )}
                    <ContractTypeFilter
                        contractTypeFilter={contractTypeFilter}
                        onApplyContractTypeFilter={onApplyContractTypeFilter}
                    />
                </div>
            )}
            {shouldShowEmptyMessage ? (
                <EmptyPositions isClosedTab={isClosedTab} noMatchesFound={noMatchesFound} />
            ) : (
                shouldShowContractCards && (
                    <React.Fragment>
                        {shouldShowTakeProfit && (
                            <TotalProfitLoss
                                positionsCount={filteredPositions.length}
                                currency={currency}
                                hasBottomAlignment={isClosedTab}
                                totalProfitLoss={getTotalPositionsProfit(filteredPositions)}
                            />
                        )}
                        {contractCards}
                    </React.Fragment>
                )
            )}
        </div>
    );
});

export default PositionsContent;
