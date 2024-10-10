import React from 'react';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import useIsRtl from '../../../../../../hooks/useIsRtl';
import { PlatformDetails } from '../../../../constants';
import { DxtradeEnterPasswordModal } from '../../../../modals';

const AvailableDxtradeAccountsList: React.FC = () => {
    const { show } = useModal();
    const isRtl = useIsRtl();

    return (
        <TradingAccountCard onClick={() => show(<DxtradeEnterPasswordModal />)}>
            <TradingAccountCard.Icon data-testid='dt_icon_dxtrade'>
                {PlatformDetails.dxtrade.icon}
            </TradingAccountCard.Icon>
            <TradingAccountCard.Content>
                <p className='wallets-available-dxtrade__details-title'>
                    <Text align='start' size='sm'>
                        Deriv X
                    </Text>
                </p>
                <Text align='start' size='xs'>
                    <Localize
                        components={[<strong key={0} />]}
                        i18n_default_text='CFDs on financial and derived instruments, <0>powered by TradingView</0>.'
                    />
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
    );
};

export default AvailableDxtradeAccountsList;
