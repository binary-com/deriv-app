import React from 'react';
import { Icon, Text } from '@deriv/components';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { observer, useStore } from '@deriv/stores';
import { TWalletAccount } from 'Types';

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
    data: TWalletAccount;
};

const WalletHeaderButtons = observer(({ is_disabled, is_open, btns, data }: TWalletHeaderButtons) => {
    const { client, ui, traders_hub } = useStore();

    const { switchAccount, loginid } = client;

    const { setIsWalletModalVisible } = ui;

    const { setWalletModalActiveTabIndex } = traders_hub;

    const handleAction = (name: string) => {
        const actionMap = { Deposit: 0, Withdraw: 1, Transfer: 2, Transactions: 3 };
        const tabIndex = actionMap[name as keyof typeof actionMap];

        if (tabIndex !== undefined) {
            setWalletModalActiveTabIndex(tabIndex);
        }
    };

    return (
        <div className='wallet-header__description-buttons'>
            {btns.map(btn => (
                <div
                    key={btn.name}
                    className={classNames('wallet-header__description-buttons-item', {
                        'wallet-header__description-buttons-item-disabled': is_disabled,
                    })}
                    onClick={async () => {
                        setIsWalletModalVisible(true);
                        handleAction(btn.name);
                        if (loginid !== data.loginid) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            switchAccount(data.loginid);
                        }
                    }}
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
