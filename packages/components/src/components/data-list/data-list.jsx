import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { List } from 'react-virtualized/dist/es/List';
import { isMobile, isDesktop } from '@deriv/shared';
import DataListCell from './data-list-cell.jsx';
import DataListRow from './data-list-row.jsx';
import ThemedScrollbars from '../themed-scrollbars';

const DataList = React.memo(
    ({
        children,
        className,
        data_source,
        footer,
        getRowSize,
        keyMapper,
        onRowsRendered,
        onScroll,
        setListRef,
        desc_titles,
        ...other_props
    }) => {
        const [is_loading, setLoading] = React.useState(true);
        const [is_scrolling, setIsScrolling] = React.useState(false);
        const [scroll_top, setScrollTop] = React.useState(0);

        const cache = React.useRef();
        const list_ref = React.useRef();
        const items_transition_map_ref = React.useRef({});
        const data_source_ref = React.useRef();
        data_source_ref.current = data_source;

        const is_dynamic_height = !getRowSize;

        const trackItemsForTransition = React.useCallback(() => {
            data_source.forEach((item, index) => {
                const row_key = keyMapper?.(item) || `${index}-0`;
                items_transition_map_ref.current[row_key] = true;
            });
        }, [data_source, keyMapper]);

        React.useEffect(() => {
            if (is_dynamic_height) {
                cache.current = new CellMeasurerCache({
                    fixedWidth: true,
                    keyMapper: row_index => {
                        if (row_index < data_source_ref.current.length)
                            return keyMapper?.(data_source_ref.current[row_index]) || row_index;
                        return row_index;
                    },
                });
            }
            trackItemsForTransition();
            setLoading(false);
        }, []); // eslint-disable-line react-hooks/exhaustive-deps

        React.useEffect(() => {
            if (is_dynamic_height) {
                list_ref.current?.recomputeGridSize(0);
            }
            trackItemsForTransition();
        }, [data_source, is_dynamic_height, trackItemsForTransition]);

        const footerRowRenderer = () => {
            return <React.Fragment>{other_props.rowRenderer({ row: footer, is_footer: true })}</React.Fragment>;
        };

        const rowRenderer = ({ style, index, key, parent }) => {
            const { getRowAction, passthrough, row_gap } = other_props;
            const row = data_source[index];
            const action = getRowAction && getRowAction(row);
            const destination_link = typeof action === 'string' ? action : undefined;
            const action_desc = typeof action === 'object' ? action : undefined;
            const row_key = keyMapper?.(row) || key;

            const getContent = ({ measure } = {}) => (
                <DataListRow
                    action_desc={action_desc}
                    desc_titles={desc_titles}
                    destination_link={destination_link}
                    is_new_row={!items_transition_map_ref.current[row_key]}
                    is_scrolling={is_scrolling}
                    measure={measure}
                    passthrough={passthrough}
                    row_gap={row_gap}
                    row_key={row_key}
                    row={row}
                    rowRenderer={other_props.rowRenderer}
                />
            );

            return is_dynamic_height ? (
                <CellMeasurer cache={cache.current} columnIndex={0} key={row_key} rowIndex={index} parent={parent}>
                    {({ measure }) => <div style={style}>{getContent({ measure })}</div>}
                </CellMeasurer>
            ) : (
                <div key={row_key} style={style}>
                    {getContent()}
                </div>
            );
        };

        const handleScroll = ev => {
            clearTimeout(timeout);
            if (!is_scrolling) {
                setIsScrolling(true);
            }
            const timeout = setTimeout(() => {
                if (!is_loading) {
                    setIsScrolling(false);
                }
            }, 200);

            setScrollTop(ev.target.scrollTop);
            if (typeof onScroll === 'function') {
                onScroll(ev);
            }
        };

        const setRef = ref => {
            list_ref.current = ref;
            if (typeof setListRef === 'function') {
                setListRef(ref);
            }
        };

        if (is_loading) {
            return <div />;
        }
        return (
            <div
                className={classNames(className, 'data-list', {
                    [`${className}__data-list`]: className,
                })}
            >
                <div className='data-list__body-wrapper'>
                    <div className={classNames('data-list__body', { [`${className}__data-list-body`]: className })}>
                        <AutoSizer>
                            {({ width, height }) => (
                                // Don't remove `TransitionGroup`. When `TransitionGroup` is removed, transition life cycle events like `onEntered` won't be fired sometimes on it's `CSSTransition` children
                                <TransitionGroup style={{ height, width }}>
                                    <ThemedScrollbars onScroll={handleScroll} autoHide is_bypassed={isMobile()}>
                                        <List
                                            className={className}
                                            deferredMeasurementCache={cache.current}
                                            height={height}
                                            onRowsRendered={onRowsRendered}
                                            overscanRowCount={1}
                                            ref={ref => setRef(ref)}
                                            rowCount={data_source.length}
                                            rowHeight={is_dynamic_height ? cache?.current.rowHeight : getRowSize}
                                            rowRenderer={rowRenderer}
                                            scrollingResetTimeInterval={0}
                                            width={width}
                                            {...(isDesktop()
                                                ? { scrollTop: scroll_top, autoHeight: true }
                                                : { onScroll: target => handleScroll({ target }) })}
                                        />
                                    </ThemedScrollbars>
                                </TransitionGroup>
                            )}
                        </AutoSizer>
                    </div>
                    {children}
                </div>
                {footer && (
                    <div
                        className={classNames('data-list__footer', {
                            [`${className}__data-list-footer`]: className,
                        })}
                    >
                        {footerRowRenderer()}
                    </div>
                )}
            </div>
        );
    }
);

DataList.Cell = DataListCell;
DataList.propTypes = {
    className: PropTypes.string,
    data_source: PropTypes.array,
    desc_titles: PropTypes.arrayOf(PropTypes.string),
    footer: PropTypes.object,
    getRowAction: PropTypes.func,
    getRowSize: PropTypes.func,
    keyMapper: PropTypes.func,
    onRowsRendered: PropTypes.func,
    onScroll: PropTypes.func,
    passthrough: PropTypes.object,
    row_gap: PropTypes.number,
    setListRef: PropTypes.func,
};

export default DataList;
