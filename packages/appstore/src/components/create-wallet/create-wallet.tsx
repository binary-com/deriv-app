import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize, Localize } from '@deriv/translations';
import { Icon, Loading, Text, ThemedScrollbars } from '@deriv/components';
import WalletCard from 'Components/wallet';
import WalletIcon from 'Assets/svgs/wallet';

type TCreateWallet = {
    dark: boolean;
    should_show_fiat: boolean;
    setShouldShowFiat: (show: boolean) => void;
    setSeletedWallet: (wallet: string) => void;
    selected_wallet?: string;
};

const CreateWallet = ({
    dark,
    should_show_fiat,
    setShouldShowFiat,
    setSeletedWallet,
    selected_wallet,
}: TCreateWallet) => {
    const { wallet_store } = useStores();

    React.useEffect(() => {
        wallet_store.onMount();
    }, []);

    const wallets = should_show_fiat ? wallet_store.wallet_provider.fiat_wallets : wallet_store.wallet_provider.wallets;

    const header_title = should_show_fiat ? localize('Fiat currency wallets') : localize('Create a wallet');
    const header_content = should_show_fiat
        ? localize('These are all the options you get when choosing fiat wallet.')
        : localize('Choose a payment method for your wallet.');

    const onWalletClicked = (wallet: string) => {
        if (!should_show_fiat) {
            setSeletedWallet(wallet);
        }
    };

    const snakeToPascal = (string: string) => {
        return string
            .split('_')
            .map(substr => substr.charAt(0).toUpperCase() + substr.slice(1))
            .join('');
    };

    if (wallet_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <div className='create-wallet'>
            <div className='create-wallet-title'>
                {should_show_fiat && (
                    <Icon icon='IcArrowLeft' className='create-wallet-back' onClick={() => setShouldShowFiat(false)} />
                )}
                <div>
                    <Text align='left' size='m' as='h2' weight='bold'>
                        <Localize i18n_default_text={header_title} />
                    </Text>
                    <Text align='left' size='s' as='p' line_height='xxl'>
                        <Localize i18n_default_text={header_content} />
                    </Text>
                </div>
            </div>
            <ThemedScrollbars className='create-wallet-scroll'>
                {wallets?.map((wallet, index) => {
                    return (
                        <div key={`${wallet.getTitle()}${index}`} className='create-wallet-detail'>
                            <div className='create-wallet-detail-title'>
                                <Text align='left' size='s' weight='bold' className='create-wallet-detail-title__text'>
                                    {wallet.getTitle()}
                                </Text>
                                {wallet?.has_information && (
                                    <Icon icon='IcInfoOutline' onClick={() => setShouldShowFiat(true)} />
                                )}
                            </div>
                            <div
                                className={classNames('create-wallet-list__items', {
                                    'create-wallet-list__items__center': wallet.content?.length < 5,
                                })}
                            >
                                {wallet.content?.sort()?.map((wallet_name: string, id: number) => {
                                    const name = snakeToPascal(wallet_name || '');
                                    const wallet_logo = `${name}${dark ? 'Dark' : 'Light'}`;
                                    const is_wallet_selected = selected_wallet === wallet_name;
                                    if (wallet_name) {
                                        return (
                                            <div
                                                key={`${wallet_name}${id}`}
                                                className={classNames(
                                                    'create-wallet-card-button',
                                                    // { 'wallet-radio-button--disabled': is_disabled },
                                                    { 'create-wallet-card-button__pointer': !should_show_fiat }
                                                )}
                                                onClick={() => onWalletClicked(wallet_name)}
                                            >
                                                {is_wallet_selected && (
                                                    <Icon icon='IcAppstoreCheck' className='create-wallet-card-icon' />
                                                )}

                                                <div
                                                    className={classNames('create-wallet-card-button__icon__border', {
                                                        'create-wallet-card-button__icon__border--red':
                                                            is_wallet_selected,
                                                    })}
                                                >
                                                    {should_show_fiat && (
                                                        <div className='create-wallet-fiat-icon'>
                                                            <WalletIcon icon={wallet_logo} />
                                                        </div>
                                                    )}
                                                    {!should_show_fiat && (
                                                        <WalletCard size='small' wallet_name={wallet_name} />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return <></>;
                                })}
                            </div>
                        </div>
                    );
                })}
            </ThemedScrollbars>
        </div>
    );
};

export default observer(CreateWallet);
