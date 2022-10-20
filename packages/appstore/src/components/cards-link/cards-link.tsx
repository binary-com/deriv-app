import React from 'react';
import { Icon } from '@deriv/components';
import AppStoreSkeletonCard from 'Components/skeleton-card';

type TCardsLinkDetails = {
    app_card?: React.ReactNode;
    wallet_card?: React.ReactNode;
    is_linked: boolean;
};

const CardsLink = ({ app_card, wallet_card, is_linked }: TCardsLinkDetails) => {
    return (
        <>
            {(!is_linked || !wallet_card || !app_card) && (
                <div className='unlinked-cards' data-testid='unlinked-cards'>
                    <div
                        className={`unlinked-cards__wallet-card ${
                            wallet_card && !app_card && 'unlinked-cards__wallet-card--overlap'
                        }`}
                    >
                        {wallet_card || <AppStoreSkeletonCard label='Wallet' />}
                    </div>
                    <div className='unlinked-cards__app-card'>
                        <div className='unlinked-cards__app-card__link-element'>
                            <div className='unlinked-cards__app-card__link-element__horizontal-line' />
                            <div className='unlinked-cards__app-card__link-element__vertical-line' />
                            <Icon
                                icon='IcAppstoreLinkWallet'
                                width='11.45'
                                height='16'
                                className='unlinked-cards__app-card__link-element__link-icon'
                            />
                        </div>
                        {app_card || <AppStoreSkeletonCard label='App' />}
                    </div>
                </div>
            )}
            {is_linked && wallet_card && app_card && (
                <div className='linked-cards' data-testid='linked-cards'>
                    {wallet_card}
                    <div className='linked-cards__link-element'>
                        <Icon icon='IcAppstoreLinkedWallets' width='9.5' height='13.27' />
                    </div>
                    <div className='linked-cards__app-card'>{app_card}</div>
                </div>
            )}
        </>
    );
};

export default CardsLink;
