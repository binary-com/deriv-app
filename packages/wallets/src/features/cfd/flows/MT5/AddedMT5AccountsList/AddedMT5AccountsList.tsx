import React from 'react';
import classNames from 'classnames';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { useModal } from '../../../../../components/ModalProvider';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import useIsRtl from '../../../../../hooks/useIsRtl';
import { THooks } from '../../../../../types';
import { ClientVerificationStatusBadge, PlatformStatusBadge } from '../../../components';
import { MARKET_TYPE, PlatformDetails } from '../../../constants';
import { ClientVerificationModal, MT5TradeModal, TradingPlatformStatusModal } from '../../../modals';
import { TModifiedMT5Accounts } from '../../../types';
import { useAddedMT5Account } from './hooks';
import './AddedMT5AccountsList.scss';

type TProps = {
    account: THooks.SortedMT5Accounts;
};

const AddedMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const isRtl = useIsRtl();
    const {
        accountDetails,
        isServerMaintenance,
        kycStatus,
        showClientVerificationModal,
        showMT5TradeModal,
        showPlatformStatus,
    } = useAddedMT5Account(account as TModifiedMT5Accounts);

    const { show } = useModal();

    return (
        <TradingAccountCard
            onClick={() => {
                if (showPlatformStatus) {
                    return show(<TradingPlatformStatusModal isServerMaintenance={isServerMaintenance} />, {
                        defaultRootId: 'wallets_modal_root',
                    });
                }

                if (showClientVerificationModal) {
                    return show(<ClientVerificationModal account={account as TModifiedMT5Accounts} />, {
                        defaultRootId: 'wallets_modal_root',
                    });
                }

                if (showMT5TradeModal) {
                    return show(
                        <MT5TradeModal
                            marketType={account.market_type ?? MARKET_TYPE.ALL}
                            mt5Account={account}
                            platform={PlatformDetails.mt5.platform}
                        />,
                        { defaultRootId: 'wallets_modal_root' }
                    );
                }
            }}
        >
            <TradingAccountCard.Icon className='wallets-added-mt5__icon'>{accountDetails.icon}</TradingAccountCard.Icon>
            <TradingAccountCard.Content className='wallets-added-mt5__details'>
                <div className='wallets-added-mt5__details-title'>
                    <Text size='sm'>{accountDetails.title}</Text>
                </div>
                {!kycStatus && (
                    <Text align='start' size='sm' weight='bold'>
                        {account.display_balance}
                    </Text>
                )}
                <Text align='start' as='p' size='xs'>
                    {account.display_login}
                </Text>
                {kycStatus && <ClientVerificationStatusBadge underlined variant={kycStatus} />}
            </TradingAccountCard.Content>
            <TradingAccountCard.Button
                className={classNames('wallets-added-mt5__icon', {
                    'wallets-added-mt5__icon--pending': kycStatus === 'in_review',
                })}
            >
                {showPlatformStatus ? (
                    <PlatformStatusBadge
                        badgeSize='md'
                        className='wallets-added-mt5__icon--badge'
                        mt5Account={account}
                    />
                ) : (
                    <div className='wallets-available-mt5__icon'>
                        {isRtl ? (
                            <LabelPairedChevronLeftCaptionRegularIcon width={16} />
                        ) : (
                            <LabelPairedChevronRightCaptionRegularIcon width={16} />
                        )}
                    </div>
                )}
            </TradingAccountCard.Button>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
