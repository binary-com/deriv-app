import React from 'react';
import { useTabs } from './WalletsPrimaryTabs';
import './WalletsPrimaryTabList.scss';

type WalletPrimaryTabListProps = {
    list: string[];
};

const WalletsPrimaryTabList = ({ list }: WalletPrimaryTabListProps) => {
    const { activeTabIndex, onChangeTabHandler, setActiveTabIndex } = useTabs();

    const onTabClickHandler = (activeTabIndex: number) => {
        setActiveTabIndex(activeTabIndex);
        onChangeTabHandler?.(activeTabIndex);
    };

    return (
        <div className='wallets-tabs-list' data-list-count={list.length} data-testid='dt_tab_list'>
            {list.map((tab, i) => (
                <button
                    className={`wallets-tabs-list-item wallets-tabs-list-item--${
                        i === activeTabIndex ? 'active' : 'disabled'
                    }`}
                    key={i}
                    onClick={() => onTabClickHandler(i)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default WalletsPrimaryTabList;
