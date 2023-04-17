import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, Icon, MobileDialog, MobileWrapper, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from '../../../../Stores/connect';
import ExpandedTicksHistory from './expanded-ticks-history';
import TicksHistoryCounter from './ticks-history-counter';
import { AccumulatorsStatsManualModal } from './accumulators-stats-manual-modal';
import 'Sass/app/modules/contract/accumulators-stats.scss';
import { useStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';

type TAccumulatorStats = {
    is_dark_theme?: ReturnType<typeof useStore>['ui']['is_dark_mode_on'];
    is_expandable?: boolean;
    ticks_history_stats: {
        ticks_stayed_in?: ReturnType<typeof useStore>['trade']['tick_history_stats']['ticks_stayed_in'];
    };
};
export const ROW_SIZES = {
    DESKTOP_COLLAPSED: 10,
    DESKTOP_EXPANDED: 10,
    MOBILE_COLLAPSED: 15,
    MOBILE_EXPANDED: 5,
};

const AccumulatorsStats = ({ is_dark_theme, is_expandable = true, ticks_history_stats = {} }: TAccumulatorStats) => {
    const [is_collapsed, setIsCollapsed] = React.useState(true);
    const [is_manual_open, setIsManualOpen] = React.useState(false);
    const widget_title = localize('Stats');
    const ticks_history = ticks_history_stats?.ticks_stayed_in || [];
    const history_text_size = isDesktop() || !is_collapsed ? 'xxs' : 'xxxs';

    const rows = ticks_history.reduce((acc: number[][], _el, index) => {
        const desktop_row_size = is_collapsed ? ROW_SIZES.DESKTOP_COLLAPSED : ROW_SIZES.DESKTOP_EXPANDED;
        const mobile_row_size = is_collapsed ? ROW_SIZES.MOBILE_COLLAPSED : ROW_SIZES.MOBILE_EXPANDED;
        const row_size = isDesktop() ? desktop_row_size : mobile_row_size;
        if (index % row_size === 0) {
            acc.push(ticks_history.slice(index, index + row_size));
        }
        return acc;
    }, []);

    if (!ticks_history.length) return null;

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
                    <Text weight='bold' size={isMobile() ? 'xxxs' : 'xxs'} className='accumulators-stats__title-text'>
                        {widget_title}
                    </Text>
                </div>
                <Text size={history_text_size} className='accumulators-stats__history'>
                    {!is_collapsed ? (
                        <div className='accumulators-stats__history-heading'>{localize('Number of ticks')}</div>
                    ) : (
                        rows[0]?.map((el, i) => <TicksHistoryCounter key={i} value={el} has_progress_dots={i === 0} />)
                    )}
                </Text>
            </div>
            {is_expandable && !is_collapsed && (
                <React.Fragment>
                    <DesktopWrapper>
                        <ExpandedTicksHistory history_text_size={history_text_size} rows={rows} />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            onClose={() => setIsCollapsed(!is_collapsed)}
                            portal_element_id='modal_root'
                            title={widget_title}
                            visible={!is_collapsed}
                            wrapper_classname='accumulators-stats'
                        >
                            <ExpandedTicksHistory history_text_size={history_text_size} rows={rows} />
                        </MobileDialog>
                    </MobileWrapper>
                </React.Fragment>
            )}
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
};

export default connect(({ modules, ui }: TCoreStores) => ({
    is_dark_theme: ui.is_dark_mode_on,
    ticks_history_stats: modules.trade.ticks_history_stats,
}))(AccumulatorsStats);
