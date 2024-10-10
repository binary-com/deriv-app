import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useActiveWalletAccount, useMT5AccountsList, useTradingPlatformStatus } from '@deriv/api-v2';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Loader, Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import useIsRtl from '../../../../../hooks/useIsRtl';
import { THooks } from '../../../../../types';
import { getMarketTypeDetails, MARKET_TYPE, PRODUCT, TRADING_PLATFORM_STATUS } from '../../../constants';
import { JurisdictionModal, MT5PasswordModal, TradingPlatformStatusModal } from '../../../modals';
import './AvailableMT5AccountsList.scss';

const LazyVerification = lazy(
    () => import(/* webpackChunkName: "wallets-client-verification" */ '../../ClientVerification/ClientVerification')
);

type TProps = {
    account: THooks.AvailableMT5Accounts;
};

const AvailableMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { getPlatformStatus } = useTradingPlatformStatus();
    const { localize } = useTranslations();
    const isRtl = useIsRtl();
    const { setModalState, show } = useModal();
    const { description, title } = getMarketTypeDetails(localize, account.product)[
        account.market_type || MARKET_TYPE.ALL
    ];
    const [showMt5PasswordModal, setShowMt5PasswordModal] = useState(false);
    const { data: mt5Accounts } = useMT5AccountsList();
    const platformStatus = getPlatformStatus(account.platform);
    const hasUnavailableAccount = mt5Accounts?.some(account => account.status === 'unavailable');

    const onButtonClick = useCallback(() => {
        if (hasUnavailableAccount) return show(<TradingPlatformStatusModal isServerMaintenance={false} />);

        switch (platformStatus) {
            case TRADING_PLATFORM_STATUS.MAINTENANCE:
                return show(<TradingPlatformStatusModal isServerMaintenance />);
            case TRADING_PLATFORM_STATUS.UNAVAILABLE:
                return show(<TradingPlatformStatusModal />);
            case TRADING_PLATFORM_STATUS.ACTIVE:
            default:
                if (activeWallet?.is_virtual || account.product === PRODUCT.SWAPFREE) {
                    show(
                        <MT5PasswordModal
                            isVirtual={activeWallet?.is_virtual}
                            marketType={account?.market_type || 'synthetic'}
                            platform={account.platform}
                            product={account.product}
                        />
                    );
                } else if (account.product === PRODUCT.ZEROSPREAD) {
                    show(
                        <Suspense fallback={<Loader />}>
                            <LazyVerification
                                onCompletion={() => {
                                    setShowMt5PasswordModal(true);
                                }}
                                selectedJurisdiction={account.shortcode}
                            />
                        </Suspense>
                    );
                } else {
                    show(<JurisdictionModal />);
                }
                setModalState('marketType', account.market_type);
                setModalState('selectedJurisdiction', account.shortcode);
                break;
        }
    }, [
        hasUnavailableAccount,
        show,
        platformStatus,
        account.platform,
        account.market_type,
        account.product,
        account.shortcode,
        activeWallet?.is_virtual,
        setModalState,
    ]);

    useEffect(() => {
        if (showMt5PasswordModal) {
            show(
                <MT5PasswordModal
                    isVirtual={activeWallet?.is_virtual}
                    marketType={account?.market_type || 'all'}
                    platform={account.platform}
                    product={account.product}
                />
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showMt5PasswordModal]);

    return (
        <TradingAccountCard onClick={onButtonClick}>
            <TradingAccountCard.Icon className='wallets-available-mt5__icon'>
                {getMarketTypeDetails(localize, account.product)[account.market_type || MARKET_TYPE.ALL].icon}
            </TradingAccountCard.Icon>
            <TradingAccountCard.Section>
                <TradingAccountCard.Content className='wallets-available-mt5__details'>
                    <div className='wallets-available-mt5__title'>
                        <Text align='start' size='sm'>
                            {title}
                        </Text>
                        {account.product === PRODUCT.ZEROSPREAD && (
                            <div className='wallets-available-mt5__badge'>
                                <Text align='start' size='xs' weight='bold'>
                                    <Localize i18n_default_text='NEW' />
                                </Text>
                            </div>
                        )}
                    </div>
                    <Text align='start' size='xs'>
                        {description}
                    </Text>
                </TradingAccountCard.Content>
                <TradingAccountCard.Button className='wallets-available-mt5__icon'>
                    {isRtl ? (
                        <LabelPairedChevronLeftCaptionRegularIcon width={16} />
                    ) : (
                        <LabelPairedChevronRightCaptionRegularIcon width={16} />
                    )}
                </TradingAccountCard.Button>
            </TradingAccountCard.Section>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
