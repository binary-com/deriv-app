import classNames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import IconTradeCategory from 'Assets/Trading/Categories/icon-trade-categories';
import { findContractCategory } from '../../../Helpers/contract-type';
import { TContractCategory, TContractType, TList } from './types';
import { useDevice } from '@deriv/hooks';

type TDisplay = {
    is_open: boolean;
    name: string;
    list: TContractCategory[];
    onClick: () => void;
    value: string;
};

const Display = ({ is_open, name, list, onClick, value }: TDisplay) => {
    const { isMobile } = useDevice();
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
            {isMobile ? (
                <Icon icon='IcChevronRight' size={20} className='contract-type-widget__select-arrow--right' />
            ) : (
                <Icon
                    icon='IcChevronDown'
                    className={classNames(
                        'contract-type-widget__select-arrow',
                        'contract-type-widget__select-arrow--left'
                    )}
                />
            )}
        </div>
    );
};

export default Display;
