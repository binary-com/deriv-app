import React, { FC, Fragment, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
    useActiveWalletAccount,
    useAvailableCTraderAccounts,
    useCreateOtherCFDAccount,
    useCtraderAccountsList,
    useDxtradeAccountsList,
} from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import {
    LabelPairedArrowUpArrowDownMdBoldIcon,
    LabelPairedCircleExclamationMdFillIcon,
    LabelPairedPlusMdFillIcon,
} from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Accordion, Button, InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { WalletBadge, WalletListCardBadge } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import { THooks } from '../../../../types';
import { calculateTotalByKey } from '../../../../utils/calculate-total-by-key';
import { sortArrayByKey } from '../../../../utils/sort-array-by-key';
import {
    CFD_PLATFORMS,
    getMarketTypeDetails,
    getServiceMaintenanceMessages,
    MARKET_TYPE,
    PlatformDetails,
} from '../../constants';
import { CTraderAddAccountSuccessModal } from '../../modals/CTraderAddAccountSuccessModal';
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
    const { getModalState, hide, show } = useModal();
    const { localize } = useTranslations();
    const history = useHistory();
    const { data: dxtradeAccountsList } = useDxtradeAccountsList();
    const { data: ctraderAccountsList } = useCtraderAccountsList();
    const { data: activeWalletData } = useActiveWalletAccount();
    const { data: availableCtraderAccounts } = useAvailableCTraderAccounts();
    const { isSuccess: isAccountCreated, mutate: createAccount } = useCreateOtherCFDAccount();
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

    const ctraderTotalBalance = useMemo(() => {
        if (ctraderAccountsList) {
            return calculateTotalByKey(ctraderAccountsList, 'display_balance');
        }
        return 0;
    }, [ctraderAccountsList]);

    const cTraderDisplayBalance = displayMoney(ctraderTotalBalance, activeWalletData?.currency || 'USD', {
        fractional_digits: activeWalletData?.currency_config?.fractional_digits,
    });

    const sortedCtraderAccountList = useMemo(() => {
        if (ctraderAccountsList) {
            return sortArrayByKey(ctraderAccountsList, 'login');
        }
        return ctraderAccountsList;
    }, [ctraderAccountsList]);

    const { is_virtual: isDemo = false } = activeWalletData ?? {};

    const onClickCtraderGetMoreButton = () => {
        createAccount({
            payload: {
                account_type: isDemo ? 'demo' : 'real',
                market_type: MARKET_TYPE.ALL,
                platform: CFD_PLATFORMS.CTRADER,
            },
        });
    };

    useEffect(() => {
        if (isAccountCreated) {
            show(<CTraderAddAccountSuccessModal />);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAccountCreated]);

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
                            {platform !== ctraderPlatform && shouldShowAccountBalance ? (
                                <Text weight='bold'>{details?.display_balance}</Text>
                            ) : (
                                <div className='wallets-mt5-trade-screen__details-description__balance-total'>
                                    <Text as='p' lineHeight='3xs' size={isDesktop ? 'sm' : 'md'}>
                                        Total balance:
                                    </Text>
                                    <Text weight='bold'>{cTraderDisplayBalance}</Text>
                                </div>
                            )}
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

                {platform === ctraderPlatform && (
                    <Fragment>
                        <ul className='wallets-mt5-trade-screen__ctrader-account-list'>
                            {sortedCtraderAccountList?.map(account => (
                                <li
                                    className='wallets-mt5-trade-screen__ctrader-account-list__item'
                                    key={account.login}
                                >
                                    <Text size='sm'>{account.login}</Text>
                                    <Text size='sm' weight='bold'>
                                        {account.display_balance}
                                    </Text>
                                </li>
                            ))}
                        </ul>
                        {availableCtraderAccounts?.[0].available_count !== undefined &&
                            availableCtraderAccounts[0].available_count > 0 && (
                                <button
                                    className='wallets-mt5-trade-screen__ctrader-get-more-button'
                                    onClick={onClickCtraderGetMoreButton}
                                    type='button'
                                >
                                    <span className='wallets-mt5-trade-screen__ctrader-get-more-button__icon'>
                                        <LabelPairedPlusMdFillIcon fill='#000000' />
                                    </span>
                                    <Text size='xs'>Get another cTrader account</Text>
                                </button>
                            )}
                        <Accordion
                            className='wallets-mt5-trade-screen__accordion'
                            headerClassName='wallets-mt5-trade-screen__accordion__header'
                            title='See important notes'
                            variant='bordered'
                        >
                            <ol className='wallets-mt5-trade-screen__notes'>
                                <li className='wallets-mt5-trade-screen__notes__item'>
                                    Use your Deriv account email and password to log in to cTrader.
                                </li>
                                <li className='wallets-mt5-trade-screen__notes__item'>
                                    Manage up to 5 Deriv cTrader accounts. While you can convert any of your Deriv
                                    cTrader accounts into a strategy account, please take note of the following:
                                    <ul className='wallets-mt5-trade-screen__notes__inner-list'>
                                        <li className='wallets-mt5-trade-screen__notes__item wallets-mt5-trade-screen__notes__inner-item'>
                                            When setting up a strategy, you have the option to impose fees.
                                        </li>
                                        <li className='wallets-mt5-trade-screen__notes__item wallets-mt5-trade-screen__notes__inner-item'>
                                            For strategies where you impose fees, you must assign one of your existing
                                            accounts to process these fees. The same ‘Account For Fees’ can support
                                            multiple fee-based strategies.
                                        </li>
                                        <li className='wallets-mt5-trade-screen__notes__item wallets-mt5-trade-screen__notes__inner-item'>
                                            Free strategies do not require an ‘Account For Fees’.
                                        </li>
                                        <li className='wallets-mt5-trade-screen__notes__item wallets-mt5-trade-screen__notes__inner-item'>
                                            An account designated as a strategy provider is irreversible unless it
                                            remains inactive for 30 days.
                                        </li>
                                        <li className='wallets-mt5-trade-screen__notes__item wallets-mt5-trade-screen__notes__inner-item'>
                                            An account cannot simultaneously be a strategy provider and serve as an
                                            ‘Account For Fees’.
                                        </li>
                                        <li className='wallets-mt5-trade-screen__notes__item wallets-mt5-trade-screen__notes__inner-item'>
                                            To ensure you can always create and manage strategies with fees,{' '}
                                            <strong>
                                                keep at least one account free from being a strategy provider
                                            </strong>
                                            . This way, you’ll always have an account ready for collecting fees,
                                            allowing you to have up to four strategies where you may impose fees.
                                        </li>
                                    </ul>
                                </li>
                            </ol>
                        </Accordion>
                    </Fragment>
                )}
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
