import React, { FC, Fragment, useMemo } from 'react';
import { useActiveAccount, useCtraderAccountsList, useDxtradeAccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Text, useBreakpoint } from '@deriv/quill-design';
import ImportantIcon from '../../../../public/images/ic-important.svg';
import { THooks, TPlatforms } from '../../../../types';
import { AppToContentMapper, MarketTypeDetails, PlatformDetails } from '../../constants';
import { MT5TradeDetailsItem } from './MT5TradeDetailsItem';
import { MT5TradeLink } from './MT5TradeLink';

type MT5TradeScreenProps = {
    account?: THooks.CtraderAccountsList | THooks.DxtradeAccountsList | THooks.MT5AccountsList;
};

const serviceMaintenanceMessages: Record<TPlatforms.All, string> = {
    ctrader:
        'Server maintenance occurs every first Saturday of the month from 7 to 10 GMT time. You may experience service disruption during this time.',
    dxtrade:
        'Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. You may experience service disruption during this time.',
    mt5: 'Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to complete. Service may be disrupted during this time.',
};

const MT5TradeScreen: FC<MT5TradeScreenProps> = ({ account }) => {
    const { isMobile } = useBreakpoint();
    const { getModalState } = Provider.useModal();
    const { data: dxtradeAccountsList } = useDxtradeAccountsList();
    const { data: ctraderAccountsList } = useCtraderAccountsList();
    const { data: activeData } = useActiveAccount();

    const mt5Platform = PlatformDetails.mt5.platform;
    const dxtradePlatform = PlatformDetails.dxtrade.platform;
    const ctraderPlatform = PlatformDetails.ctrader.platform;

    const marketType = getModalState('marketType');
    const platform = getModalState('platform') ?? mt5Platform;

    const platformToAccountsListMapper = useMemo(
        () => ({
            ctrader: ctraderAccountsList?.find(account => account.is_virtual === activeData?.is_virtual),
            dxtrade: dxtradeAccountsList?.find(account => account.is_virtual === activeData?.is_virtual),
            mt5: account,
        }),
        [ctraderAccountsList, dxtradeAccountsList, account, activeData?.is_virtual]
    );

    const details = platformToAccountsListMapper[platform as TPlatforms.All];

    const loginId = useMemo(() => {
        if (platform === mt5Platform) {
            return (details as THooks.MT5AccountsList)?.display_login;
        } else if (platform === dxtradePlatform) {
            return (details as THooks.DxtradeAccountsList)?.account_id;
        }
        return (details as THooks.CtraderAccountsList)?.login;
    }, [details, dxtradePlatform, mt5Platform, platform]);

    return (
        <div className='lg:w-[45vw] lg:min-w-[51.2rem] lg:max-w-[60rem] w-full min-w-full h-auto'>
            <div className='flex flex-col p-1200 gap-800 border-b-100 border-system-light-secondary-background'>
                {/* border-top: 0.2rem solid #f2f3f4; */}
                <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center'>
                        <div className='mr-400'>
                            {platform === mt5Platform
                                ? MarketTypeDetails[(marketType ?? 'all') as keyof typeof MarketTypeDetails].icon
                                : PlatformDetails[platform as keyof typeof PlatformDetails].icon}
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex items-center flex-row gap-300'>
                                <Text size='md'>
                                    {platform === mt5Platform
                                        ? MarketTypeDetails[(marketType ?? 'all') as keyof typeof MarketTypeDetails]
                                              .title
                                        : PlatformDetails[platform as keyof typeof PlatformDetails].title}{' '}
                                    {!activeData?.is_virtual && details?.landing_company_short?.toUpperCase()}
                                </Text>
                            </div>
                            <Text className='text-system-light-less-prominent-text' size='sm'>
                                {loginId}
                            </Text>
                        </div>
                    </div>
                    <div className='flex flex-col items-end'>
                        <Text bold>{details?.display_balance}</Text>
                    </div>
                </div>
                <div className='flex flex-col gap-100'>
                    {/* <div className='wallets-mt5-trade-screen__details-clipboards'> */}
                    {platform === mt5Platform && (
                        <Fragment>
                            <MT5TradeDetailsItem label='Broker' value='Deriv Holdings (Guernsey) Ltd' />
                            <MT5TradeDetailsItem
                                label='Server'
                                value={(details as THooks.MT5AccountsList)?.server_info?.environment ?? 'Deriv-Server'}
                            />
                            <MT5TradeDetailsItem label='Login ID' value={loginId ?? '12345678'} />
                            <MT5TradeDetailsItem label='Password' value='********' variant='password' />
                        </Fragment>
                    )}
                    {platform === dxtradePlatform && (
                        <Fragment>
                            <MT5TradeDetailsItem
                                label='Username'
                                value={(details as THooks.DxtradeAccountsList)?.login ?? '12345678'}
                            />
                            <MT5TradeDetailsItem label='Password' value='********' variant='password' />
                        </Fragment>
                    )}
                    {platform === ctraderPlatform && (
                        <MT5TradeDetailsItem
                            value=' Use your Deriv account email and password to login into the cTrader platform.'
                            variant='info'
                        />
                    )}
                </div>
                <div className='grid grid-cols-[2.5rem_auto]'>
                    <ImportantIcon />
                    <Text size='2xs'>{serviceMaintenanceMessages[(platform || mt5Platform) as TPlatforms.All]}</Text>
                </div>
            </div>
            <div className='w-full'>
                {platform === mt5Platform && (
                    <Fragment>
                        <MT5TradeLink
                            app='web'
                            platform={mt5Platform}
                            webtraderUrl={(details as THooks.MT5AccountsList)?.webtrader_url}
                        />
                        {!isMobile && (
                            <Fragment>
                                <MT5TradeLink app='windows' platform={mt5Platform} />
                                <MT5TradeLink app='macos' platform={mt5Platform} />
                                <MT5TradeLink app='linux' platform={mt5Platform} />
                            </Fragment>
                        )}
                    </Fragment>
                )}
                {platform === dxtradePlatform && (
                    <MT5TradeLink isDemo={activeData?.is_virtual} platform={dxtradePlatform} />
                )}
                {platform === ctraderPlatform && (
                    <Fragment>
                        <MT5TradeLink platform={ctraderPlatform} />
                        <MT5TradeLink
                            app={ctraderPlatform as keyof typeof AppToContentMapper}
                            platform={ctraderPlatform}
                        />
                    </Fragment>
                )}
            </div>
        </div>
    );
};

export default MT5TradeScreen;
