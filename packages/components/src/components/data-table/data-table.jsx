import classNames from 'classnames';
// import { List } from 'react-virtualized/dist/es/List';
import PropTypes from 'prop-types';
import React from 'react';
// import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { FixedSizeList as List } from "react-window";
// import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import TableRow from './table-row.jsx';
import ThemedScrollbars from '../themed-scrollbars';
import ResizeObserver from "resize-observer-polyfill";

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

const DataTable = ({
    children,
    className,
    columns,
    content_loader,
    data_source,
    footer,
    getActionColumns,
    getRowAction,
    getRowSize,
    id,
    keyMapper,
    onScroll,
    passthrough,
    preloaderCheck,
}) => {
    const cache_ref = React.useRef();
    const list_ref = React.useRef();
    const is_dynamic_height = !getRowSize;
    const [scroll_top, setScrollTop] = React.useState(0);
    const [is_loading, setLoading] = React.useState(true);
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const my_ref = React.useRef(null);




    React.useEffect(() => {
        const el = my_ref.current;
        if (!el) return;

        function handleResize() {
            const { height, width } = el.getBoundingClientRect();
            setHeight(height);
            setWidth(width);
        }

        // resize observer is a tool you can use to watch for size changes efficiently
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, []);

    const handleScroll = ev => {
        setScrollTop(ev.target.scrollTop);
        if (typeof onScroll === 'function') onScroll(ev);
    };

    const rowRenderer = ({ style, index, _key, parent }) => {
        const item = data_source[index];
        const action = getRowAction && getRowAction(item);
        const contract_id = item?.contract_id || item?.id;
        const row_key = keyMapper?.(item) || _key;

        // If row content is complex, consider rendering a light-weight placeholder while scrolling.
        const getContent = ({ measure } = {}) => (
            <TableRow
                className={className}
                columns={columns}
                content_loader={content_loader}
                getActionColumns={getActionColumns}
                id={contract_id}
                key={id}
                measure={measure}
                passthrough={passthrough}
                replace={typeof action === 'object' ? action : undefined}
                row_obj={item}
                show_preloader={typeof preloaderCheck === 'function' ? preloaderCheck(item) : false}
                to={typeof action === 'string' ? action : undefined}
                is_dynamic_height={is_dynamic_height}
            />
        );

        return is_dynamic_height ? (
            // <CellMeasurer cache={cache_ref.current} columnIndex={0} key={row_key} rowIndex={index} parent={parent}>
            <>
                {/* {({ measure }) => <div style={style}>{getContent({ measure })}</div>} */}
                <div key={row_key} style={style}>{getContent()}</div>
            </>
            // </CellMeasurer>
        ) : (
            <div key={row_key} style={style}>
                {getContent()}
            </div>
        );
    };

    // if (is_loading) {
    //     return <div />;
    // }
    return (
        <div
            className={classNames('table', {
                [`${className}`]: className,
                [`${className}__table`]: className,
                [`${className}__content`]: className,
            })}
        >
            <div className='table__head'>
                <TableRow
                    className={className}
                    columns={columns}
                    content_loader={content_loader}
                    getActionColumns={getActionColumns}
                    is_header
                />
            </div>
            <div className='table__body' ref={my_ref}>
                <ThemedScrollbars autoHide onScroll={handleScroll}>
                    <List ref={list_ref} height={height} width={width} itemCount={data_source.length} itemSize={63}>
                        {rowRenderer}
                    </List>
                </ThemedScrollbars>
            </div>

            {footer && (
                <div className='table__foot'>
                    <TableRow
                        className={className}
                        columns={columns}
                        content_loader={content_loader}
                        getActionColumns={getActionColumns}
                        is_footer
                        row_obj={footer}
                    />
                </div>
            )}
        </div>
    );
};

DataTable.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    className: PropTypes.string,
    columns: PropTypes.array,
    data_source: PropTypes.array,
    footer: PropTypes.object,
    getRowAction: PropTypes.func,
    getRowSize: PropTypes.func,
    onScroll: PropTypes.func,
    passthrough: PropTypes.object,
};

export default DataTable;
