import React from 'react';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useActiveLinkedToTradingAccount } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { optionsAndMultipliersContent } from '../../constants/constants';
import useDevice from '../../hooks/useDevice';
import { TRoute } from '../../routes/Router';
import { WalletLink, WalletText } from '../Base';
import { DerivAppsSection } from '../DerivAppsSection';
import { TradingAccountCard } from '../TradingAccountCard';
import LinkTitle from './LinkTitle';
import './OptionsAndMultipliersListing.scss';

const OptionsAndMultipliersListing = () => {
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
                            defaults='Predict the market, profit if you’re right, risk only what you put in. <0>Learn more</0>'
                        />
                    </WalletText>
                </div>
                <DerivAppsSection />
            </section>
            <div className='wallets-options-and-multipliers-listing__content'>
                {optionsAndMultipliersContent.map(account => {
                    const { description, key, redirect, title } = account;
                    return (
                        <TradingAccountCard
                            {...account}
                            disabled={!activeLinkedToTradingAccount?.loginid}
                            key={`trading-account-card-${title}`}
                            leading={<LinkTitle platform={key} />}
                            onClick={() => {
                                account.isExternal ? window.open(redirect, '_blank') : history.push(redirect as TRoute);
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
