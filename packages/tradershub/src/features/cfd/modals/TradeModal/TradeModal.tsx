import React, { FC, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Provider } from '@deriv/library';
import { Text, useBreakpoint } from '@deriv/quill-design';
import { Modal } from '../../../../components/Modal';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { AppToIconMapper, LinksMapper, PlatformDetails, TAppLinks } from '../../constants';
import { MT5TradeScreen } from '../../screens/MT5TradeScreen';

type TTradeModalProps = {
    account?: THooks.CtraderAccountsList | THooks.DxtradeAccountsList | THooks.MT5AccountsList;
    marketType?: TMarketTypes.All;
    platform: TPlatforms.All;
};

const TradeModal: FC<TTradeModalProps> = ({ account, marketType, platform }) => {
    const { isDesktop } = useBreakpoint();
    const { setCfdState } = Provider.useCFDContext();

    useEffect(() => {
        setCfdState('marketType', marketType);
        setCfdState('platform', platform);
        if (platform === 'mt5') setCfdState('accountId', (account as THooks.MT5AccountsList)?.loginid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const appOrder = ['ios', 'android', 'huawei'];

    return (
        <Modal>
            <Modal.Header title='Trade' />
            <Modal.Content>
                <MT5TradeScreen account={account} />
            </Modal.Content>
            <Modal.Footer>
                <div className='pt-50 min-h-[19rem] lg:pt-[inherit] lg:min-h-[inherit] flex justify-center items-center flex-col h-fit w-full gap-800'>
                    <Text align='center' size='sm' weight='bold'>
                        Download {PlatformDetails[platform].title} on your phone to trade with the{' '}
                        {PlatformDetails[platform].title} account
                    </Text>
                    <div className='flex gap-800'>
                        <div className='flex flex-col justify-center gap-400'>
                            {appOrder.map(app => {
                                const AppsLinkMapper = LinksMapper[platform][app as keyof TAppLinks];
                                if (AppsLinkMapper) {
                                    const AppIcon = AppToIconMapper[app];
                                    const appLink = AppsLinkMapper;
                                    return (
                                        <AppIcon
                                            className='w-[13.7rem] h-[4rem] cursor-pointer'
                                            key={app}
                                            onClick={() => window.open(appLink)}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </div>
                        {isDesktop && (
                            <div className='border-[1px_solid_hover-background] rounded-200 flex flex-col justify-center items-center w-[15rem] gap-[0.5rem] p-400'>
                                <QRCode size={80} value={PlatformDetails[platform].link} />
                                <Text align='center' size='xs'>
                                    Scan the QR code to download {PlatformDetails[platform].title}
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default TradeModal;
