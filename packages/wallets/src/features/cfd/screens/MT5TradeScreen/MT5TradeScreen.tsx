import React, { FC, Fragment, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCtraderAccountsList, useDxtradeAccountsList } from '@deriv/api-v2';
import { LabelPairedArrowUpArrowDownMdBoldIcon, LabelPairedCircleExclamationMdFillIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { WalletBadge, WalletListCardBadge } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import { THooks } from '../../../../types';
import { CFD_PLATFORMS, getMarketTypeDetails, getServiceMaintenanceMessages, PlatformDetails } from '../../constants';
import MT5DesktopRedirectOption from './MT5TradeLink/MT5DesktopRedirectOption';
import MT5MobileRedirectOption from './MT5TradeLink/MT5MobileRedirectOption';
import { MT5TradeDetailsItem } from './MT5TradeDetailsItem';
import { MT5TradeLink } from './MT5TradeLink';
import './MT5TradeScreen.scss';

type MT5TradeScreenProps = {
    mt5Account?: THooks.MT5AccountsList;
};

const MT5TradeScreen: FC<MT5TradeScreenProps> = ({ mt5Account }) => {
    const { isDesktop } = useDevice();
    const { getModalState, hide } = useModal();
    const { localize } = useTranslations();
    const history = useHistory();
    const { data: dxtradeAccountsList } = useDxtradeAccountsList();
    const { data: ctraderAccountsList } = useCtraderAccountsList();
    const { data: activeWalletData } = useActiveWalletAccount();

    const mt5Platform = CFD_PLATFORMS.MT5;
    const dxtradePlatform = CFD_PLATFORMS.DXTRADE;
    const ctraderPlatform = CFD_PLATFORMS.CTRADER;

    const marketType: keyof ReturnType<typeof getMarketTypeDetails> | undefined = getModalState('marketType');
    const platform = getModalState('platform') ?? mt5Platform;

    const { icon: platformIcon, title: platformTitle } = PlatformDetails[platform as keyof typeof PlatformDetails];
    const { icon: marketTypeIcon, title: marketTypeTitle } = getMarketTypeDetails(localize, mt5Account?.product)[
        marketType ?? 'all'
    ];

    const platformToAccountsListMapper = useMemo(
        () => ({
            ctrader: ctraderAccountsList,
            dxtrade: dxtradeAccountsList,
            mt5: [mt5Account],
        }),
        [ctraderAccountsList, dxtradeAccountsList, mt5Account]
    );

    const shouldShowAccountBalance = useMemo(() => {
        if (
            platform === mt5Platform &&
            platformToAccountsListMapper.mt5?.filter(account => account?.market_type === marketType)[0]?.status ===
                'migrated_without_position'
        )
            return false;
        return true;
    }, [marketType, mt5Platform, platform, platformToAccountsListMapper.mt5]);

    const details = useMemo(() => {
        switch (platform) {
            case mt5Platform:
                return platformToAccountsListMapper.mt5?.filter(account => account?.market_type === marketType)[0];
            case dxtradePlatform:
                return platformToAccountsListMapper.dxtrade?.[0];
            case ctraderPlatform:
                return platformToAccountsListMapper.ctrader?.[0];
            default:
                return undefined;
        }
    }, [
        platform,
        mt5Platform,
        platformToAccountsListMapper.mt5,
        platformToAccountsListMapper.dxtrade,
        platformToAccountsListMapper.ctrader,
        dxtradePlatform,
        ctraderPlatform,
        marketType,
    ]);

    const loginId = useMemo(() => {
        if (platform === mt5Platform) {
            return (details as THooks.MT5AccountsList)?.display_login;
        } else if (platform === dxtradePlatform) {
            return (details as THooks.DxtradeAccountsList)?.account_id;
        }
        return details?.login;
    }, [details, dxtradePlatform, mt5Platform, platform]);

    const migrationMessage = useMemo(() => {
        if (platform === mt5Platform && !activeWalletData?.is_virtual) {
            switch (
                platformToAccountsListMapper.mt5?.filter(account => account?.market_type === marketType)[0]?.status
            ) {
                case 'migrated_with_position':
                    return (
                        <InlineMessage
                            className='wallets-mt5-trade-screen__description-badge'
                            type='outlined'
                            variant='warning'
                        >
                            <Text align='start' color='warning' size='2xs' weight='bold'>
                                <Localize i18n_default_text='No new positions' />
                            </Text>
                        </InlineMessage>
                    );
                case 'migrated_without_position':
                    return (
                        <InlineMessage
                            className='wallets-mt5-trade-screen__description-badge'
                            type='outlined'
                            variant='warning'
                        >
                            <Text align='start' color='warning' size='2xs' weight='bold'>
                                <Localize i18n_default_text='Account closed' />
                            </Text>
                        </InlineMessage>
                    );
                default:
                    return null;
            }
        }
    }, [activeWalletData?.is_virtual, marketType, mt5Platform, platform, platformToAccountsListMapper.mt5]);

    return (
        <div className='wallets-mt5-trade-screen' data-testid='dt_mt5_trade_screen'>
            <div className='wallets-mt5-trade-screen__content'>
                <div className='wallets-mt5-trade-screen__content-header'>
                    <div className='wallets-mt5-trade-screen__description'>
                        <div className='wallets-mt5-trade-screen__description-icon'>
                            {platform === mt5Platform ? marketTypeIcon : platformIcon}
                        </div>
                        <div className='wallets-mt5-trade-screen__description-details'>
                            <div className='wallets-mt5-trade-screen__label'>
                                <Text align='start' lineHeight='3xs' size={isDesktop ? 'sm' : 'md'}>
                                    {platform === mt5Platform ? marketTypeTitle : platformTitle}{' '}
                                </Text>
                                {!activeWalletData?.is_virtual && (
                                    <WalletBadge>{details?.landing_company_short?.toUpperCase()}</WalletBadge>
                                )}
                                {activeWalletData?.is_virtual && <WalletListCardBadge />}
                            </div>
                            <Text align='start' color='less-prominent' size='xs'>
                                {platform !== ctraderPlatform && loginId}
                            </Text>
                        </div>
                        <div className='wallets-mt5-trade-screen__description-balance'>
                            {shouldShowAccountBalance && <Text weight='bold'>{details?.display_balance}</Text>}
                            {migrationMessage}
                        </div>
                    </div>
                    <div className='wallets-mt5-trade-screen__content-header-btn'>
                        <Button
                            aria-label='account-transfer'
                            icon={<LabelPairedArrowUpArrowDownMdBoldIcon fill='#FFF' height={18} width={14} />}
                            key='account-transfer'
                            onClick={() => {
                                hide();
                                history.push('/wallet/account-transfer', { toAccountLoginId: details?.loginid });
                            }}
                            rounded='md'
                            size='sm'
                            textSize={isDesktop ? 'xs' : 'sm'}
                        >
                            <Localize i18n_default_text='Transfer' />
                        </Button>
                    </div>
                </div>

                <div className='wallets-mt5-trade-screen__content-clipboards'>
                    {getModalState('platform') === mt5Platform && details?.platform === mt5Platform && (
                        <Fragment>
                            <MT5TradeDetailsItem label={localize('Broker')} value={details?.landing_company ?? ''} />
                            <MT5TradeDetailsItem
                                label={localize('Server')}
                                value={details?.server_info?.environment ?? localize('Deriv-Server')}
                            />
                            <MT5TradeDetailsItem label={localize('Login ID')} value={loginId ?? '12345678'} />
                            <MT5TradeDetailsItem label={localize('Password')} variant='password' />
                        </Fragment>
                    )}
                    {getModalState('platform') === dxtradePlatform && (
                        <Fragment>
                            <MT5TradeDetailsItem label={localize('Username')} value={details?.login ?? '12345678'} />
                            <MT5TradeDetailsItem label={localize('Password')} variant='password' />
                        </Fragment>
                    )}
                    {getModalState('platform') === ctraderPlatform && (
                        <MT5TradeDetailsItem
                            value={localize(
                                'Use your Deriv account email and password to login into the cTrader platform.'
                            )}
                            variant='info'
                        />
                    )}
                </div>

                <div className='wallets-mt5-trade-screen__content-maintenance'>
                    <LabelPairedCircleExclamationMdFillIcon fill='#FFAD3A' />
                    <Text
                        align='start'
                        className='wallets-mt5-trade-screen__content-text'
                        color='less-prominent'
                        size={isDesktop ? '2xs' : 'xs'}
                    >
                        {
                            getServiceMaintenanceMessages(localize)[
                                (platform as keyof ReturnType<typeof getServiceMaintenanceMessages>) ??
                                    PlatformDetails.mt5.platform
                            ]
                        }
                    </Text>
                </div>
            </div>
            <div className='wallets-mt5-trade-screen__links'>
                {platform === mt5Platform && (
                    <Fragment>
                        {isDesktop ? (
                            <MT5DesktopRedirectOption />
                        ) : (
                            <MT5MobileRedirectOption mt5TradeAccount={details as THooks.MT5AccountsList} />
                        )}
                    </Fragment>
                )}
                {platform === dxtradePlatform && (
                    <MT5TradeLink isDemo={activeWalletData?.is_virtual} platform={dxtradePlatform} />
                )}
                {platform === ctraderPlatform && (
                    <Fragment>
                        <MT5TradeLink platform={ctraderPlatform} />
                        <MT5TradeLink app={ctraderPlatform} platform={ctraderPlatform} />
                    </Fragment>
                )}
            </div>
        </div>
    );
};
export default MT5TradeScreen;
