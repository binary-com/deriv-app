import classNames from 'classnames';
import React from 'react';
import { TPassThrough } from './data-list';

type TRow = {
    [key: string]: string;
};
type TRenderCellContent = {
    cell_value: string;
    is_footer: boolean;
    passthrough?: TPassThrough;
    row_obj: TRow;
};
type TDataListCell = {
    className: string;
    column: {
        col_index: number | string;
        title: string;
        renderCellContent: (props: TRenderCellContent) => React.ReactNode;
        renderHeader: (prop: renderHeaderType) => React.ReactNode;
    };
    is_footer: boolean;
    passthrough?: TPassThrough;
    row: TRow;
};

type renderHeaderType = { title: string };
const DataListCell = ({ className, column, is_footer, passthrough, row }: TDataListCell) => {
    if (!column) return null;
    const { col_index, title } = column;
    const cell_value = row[col_index];
    return (
        <div className={classNames(className, column.col_index)}>
            {!is_footer && (
                <div className={classNames(`${column.col_index}__row-title`, 'data-list__row-title')}>
                    {column.renderHeader ? column.renderHeader({ title }) : title}
                </div>
            )}
            <div className='data-list__row-content'>
                {column.renderCellContent
                    ? column.renderCellContent({ cell_value, is_footer, passthrough, row_obj: row })
                    : cell_value}
            </div>
        </div>
    );
};

export default React.memo(DataListCell);
