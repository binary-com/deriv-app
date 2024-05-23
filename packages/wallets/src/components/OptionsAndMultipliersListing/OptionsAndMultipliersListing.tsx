import React from 'react';
import classNames from 'classnames';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useActiveLinkedToTradingAccount } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { optionsAndMultipliersContent } from '../../constants/constants';
import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../../helpers/urls';
import useDevice from '../../hooks/useDevice';
import { TRoute } from '../../routes/Router';
import { WalletLink, WalletText } from '../Base';
import { DerivAppsSection } from '../DerivAppsSection';
import { TradingAccountCard } from '../TradingAccountCard';
import './OptionsAndMultipliersListing.scss';

type TLinkTitleProps = Pick<typeof optionsAndMultipliersContent[number], 'icon' | 'title'>;

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

const OptionsAndMultipliersListing: React.FC = () => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();

    return (
        <div className='wallets-options-and-multipliers-listing'>
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
                            defaults='Buy or sell at a specific time for a specific price. <0>Learn more</0>'
                        />
                    </WalletText>
                </div>
                <DerivAppsSection />
            </section>
            <div
                className={classNames('wallets-options-and-multipliers-listing__content', {
                    'wallets-options-and-multipliers-listing__content--without-trading-account':
                        !activeLinkedToTradingAccount?.loginid,
                })}
            >
                {optionsAndMultipliersContent.map(account => {
                    const { description, title } = account;

                    return (
                        <TradingAccountCard
                            {...account}
                            disabled={!activeLinkedToTradingAccount?.loginid}
                            key={`trading-account-card-${title}`}
                            leading={
                                <LinkTitle
                                    icon={
                                        activeLinkedToTradingAccount?.loginid || !isMobile
                                            ? account.icon
                                            : account.smallIcon
                                    }
                                    title={title}
                                />
                            }
                            onClick={() => {
                                account.isExternal
                                    ? window.open(account.redirect, '_blank')
                                    : history.push(account.redirect as TRoute);
                            }}
                            trailing={
                                activeLinkedToTradingAccount?.loginid ? (
                                    <div className='wallets-options-and-multipliers-listing__icon'>
                                        <LabelPairedChevronRightCaptionRegularIcon width={16} />
                                    </div>
                                ) : null
                            }
                        >
                            <div className='wallets-options-and-multipliers-listing__content__details'>
                                <WalletText size='sm'>
                                    <Trans defaults={title} />
                                </WalletText>
                                <WalletText size='xs'>
                                    <Trans defaults={description} />
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
