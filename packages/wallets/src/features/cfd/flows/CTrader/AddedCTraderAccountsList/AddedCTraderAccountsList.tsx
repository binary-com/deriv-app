import React from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard } from '../../../../../components';
import { WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { ArrayElementType } from '../../../../../types';
import { calculateTotalBalance } from '../../../../../utils/ctrader';
import { PlatformDetails } from '../../../constants';
import { CTraderTradeModal } from '../../../modals';
import './AddedCTraderAccountsList.scss';

const AddedCTraderAccountsList: React.FC = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const account = cTraderAccounts?.[0];
    const { show } = useModal();

    const totalBalance =
        cTraderAccounts && calculateTotalBalance<ArrayElementType<typeof cTraderAccounts>>(cTraderAccounts);

    return (
        <React.Fragment>
            {account && (
                <TradingAccountCard
                    leading={<div className='wallets-added-ctrader__icon'>{PlatformDetails.ctrader.icon}</div>}
                    onClick={() => show(<CTraderTradeModal platform={PlatformDetails.ctrader.platform} />)}
                    trailing={
                        <div className='wallets-added-ctrader__icon'>
                            <LabelPairedChevronRightCaptionRegularIcon width={16} />
                        </div>
                    }
                >
                    <div className='wallets-added-ctrader__details'>
                        <WalletText size='sm'>{PlatformDetails.ctrader.title}</WalletText>
                        {totalBalance !== undefined && (
                            <WalletText size='sm' weight='bold'>
                                {totalBalance} {account.currency}
                            </WalletText>
                        )}
                    </div>
                </TradingAccountCard>
            )}
        </React.Fragment>
    );
};

export default AddedCTraderAccountsList;
