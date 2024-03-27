import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { optionsAndMultipliersContent } from '../../constants/constants';
import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../../helpers/urls';
import useDevice from '../../hooks/useDevice';
import { TRoute } from '../../routes/Router';
import { WalletButton, WalletLink, WalletText } from '../Base';
import { DerivAppsSection } from '../DerivAppsSection';
import { TradingAccountCard } from '../TradingAccountCard';
import './OptionsAndMultipliersListing.scss';

type TShowButtonProps = Pick<typeof optionsAndMultipliersContent[number], 'isExternal' | 'redirect'>;

type TLinkTitleProps = Pick<typeof optionsAndMultipliersContent[number], 'icon' | 'title'>;

type TOptionsAndMultipliersListingProps = {
    onOptionsAndMultipliersLoaded?: (value: boolean) => void;
};

const LinkTitle: React.FC<TLinkTitleProps> = ({ icon, title }) => {
    const handleClick = (event: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        event.persist();
        switch (title) {
            case 'Deriv Trader':
                window.open(getStaticUrl(`/dtrader`));
                break;
            case 'Deriv Bot':
                window.open(getStaticUrl(`/dbot`));
                break;
            case 'SmartTrader':
                window.open(getUrlSmartTrader());
                break;
            case 'Binary Bot':
                window.open(getUrlBinaryBot());
                break;
            case 'Deriv GO':
                window.open(getStaticUrl('/deriv-go'));
                break;
            default:
                break;
        }
    };

    return (
        <div
            className='wallets-options-and-multipliers-listing__content__icon'
            onClick={handleClick}
            // Fix sonarcloud issue
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'Enter') {
                    handleClick(event);
                }
            }}
        >
            {icon}
        </div>
    );
};

const ShowOpenButton = ({ isExternal, redirect }: TShowButtonProps) => {
    const history = useHistory();
    const { data } = useActiveWalletAccount();
    if (data?.dtrade_loginid) {
        return (
            <WalletButton
                onClick={() => {
                    if (isExternal) {
                        window.open(redirect, '_blank');
                    } else {
                        history.push(redirect as TRoute);
                    }
                }}
            >
                Open
            </WalletButton>
        );
    }
    return null;
};

const OptionsAndMultipliersListing: React.FC<TOptionsAndMultipliersListingProps> = ({
    onOptionsAndMultipliersLoaded,
}) => {
    const { isMobile } = useDevice();
    const { data } = useActiveWalletAccount();

    useEffect(() => {
        onOptionsAndMultipliersLoaded?.(true);
        return () => onOptionsAndMultipliersLoaded?.(false);
    }, [onOptionsAndMultipliersLoaded]);

    return (
        <div
            className={classNames('wallets-options-and-multipliers-listing', {
                'wallets-options-and-multipliers-listing--border': data?.is_crypto,
            })}
        >
            <section className='wallets-options-and-multipliers-listing__header'>
                <div className='wallets-options-and-multipliers-listing__header-title'>
                    {!isMobile && (
                        <WalletText align='center' size='xl' weight='bold'>
                            <Trans defaults='Options' />
                        </WalletText>
                    )}
                    <WalletText size={isMobile ? 'sm' : 'md'}>
                        <Trans
                            components={[
                                <WalletLink key={0} staticUrl='/trade-types/options/digital-options/up-and-down/' />,
                            ]}
                            defaults='Buy and sell at a specific time for a specific price. <0>Learn more</0>'
                        />
                    </WalletText>
                </div>
                <DerivAppsSection />
            </section>
            <div
                className={classNames('wallets-options-and-multipliers-listing__content', {
                    'wallets-options-and-multipliers-listing__content--without-trading-account': !data?.dtrade_loginid,
                })}
            >
                {optionsAndMultipliersContent.map(account => {
                    const title = account.title;

                    return (
                        <TradingAccountCard
                            {...account}
                            key={`trading-account-card-${title}`}
                            leading={
                                <LinkTitle
                                    icon={data?.dtrade_loginid || !isMobile ? account.icon : account.smallIcon}
                                    title={title}
                                />
                            }
                            trailing={<ShowOpenButton isExternal={account.isExternal} redirect={account.redirect} />}
                        >
                            <div className='wallets-options-and-multipliers-listing__content__details'>
                                <WalletText size='sm' weight='bold'>
                                    <Trans defaults={title} />
                                </WalletText>

                                <WalletText size='xs'>
                                    <Trans defaults={account.description} />
                                </WalletText>
                            </div>
                        </TradingAccountCard>
                    );
                })}
            </div>
        </div>
    );
};

export default OptionsAndMultipliersListing;
