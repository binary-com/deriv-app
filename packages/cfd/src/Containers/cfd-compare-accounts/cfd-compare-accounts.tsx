import React from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Text, Icon, PageOverlay, CFDCompareAccountsCarousel } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { useIsRtl } from '@deriv/hooks';
import CFDCompareAccountsCard from './cfd-compare-accounts-card';
import {
    getSortedCFDAvailableAccounts,
    getEUAvailableAccounts,
    getMT5DemoData,
    getDxtradeDemoData,
    getCtraderDemoData,
    dxtrade_data,
    ctrader_data,
} from '../../Helpers/compare-accounts-config';
import { REGION } from '../../Helpers/cfd-config';

const CompareCFDs = observer(() => {
    const { isDesktop } = useDevice();
    const is_rtl = useIsRtl();
    const history = useHistory();
    const store = useStore();
    const { client, traders_hub } = store;
    const { trading_platform_available_accounts } = client;
    const { is_demo, is_eu_user, available_dxtrade_accounts, selected_region, available_ctrader_accounts } =
        traders_hub;

    const sorted_available_accounts = !is_eu_user
        ? getSortedCFDAvailableAccounts(trading_platform_available_accounts)
        : getEUAvailableAccounts(trading_platform_available_accounts);

    // Check if dxtrade data is available
    const has_dxtrade_account_available = available_dxtrade_accounts.length > 0;

    const has_ctrader_account_available = available_ctrader_accounts.length > 0;

    const sorted_cfd_available_eu_accounts =
        is_eu_user && sorted_available_accounts.length ? [...sorted_available_accounts] : [];

    // Getting real accounts data
    const all_real_sorted_cfd_available_accounts = !is_eu_user
        ? [...sorted_available_accounts]
        : [...sorted_cfd_available_eu_accounts];

    // Getting demo accounts data
    const demo_cfd_available_accounts = [
        ...getMT5DemoData(all_real_sorted_cfd_available_accounts),
        ...getDxtradeDemoData(all_real_sorted_cfd_available_accounts),
        ...getCtraderDemoData(all_real_sorted_cfd_available_accounts),
    ];

    const all_cfd_available_accounts =
        is_demo && demo_cfd_available_accounts.length > 0
            ? demo_cfd_available_accounts
            : all_real_sorted_cfd_available_accounts;

    // Calculate the card count for alignment of card in center
    const card_count =
        has_dxtrade_account_available || has_ctrader_account_available
            ? all_cfd_available_accounts.length + 1
            : all_cfd_available_accounts.length;

    const getCompareAccountsHeader = () =>
        selected_region === REGION.EU ? (
            <Localize
                i18n_default_text='Deriv MT5 CFDs {{title}} account'
                values={{
                    title: is_demo ? localize('demo') : localize('real'),
                }}
            />
        ) : (
            <Localize
                i18n_default_text='Compare CFDs {{title}} accounts'
                values={{ title: is_demo ? localize('demo') : '' }}
            />
        );

    const DesktopHeader = (
        <div className='compare-cfd-header'>
            <div
                className='compare-cfd-header-navigation'
                onClick={() => {
                    history.push(routes.traders_hub);
                }}
            >
                <Icon icon='IcArrowLeftBold' />
                <Text size='xs' weight='bold' color='prominent'>
                    <Localize i18n_default_text="Trader's hub" />
                </Text>
            </div>
            <h1 className='compare-cfd-header-title'>
                <Text size='m' weight='bold' color='prominent'>
                    {getCompareAccountsHeader()}
                </Text>
            </h1>
        </div>
    );

    if (isDesktop)
        return (
            <div className='compare-cfd-account'>
                <PageOverlay header={DesktopHeader} is_from_app={routes.traders_hub} />
                <div
                    className={classNames('compare-cfd-account-container', {
                        'compare-cfd-account-container__card-count': card_count < 4,
                    })}
                >
                    <div className='card-list'>
                        <CFDCompareAccountsCarousel isRtl={is_rtl}>
                            {all_cfd_available_accounts.map(item => (
                                <CFDCompareAccountsCard
                                    trading_platforms={item}
                                    key={item.market_type + item.shortcode}
                                    is_eu_user={is_eu_user}
                                    is_demo={is_demo}
                                />
                            ))}
                            {/* Renders cTrader data */}
                            {all_cfd_available_accounts.length > 0 && has_ctrader_account_available && (
                                <CFDCompareAccountsCard
                                    trading_platforms={ctrader_data}
                                    is_eu_user={is_eu_user}
                                    is_demo={is_demo}
                                />
                            )}
                            {/* Renders Deriv X data */}
                            {all_cfd_available_accounts.length > 0 && has_dxtrade_account_available && (
                                <CFDCompareAccountsCard
                                    trading_platforms={dxtrade_data}
                                    is_eu_user={is_eu_user}
                                    is_demo={is_demo}
                                />
                            )}
                        </CFDCompareAccountsCarousel>
                    </div>
                </div>
            </div>
        );

    return (
        <PageOverlay
            header={getCompareAccountsHeader()}
            header_classname='compare-cfd-header-title'
            is_from_app={!routes.traders_hub}
            onClickClose={() => history.push(routes.traders_hub)}
        >
            <div
                className={classNames('compare-cfd-account-container', {
                    'compare-cfd-account-container__card-count--mobile': card_count < 2,
                })}
            >
                <CFDCompareAccountsCarousel isRtl={is_rtl}>
                    {all_cfd_available_accounts.map(item => (
                        <CFDCompareAccountsCard
                            trading_platforms={item}
                            key={item.market_type + item.shortcode}
                            is_eu_user={is_eu_user}
                            is_demo={is_demo}
                        />
                    ))}
                    {/* Renders cTrader data */}
                    {all_cfd_available_accounts.length > 0 && has_ctrader_account_available && (
                        <CFDCompareAccountsCard
                            trading_platforms={ctrader_data}
                            is_eu_user={is_eu_user}
                            is_demo={is_demo}
                        />
                    )}
                    {/* Renders Deriv X data */}
                    {all_cfd_available_accounts.length > 0 && has_dxtrade_account_available && (
                        <CFDCompareAccountsCard
                            trading_platforms={dxtrade_data}
                            is_eu_user={is_eu_user}
                            is_demo={is_demo}
                        />
                    )}
                </CFDCompareAccountsCarousel>
            </div>
        </PageOverlay>
    );
});

export default CompareCFDs;
