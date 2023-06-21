import React from 'react';
import { Icon, Text } from '@deriv/components';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { observer, useStore } from '@deriv/stores';
import { TWalletAccount } from 'Types';
import { useWalletModalActionHandler } from '@deriv/hooks';

type TWalletButton = {
    name: string;
    text: string;
    icon: string;
    action: () => void;
};

type TWalletHeaderButtons = {
    is_disabled: boolean;
    is_open: boolean;
    btns: TWalletButton[];
    wallet_account: TWalletAccount;
};

const WalletHeaderButtons = observer(({ is_disabled, is_open, btns, wallet_account }: TWalletHeaderButtons) => {
    const { ui, traders_hub } = useStore();
    const { setIsWalletModalVisible } = ui;
    const { setWalletModalActiveWalletID } = traders_hub;
    const { handleAction } = useWalletModalActionHandler();

    const handleOnClick = async (btn: TWalletButton) => {
        handleAction(btn.name);
        setIsWalletModalVisible(true);
        setWalletModalActiveWalletID(wallet_account.loginid);
    };

    return (
        <div className='wallet-header__description-buttons'>
            {btns.map(btn => (
                <div
                    key={btn.name}
                    className={classNames('wallet-header__description-buttons-item', {
                        'wallet-header__description-buttons-item-disabled': is_disabled,
                    })}
                    onClick={() => handleOnClick(btn)}
                >
                    <Icon
                        icon={btn.icon}
                        custom_color={is_disabled ? 'var(--general-disabled)' : 'var(--text-general)'}
                    />
                    <CSSTransition
                        appear
                        in={is_open}
                        timeout={240}
                        classNames='wallet-header__description-buttons-item-transition'
                        unmountOnExit
                    >
                        <Text
                            weight='bold'
                            color={is_disabled ? 'disabled' : 'general'}
                            size='xs'
                            className='wallet-header__description-buttons-item-text'
                        >
                            {btn.text}
                        </Text>
                    </CSSTransition>
                </div>
            ))}
        </div>
    );
});
export default WalletHeaderButtons;
