import React from 'react';
import classNames from 'classnames';
import { Tabs, ThemedScrollbars, Div100vhContainer } from '@deriv/components';
import { getCashierOptions } from './provider';
import type { TWallet } from './wallet-modal';

type TWalletModalBodyProps = {
    active_tab_index: number;
    contentScrollHandler: React.UIEventHandler<HTMLDivElement>;
    is_dark: boolean;
    is_mobile: boolean;
    is_wallet_name_visible: boolean;
    setActiveTabIndex: (index: number) => void;
    setIsWalletNameVisible: (value: boolean) => void;
    wallet: TWallet;
};

const WalletModalBody = ({
    active_tab_index,
    contentScrollHandler,
    is_dark,
    is_mobile,
    is_wallet_name_visible,
    setActiveTabIndex,
    setIsWalletNameVisible,
    wallet,
}: TWalletModalBodyProps) => {
    const { is_demo, wallet_type } = wallet;

    const getHeightOffset = React.useCallback(() => {
        const desktop_header_height = '24.4rem';
        const mobile_header_height = '8.2rem';

        return is_mobile ? mobile_header_height : desktop_header_height;
    }, [is_mobile]);

    return (
        <Tabs
            active_icon_color={is_dark ? 'var(--badge-white)' : ''}
            active_index={active_tab_index}
            className={classNames('modal-body__tabs', {
                is_scrolled: !is_wallet_name_visible,
            })}
            has_active_line={false}
            has_bottom_line={false}
            header_fit_content
            icon_size={16}
            icon_color={is_demo ? 'var(--demo-text-color-1)' : ''}
            is_scrollable={false}
            onTabItemClick={(index: number) => {
                setActiveTabIndex(index);
            }}
        >
            {getCashierOptions(wallet_type).map(option => {
                return (
                    <div key={option.label} icon={option.icon} label={option.label}>
                        <ThemedScrollbars
                            className='dc-tabs--modal-body__tabs__themed-scrollbar'
                            is_scrollbar_hidden={is_mobile}
                            onScroll={contentScrollHandler}
                        >
                            <Div100vhContainer height_offset={getHeightOffset()}>
                                <div className='dc-tabs--modal-body__tabs__content-wrapper'>
                                    {option.content({
                                        is_wallet_name_visible,
                                        setIsWalletNameVisible,
                                        wallet,
                                    })}
                                </div>
                            </Div100vhContainer>
                        </ThemedScrollbars>
                    </div>
                );
            })}
        </Tabs>
    );
};

export default WalletModalBody;
