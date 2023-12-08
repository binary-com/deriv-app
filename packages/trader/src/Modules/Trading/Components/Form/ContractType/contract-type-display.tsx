import classNames from 'classnames';
import React from 'react';
import { Icon, DesktopWrapper } from '@deriv/components';
import IconTradeCategory from 'Assets/Trading/Categories/icon-trade-categories';
import { findContractCategory } from '../../../Helpers/contract-type';
import { TContractCategory, TContractType, TList } from './types';

type TDisplay = {
    is_open: boolean;
    name: string;
    list: TContractCategory[];
    onClick: () => void;
    value: string;
};

const Display = ({ is_open, name, list, onClick, value }: TDisplay) => {
    // React.useMemo(() => {
    //     if ((window as any).hj) (window as any).hj('event', `selected_${value}_contract_type`);
    // }, [value]);

    const getDisplayText = () =>
        findContractCategory(list as unknown as TList[], { value })?.contract_types?.find((item: TContractType) =>
            item.value.includes(value)
        )?.text;

    return (
        <div
            data-testid='dt_contract_dropdown'
            className={classNames('contract-type-widget__display', {
                'contract-type-widget__display--clicked': is_open,
            })}
            onClick={onClick}
        >
            <IconTradeCategory category={value} className='contract-type-widget__icon-wrapper' />
            <span data-name={name} data-value={value}>
                {getDisplayText()}
            </span>
            <DesktopWrapper>
                <Icon
                    icon='IcChevronDown'
                    className={classNames(
                        'contract-type-widget__select-arrow',
                        'contract-type-widget__select-arrow--left'
                    )}
                />
            </DesktopWrapper>
        </div>
    );
};

export default Display;
