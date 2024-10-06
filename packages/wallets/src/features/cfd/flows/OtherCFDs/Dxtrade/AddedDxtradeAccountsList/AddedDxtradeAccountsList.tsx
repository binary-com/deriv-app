import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api-v2';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import useIsRtl from '../../../../../../hooks/useIsRtl';
import { PlatformDetails } from '../../../../constants';
import { MT5TradeModal } from '../../../../modals';

const AddedDxtradeAccountsList: React.FC = () => {
    const { data } = useDxtradeAccountsList();
    const { show } = useModal();
    const isRtl = useIsRtl();

    return (
        <React.Fragment>
            {data?.map((account, index) => (
                <TradingAccountCard
                    key={`added-dxtrade-${account?.login}-${index}`}
                    onClick={() => show(<MT5TradeModal platform={PlatformDetails.dxtrade.platform} />)}
                >
                    <TradingAccountCard.Icon>{PlatformDetails.dxtrade.icon}</TradingAccountCard.Icon>
                    <TradingAccountCard.Content>
                        <Text align='start' size='sm'>
                            {PlatformDetails.dxtrade.title}
                        </Text>
                        <Text align='start' size='sm' weight='bold'>
                            {account?.display_balance}
                        </Text>
                        <Text align='start' size='xs'>
                            {account?.login}
                        </Text>
                    </TradingAccountCard.Content>
                    <TradingAccountCard.Button>
                        {isRtl ? (
                            <LabelPairedChevronLeftCaptionRegularIcon width={16} />
                        ) : (
                            <LabelPairedChevronRightCaptionRegularIcon width={16} />
                        )}
                    </TradingAccountCard.Button>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedDxtradeAccountsList;
