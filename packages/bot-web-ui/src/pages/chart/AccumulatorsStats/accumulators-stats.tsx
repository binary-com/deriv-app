import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Icon, MobileDialog, Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { localize } from '@deriv/translations';
import ExpandedTicksHistory from './expanded-ticks-history';
import TicksHistoryCounter from './ticks-history-counter';
import { AccumulatorsStatsManualModal } from './accumulators-stats-manual-modal';
// import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';
import Accumulators from '@deriv/bot-skeleton/src/services/api/accumlators';
import { DBot } from '@deriv/bot-skeleton';
import { useDBotStore } from 'Stores/useDBotStore';

type TAccumulatorStats = {
    is_expandable?: boolean;
};
export const ROW_SIZES = {
    DESKTOP_COLLAPSED: 10,
    DESKTOP_EXPANDED: 10,
    MOBILE_COLLAPSED: 15,
    MOBILE_EXPANDED: 5,
};

const AccumulatorsStats = observer(({ is_expandable = true }: TAccumulatorStats) => {
    const { ui } = useStore();
    const { dashboard } = useDBotStore();
    const { accumulated_stats } = dashboard;

    const { is_dark_mode_on: is_dark_theme } = ui;
    const { isDesktop, isMobile } = useDevice();

    const [is_collapsed, setIsCollapsed] = React.useState(true);
    const [is_manual_open, setIsManualOpen] = React.useState(false);
    const widget_title = localize('Stats');

    const history_text_size = isDesktop || !is_collapsed ? 'xxs' : 'xxxs';

    const rows = accumulated_stats.reduce((acc: number[][], _el, index) => {
        const desktop_row_size = is_collapsed ? ROW_SIZES.DESKTOP_COLLAPSED : ROW_SIZES.DESKTOP_EXPANDED;
        const mobile_row_size = is_collapsed ? ROW_SIZES.MOBILE_COLLAPSED : ROW_SIZES.MOBILE_EXPANDED;
        const row_size = isMobile ? mobile_row_size : desktop_row_size;
        if (index % row_size === 0) {
            acc.push(accumulated_stats.slice(index, index + row_size));
        }
        return acc;
    }, []);

    if (!accumulated_stats.length) return null;

    return (
        <div className='accumulators-stats'>
            <div className={classNames('accumulators-stats__container--collapsed')}>
                <div className='accumulators-stats__title'>
                    <AccumulatorsStatsManualModal
                        is_dark_theme={is_dark_theme}
                        icon_classname='info'
                        is_manual_open={is_manual_open}
                        title={widget_title}
                        toggleManual={() => setIsManualOpen(!is_manual_open)}
                    />
                    <Text weight='bold' size={isMobile ? 'xxxs' : 'xxs'} className='accumulators-stats__title-text'>
                        {widget_title}
                    </Text>
                </div>
                <Text size={history_text_size} className='accumulators-stats__history'>
                    {!is_collapsed ? (
                        <div className='accumulators-stats__history-heading'>{localize('Number of ticks')}</div>
                    ) : (
                        rows[0]?.map((el, i) => (
                            <TicksHistoryCounter
                                ticks_history_counter_testid='dt_accu_stats_history_counter'
                                key={i}
                                value={el}
                                has_progress_dots={i === 0}
                            />
                        ))
                    )}
                </Text>
            </div>
            {is_expandable &&
                !is_collapsed &&
                (isDesktop ? (
                    <ExpandedTicksHistory history_text_size={history_text_size} rows={rows} />
                ) : (
                    <MobileDialog
                        onClose={() => setIsCollapsed(!is_collapsed)}
                        portal_element_id='modal_root'
                        title={widget_title}
                        visible={!is_collapsed}
                        wrapper_classname='accumulators-stats'
                    >
                        <ExpandedTicksHistory history_text_size={history_text_size} rows={rows} />
                    </MobileDialog>
                ))}
            {is_expandable && (
                <Icon
                    icon={is_collapsed ? 'IcArrowUp' : 'IcArrowDown'}
                    onClick={() => setIsCollapsed(!is_collapsed)}
                    className='accordion-toggle-arrow'
                    data_testid='dt_accordion-toggle-arrow'
                />
            )}
        </div>
    );
});

export default AccumulatorsStats;
