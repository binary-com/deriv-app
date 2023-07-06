import React from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Text, Icon, PageOverlay, DesktopWrapper, MobileWrapper, CFDCompareAccountsCarousel } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import CFDCompareAccountsCard from './cfd-compare-accounts-card';
import {
    getSortedAvailableAccounts,
    getEUAvailableAccounts,
    getMT5DemoData,
    getDxtradeDemoData,
    dxtrade_data,
} from '../../Helpers/compare-accounts-config';

const CompareCFDs = observer(() => {
    const history = useHistory();
    const store = useStore();
    const { client, traders_hub } = store;
    const { trading_platform_available_accounts } = client;
    const { is_demo, is_eu_user, available_dxtrade_accounts } = traders_hub;

    const sorted_available_accounts = !is_eu_user
        ? getSortedAvailableAccounts(trading_platform_available_accounts)
        : getEUAvailableAccounts(trading_platform_available_accounts);
    // Check if dxtrade data is available
    const has_dxtrade_account_available = available_dxtrade_accounts.length > 0;

    const sorted_available_eu_accounts =
        is_eu_user && sorted_available_accounts.length ? [...sorted_available_accounts] : [];

    // Getting real accounts data
    const all_real_sorted_available_accounts = !is_eu_user
        ? [...sorted_available_accounts]
        : [...sorted_available_eu_accounts];

    // Getting demo accounts data
    const demo_available_accounts = [
        ...getMT5DemoData(all_real_sorted_available_accounts).concat(
            getDxtradeDemoData(all_real_sorted_available_accounts)
        ),
    ];

    const all_available_accounts =
        is_demo && demo_available_accounts.length > 0 ? demo_available_accounts : all_real_sorted_available_accounts;

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
                    <Localize
                        i18n_default_text='Compare CFDs {{demo_title}} accounts'
                        values={{
                            demo_title: is_demo ? localize('demo') : '',
                        }}
                    />
                </Text>
            </h1>
        </div>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='compare-cfd-account'>
                    <PageOverlay header={DesktopHeader} is_from_app={routes.traders_hub} />
                    <div
                        className={classNames('compare-cfd-account-container', {
                            'compare-cfd-account-container__eu': is_eu_user,
                        })}
                    >
                        <div className='card-list'>
                            <CFDCompareAccountsCarousel>
                                {all_available_accounts.map(item => (
                                    <CFDCompareAccountsCard
                                        trading_platforms={item}
                                        key={item.market_type + item.shortcode}
                                        is_eu_user={is_eu_user}
                                        is_demo={is_demo}
                                    />
                                ))}
                                {/* Renders Deriv X data */}
                                {all_available_accounts.length > 0 && has_dxtrade_account_available && (
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
            </DesktopWrapper>
            <MobileWrapper>
                <PageOverlay
                    header={
                        <Localize
                            i18n_default_text='Compare CFDs {{demo_title}} accounts'
                            values={{
                                demo_title: is_demo ? localize('demo') : '',
                            }}
                        />
                    }
                    header_classname='compare-cfd-header-title'
                    is_from_app={!routes.traders_hub}
                    onClickClose={() => history.push(routes.traders_hub)}
                >
                    <div
                        className={classNames('compare-cfd-account-container', {
                            'compare-cfd-account-container__eu--mobile': is_eu_user,
                        })}
                    >
                        <CFDCompareAccountsCarousel>
                            {all_available_accounts.map(item => (
                                <CFDCompareAccountsCard
                                    trading_platforms={item}
                                    key={item.market_type + item.shortcode}
                                    is_eu_user={is_eu_user}
                                    is_demo={is_demo}
                                />
                            ))}
                            {/* Renders Deriv X data */}
                            {all_available_accounts.length > 0 && has_dxtrade_account_available && (
                                <CFDCompareAccountsCard
                                    trading_platforms={dxtrade_data}
                                    is_eu_user={is_eu_user}
                                    is_demo={is_demo}
                                />
                            )}
                        </CFDCompareAccountsCarousel>
                    </div>
                </PageOverlay>
            </MobileWrapper>
        </React.Fragment>
    );
});

export default CompareCFDs;
