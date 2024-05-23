import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';

type TAccountLimitsTableCell = {
    align: 'right' | 'left';
    is_hint: boolean;
    level: string;
    renderExtraInfo: () => React.ReactElement;
};

const AccountLimitsTableCell = ({
    align,
    children,
    is_hint,
    level,
    renderExtraInfo,
}: React.PropsWithChildren<Partial<TAccountLimitsTableCell>>) => {
    const text_size = is_hint ? 'xxxs' : 'xxs';

    return (
        <td
            className={classNames('da-account-limits__table-cell', {
                'da-account-limits__table-cell--left': align !== 'right',
                'da-account-limits__table-cell--right': align === 'right',
                'da-account-limits__table-cell--submarket': level === 'submarket',
            })}
            data-testid='account_limit_table_cell'
        >
            {children && (
                <Text
                    align={align}
                    as='p'
                    color='prominent'
                    size={text_size}
                    line_height='m'
                    data-testid='account_limit_table_cell_text'
                >
                    {children}
                </Text>
            )}
            {renderExtraInfo?.()}
        </td>
    );
};

export default AccountLimitsTableCell;
