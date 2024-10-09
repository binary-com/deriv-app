import React, { useCallback } from 'react';
import { useActiveWalletAccount, useMT5AccountsList, useTradingPlatformStatus } from '@deriv/api-v2';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import useIsRtl from '../../../../../hooks/useIsRtl';
import { THooks } from '../../../../../types';
import { getMarketTypeDetails, MARKET_TYPE, PRODUCT, TRADING_PLATFORM_STATUS } from '../../../constants';
import { ClientVerificationModal, MT5PasswordModal, TradingPlatformStatusModal } from '../../../modals';
import { TModifiedMT5Accounts } from '../../../types';
import { getClientVerification } from '../../../utils';
import './AvailableMT5AccountsList.scss';

type TProps = {
    account: THooks.SortedMT5Accounts;
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
    const { data: mt5Accounts } = useMT5AccountsList();
    const platformStatus = getPlatformStatus(account.platform);
    const hasUnavailableAccount = mt5Accounts?.some(account => account.status === 'unavailable');
    const isVirtual = activeWallet?.is_virtual;
    const { hasClientKycStatus } = getClientVerification(account as TModifiedMT5Accounts);

    const onButtonClick = useCallback(() => {
        if (hasUnavailableAccount) return show(<TradingPlatformStatusModal isServerMaintenance={false} />);

        switch (platformStatus) {
            case TRADING_PLATFORM_STATUS.MAINTENANCE:
                return show(<TradingPlatformStatusModal isServerMaintenance />);
            case TRADING_PLATFORM_STATUS.UNAVAILABLE:
                return show(<TradingPlatformStatusModal />);
            case TRADING_PLATFORM_STATUS.ACTIVE:
            default:
                if (!isVirtual && hasClientKycStatus) {
                    show(<ClientVerificationModal account={account as TModifiedMT5Accounts} />);
                } else {
                    show(<MT5PasswordModal account={account as TModifiedMT5Accounts} isVirtual={isVirtual} />);
                }
                setModalState('marketType', account.market_type);
                setModalState('selectedJurisdiction', account.shortcode);
                break;
        }
    }, [hasUnavailableAccount, show, platformStatus, isVirtual, hasClientKycStatus, setModalState, account]);

    return (
        <TradingAccountCard onClick={onButtonClick}>
            <TradingAccountCard.Icon className='wallets-available-mt5__icon'>
                {getMarketTypeDetails(localize, account.product)[account.market_type || MARKET_TYPE.ALL].icon}
            </TradingAccountCard.Icon>
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
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
