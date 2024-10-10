import React from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import useIsRtl from '../../../../../hooks/useIsRtl';
import { PlatformDetails } from '../../../constants';
import { MT5TradeModal } from '../../../modals';

const AddedCTraderAccountsList: React.FC = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { show } = useModal();
    const isRtl = useIsRtl();

    return (
        <React.Fragment>
            {cTraderAccounts?.map((account, index) => (
                <TradingAccountCard
                    key={`added-ctrader-${account.login}-${index}`}
                    onClick={() => show(<MT5TradeModal platform={PlatformDetails.ctrader.platform} />)}
                >
                    <TradingAccountCard.Icon>{PlatformDetails.ctrader.icon}</TradingAccountCard.Icon>
                    <TradingAccountCard.Section>
                        <TradingAccountCard.Content>
                            <Text align='start' size='sm'>
                                {PlatformDetails.ctrader.title}
                            </Text>
                            <Text align='start' size='sm' weight='bold'>
                                {account?.display_balance}
                            </Text>
                            <Text align='start' size='xs'>
                                {account.login}
                            </Text>
                        </TradingAccountCard.Content>
                        <TradingAccountCard.Button>
                            {isRtl ? (
                                <LabelPairedChevronLeftCaptionRegularIcon width={16} />
                            ) : (
                                <LabelPairedChevronRightCaptionRegularIcon width={16} />
                            )}
                        </TradingAccountCard.Button>
                    </TradingAccountCard.Section>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedCTraderAccountsList;
