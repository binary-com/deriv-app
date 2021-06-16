import React from 'react';
import { localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import specifications from 'Modules/CFD/Constants/cfd-specifications';
import { CFDAccountCard } from './cfd-account-card.jsx';
import { general_messages } from '../Constants/cfd-shared-strings';
import Loading from '../../../templates/_common/components/loading.jsx';

const CFDDemoAccountDisplay = ({
    is_eu,
    is_eu_country,
    has_maltainvest_account,
    has_cfd_account_error,
    openAccountNeededModal,
    standpoint,
    is_loading,
    is_logged_in,
    landing_companies,
    onSelectAccount,
    openAccountTransfer,
    platform,
    current_list,
    has_cfd_account,
    openPasswordManager,
    residence,
}) => {
    const openCFDAccount = () => {
        if (is_eu && !has_maltainvest_account && standpoint.iom) {
            openAccountNeededModal('maltainvest', localize('Deriv Financial'), localize('DMT5 Demo Financial'));
        } else {
            onSelectAccount({
                category: 'demo',
                type: 'financial',
            });
        }
    };

    const financial_specs = React.useMemo(() => {
        if (residence === 'au') {
            return specifications[platform].au_real_financial_specs;
        }
        if (is_eu || is_eu_country) {
            return specifications[platform].eu_real_financial_specs;
        }
        return specifications[platform].real_financial_specs;
    }, [is_eu, is_eu_country, residence, platform]);

    return is_loading ? (
        <div className='cfd-demo-accounts-display'>
            <Loading />
        </div>
    ) : (
        <div className='cfd-demo-accounts-display'>
            {(landing_companies?.mt_gaming_company?.financial || !is_logged_in) && (
                <CFDAccountCard
                    has_cfd_account={has_cfd_account}
                    title={localize('Synthetic')}
                    type={{
                        category: 'demo',
                        type: 'synthetic',
                        platform,
                    }}
                    is_disabled={has_cfd_account_error}
                    is_logged_in={is_logged_in}
                    existing_data={
                        current_list[
                            Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.synthetic`))
                        ]
                    }
                    commission_message={localize('No commission')}
                    onSelectAccount={() =>
                        onSelectAccount({
                            category: 'demo',
                            type: 'synthetic',
                        })
                    }
                    onPasswordManager={openPasswordManager}
                    onClickFund={() =>
                        openAccountTransfer(
                            current_list[
                                Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.synthetic`))
                            ],
                            {
                                category: 'demo',
                                type: 'synthetic',
                            }
                        )
                    }
                    platform={platform}
                    descriptor={localize(
                        'Trade CFDs on our Synthetic Indices that simulate real-world market movement.'
                    )}
                    specs={specifications[platform].real_synthetic_specs}
                    has_banner
                />
            )}

            {(landing_companies?.mt_financial_company?.financial || !is_logged_in) && (
                <CFDAccountCard
                    has_cfd_account={has_cfd_account}
                    title={localize('Financial')}
                    is_disabled={has_cfd_account_error}
                    is_logged_in={is_logged_in}
                    type={{
                        category: 'demo',
                        type: 'financial',
                        platform,
                    }}
                    existing_data={
                        current_list[
                            Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.financial@`))
                        ]
                    }
                    commission_message={localize('No commission')}
                    onSelectAccount={openCFDAccount}
                    onPasswordManager={openPasswordManager}
                    onClickFund={() =>
                        openAccountTransfer(
                            current_list[
                                Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.financial@`))
                            ],
                            {
                                category: 'demo',
                                type: 'financial',
                            }
                        )
                    }
                    platform={platform}
                    descriptor={general_messages.getFinancialAccountDescriptor(platform)}
                    specs={financial_specs}
                    has_banner
                />
            )}
            {(landing_companies?.mt_financial_company?.financial_stp || !is_logged_in) &&
                platform === CFD_PLATFORMS.MT5 && (
                    <CFDAccountCard
                        has_cfd_account={has_cfd_account}
                        title={localize('Financial STP')}
                        type={{
                            category: 'demo',
                            type: 'financial_stp',
                            platform,
                        }}
                        is_disabled={has_cfd_account_error}
                        is_logged_in={is_logged_in}
                        existing_data={
                            current_list[
                                Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.financial_stp@`))
                            ]
                        }
                        commission_message={localize('No commission')}
                        onSelectAccount={() =>
                            onSelectAccount({
                                category: 'demo',
                                type: 'financial_stp',
                            })
                        }
                        onPasswordManager={openPasswordManager}
                        onClickFund={() =>
                            openAccountTransfer(
                                current_list[
                                    Object.keys(current_list).find(key =>
                                        key.startsWith(`${platform}.demo.financial_stp@`)
                                    )
                                ],
                                {
                                    category: 'demo',
                                    type: 'financial_stp',
                                }
                            )
                        }
                        descriptor={localize(
                            'Trade popular currency pairs and cryptocurrencies with straight-through processing order (STP).'
                        )}
                        specs={{
                            [localize('Leverage')]: localize('Up to 1:100'),
                            [localize('Margin call')]: localize('150%'),
                            [localize('Stop out level')]: localize('75%'),
                            [localize('Number of assets')]: localize('50+'),
                        }}
                        platform={platform}
                        has_banner
                    />
                )}
        </div>
    );
};

export { CFDDemoAccountDisplay };
