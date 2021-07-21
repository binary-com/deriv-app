import React from 'react';
import classNames from 'classnames';
import Head from './table-head.jsx';
import Header from './table-header.jsx';
import Footer from './table-footer.jsx';
import Body from './table-body.jsx';
import Row from './table-row.jsx';
import Cell from './table-cell.jsx';
import ThemedScrollbars from '../themed-scrollbars/themed-scrollbars.jsx';

// TODO: update the <Table /> component to fit with the DataTable in Trader
const Table = ({ className, fixed, children, scroll_width, scroll_height }) => (
    <div
        role='table'
        className={classNames('dc-table', className, {
            'dc-table--scroll': fixed,
        })}
    >
        {fixed ? (
            <ThemedScrollbars
                has_horizontal
                width={scroll_width || '100%'}
                height={scroll_height}
                className={'dc-table--scrollbar'}
            >
                {children}
            </ThemedScrollbars>
        ) : (
            children
        )}
    </div>
);

Table.Head = Head;
Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;
Table.Footer = Footer;

export default Table;
