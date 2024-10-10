import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Text } from '@deriv/components';
import { redirectToLogin } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { getHasDivider } from 'Constants/utils';
import ListingContainer from 'Components/containers/listing-container';
import TradingAppCard from 'Components/containers/trading-app-card';
import CFDsDescription from 'Components/elements/cfds-description';
import CFDsTitle from 'Components/elements/cfds-title';
import './cfds-listing-logged-out.scss';

const CFDsListingLoggedOut = observer(() => {
    const { traders_hub } = useStore();
    const {
        available_dxtrade_accounts,
        available_ctrader_accounts,
        combined_cfd_mt5_accounts,
        selected_region,
        is_eu_user,
    } = traders_hub;

    return (
        <ListingContainer title={<CFDsTitle />} description={<CFDsDescription />}>
            {combined_cfd_mt5_accounts.length > 0 && (
                <div className='cfds-listing-logged-out__cfd-full-row'>
                    <Text line_height='m' weight='bold' color='prominent'>
                        {localize('Deriv MT5')}
                    </Text>
                </div>
            )}
            {combined_cfd_mt5_accounts.map((existing_account, index: number) => {
                const list_size = combined_cfd_mt5_accounts.length;
                return (
                    <TradingAppCard
                        action_type={existing_account.action_type}
                        availability={selected_region}
                        clickable_icon
                        icon={existing_account.icon}
                        sub_title={existing_account?.sub_title}
                        name={existing_account?.name ?? ''}
                        short_code_and_region={existing_account?.short_code_and_region}
                        platform={existing_account.platform}
                        description={existing_account.description}
                        key={existing_account.key}
                        has_divider={!is_eu_user && getHasDivider(index, list_size, 3)}
                        onAction={() => redirectToLogin(false, getLanguage())}
                        market_type='all'
                        is_new
                    />
                );
            })}
            {available_ctrader_accounts.length > 0 && (
                <React.Fragment>
                    <div className='cfds-listing-logged-out__cfd-full-row'>
                        <hr className='cfds-listing-logged-out__divider' />
                    </div>
                    <div className='cfds-listing-logged-out__cfd-full-row'>
                        <Text weight='bold'>{localize('Deriv cTrader')}</Text>
                    </div>
                </React.Fragment>
            )}

            {available_ctrader_accounts.map(account => (
                <TradingAppCard
                    action_type='get'
                    availability={selected_region}
                    clickable_icon
                    icon={account.icon}
                    name={account.name}
                    platform={account.platform}
                    description={account.description}
                    onAction={() => redirectToLogin(false, getLanguage())}
                    key={`trading_app_card_${account.name}`}
                    market_type='all'
                />
            ))}
            {!is_eu_user && (
                <React.Fragment>
                    {(available_ctrader_accounts.length > 0 || combined_cfd_mt5_accounts.length > 0) && (
                        <div className='cfds-listing-logged-out__cfd-full-row'>
                            <hr className='cfds-listing-logged-out__divider' />
                        </div>
                    )}

                    <div className='cfds-listing-logged-out__cfd-full-row'>
                        <Text line_height='m' weight='bold' color='prominent'>
                            {localize('Deriv X')}
                        </Text>
                    </div>
                </React.Fragment>
            )}
            {available_dxtrade_accounts?.map(account => (
                <TradingAppCard
                    action_type='get'
                    availability={selected_region}
                    clickable_icon
                    icon={account.icon}
                    name={account.name}
                    platform={account.platform}
                    description={account.description}
                    onAction={() => redirectToLogin(false, getLanguage())}
                    key={`trading_app_card_${account.name}`}
                    market_type='all'
                />
            ))}
        </ListingContainer>
    );
});

export default CFDsListingLoggedOut;
