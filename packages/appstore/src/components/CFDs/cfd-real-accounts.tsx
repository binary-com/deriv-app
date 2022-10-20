import React from 'react';
import { observer } from 'mobx-react-lite';
import { localize } from '@deriv/translations';
import { CFD_PLATFORMS, routes, getCFDAccountKey, getAccountListKey } from '@deriv/shared';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import AccountManager from '../account-manager';
import AddDerived from 'Components/add-derived';
import { TCFDAccountsProps, TPlatform, TDetailsOfEachMT5Loginid, TStaticAccountProps, TRootStore } from 'Types';
import AddOptionsAccount from 'Components/add-options-account';
import { useStores } from 'Stores/index';
import { useHistory } from 'react-router-dom';

type TOpenAccountTransferMeta = {
    category: string;
    type?: string;
};

const CFDRealAccounts = ({
    isDerivedVisible,
    isFinancialVisible,
    has_cfd_account_error,
    current_list,
    has_real_account,
}: TCFDAccountsProps) => {
    const { client, modules, common }: TRootStore = useStores();
    const {
        dxtrade_tokens,
        setAccountType,
        createCFDAccount,
        enableCFDPasswordModal,
        toggleJurisdictionModal,
        disableCFDPasswordModal,
        toggleMT5TradeModal,
        setMT5TradeAccount,
    } = modules.cfd;
    const { setAppstorePlatform, platform } = common;
    const { isEligibleForMoreRealMt5 } = client;
    const history = useHistory();

    const available_real_accounts: Array<TStaticAccountProps> = [
        {
            name: 'Derived',
            description: localize('Trade CFDs on MT5 with Derived indices that simulate real-world market movements.'),
            is_visible: isDerivedVisible(CFD_PLATFORMS.MT5),
            disabled: has_cfd_account_error(CFD_PLATFORMS.MT5),
            platform: CFD_PLATFORMS.MT5,
            type: 'synthetic',
        },
        {
            name: 'Financial',
            description: localize('Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'),
            is_visible: isFinancialVisible(CFD_PLATFORMS.MT5),
            disabled: has_cfd_account_error(CFD_PLATFORMS.MT5),
            platform: CFD_PLATFORMS.MT5,
            type: 'financial',
        },
        {
            name: 'Deriv X',
            description: localize(
                'Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
            ),
            is_visible: isDerivedVisible(CFD_PLATFORMS.DXTRADE),
            disabled: has_cfd_account_error(CFD_PLATFORMS.DXTRADE),
            platform: CFD_PLATFORMS.DXTRADE,
            type: 'synthetic',
            // ToDo: deriv x should have type of all in new API
            // type: 'all'
        },
    ];

    const REAL_DXTRADE_URL = 'https://dx.deriv.com';
    const DEMO_DXTRADE_URL = 'https://dx-demo.deriv.com';

    const getDXTradeWebTerminalLink = (category: string, token?: string) => {
        let url = category === 'real' ? REAL_DXTRADE_URL : DEMO_DXTRADE_URL;

        if (token) {
            url += `?token=${token}`;
        }

        return url;
    };

    const openAccountTransfer = (
        data: DetailsOfEachMT5Loginid & { account_id?: string; platform?: string },
        meta: { category: string; type?: string }
    ) => {
        if (data.platform === CFD_PLATFORMS.DXTRADE)
            sessionStorage.setItem('cfd_transfer_to_login_id', data.account_id as string);
        else sessionStorage.setItem('cfd_transfer_to_login_id', data.login as string);

        disableCFDPasswordModal();
        history.push(routes.cashier_acc_transfer);
    };

    const onClickFundReal = (account: DetailsOfEachMT5Loginid) => {
        if (platform === 'dxtrade') {
            return openAccountTransfer(current_list[getAccountListKey(account, platform)], {
                category: account.account_type as keyof TOpenAccountTransferMeta,
                type: getCFDAccountKey({
                    market_type: account.market_type,
                    sub_account_type: (account as DetailsOfEachMT5Loginid).sub_account_type,
                    platform,
                }),
            });
        }
        return openAccountTransfer(account, {
            category: account.account_type as keyof TOpenAccountTransferMeta,
            type: getCFDAccountKey({
                market_type: account.market_type,
                sub_account_type: (account as DetailsOfEachMT5Loginid).sub_account_type,
                platform: 'mt5',
            }),
        });
    };

    const existingRealAccounts = (existing_platform: TPlatform, market_type?: string) => {
        const acc = Object.keys(current_list).some(key => key.startsWith(`${existing_platform}.real.${market_type}`))
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${existing_platform}.real.${market_type}`))
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as TDetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };

    return (
        <div className='cfd-real-account'>
            {!has_real_account && <AddOptionsAccount />}
            <div className='cfd-real-account__accounts'>
                {available_real_accounts.map(account => (
                    <div className={`cfd-real-account__accounts-${account.name}`} key={account.name}>
                        {existingRealAccounts(account.platform, account?.type)
                            ? existingRealAccounts(account.platform, account?.type)?.map(existing_account => {
                                  const non_eu_accounts =
                                      existing_account.landing_company_short &&
                                      existing_account.landing_company_short !== 'svg' &&
                                      existing_account.landing_company_short !== 'bvi'
                                          ? existing_account.landing_company_short?.charAt(0).toUpperCase() +
                                            existing_account.landing_company_short?.slice(1)
                                          : existing_account.landing_company_short?.toUpperCase();

                                  return (
                                      <div
                                          className={`cfd-demo-account__accounts-${account.name}--item`}
                                          key={existing_account.login}
                                      >
                                          <AccountManager
                                              has_account={true}
                                              type={existing_account.market_type}
                                              appname={`${account.name} ${non_eu_accounts}`}
                                              platform={account.platform}
                                              disabled={false}
                                              loginid={existing_account?.display_login}
                                              currency={existing_account.currency}
                                              amount={existing_account.display_balance}
                                              onClickTopUp={() => onClickFundReal(existing_account)}
                                              onClickTrade={() => {
                                                  toggleMT5TradeModal();
                                                  setMT5TradeAccount(existing_account);
                                              }}
                                              dxtrade_link={getDXTradeWebTerminalLink('real', dxtrade_tokens.real)}
                                              description={account.description}
                                          />
                                          {isEligibleForMoreRealMt5(existing_account.market_type) &&
                                              account.platform !== CFD_PLATFORMS.DXTRADE && (
                                                  <AddDerived
                                                      title={localize(`More ${account.name} accounts`)}
                                                      onClickHandler={() => {
                                                          toggleJurisdictionModal();
                                                          setAccountType({
                                                              category: 'real',
                                                              type: account.type,
                                                          });
                                                          setAppstorePlatform(account.platform);
                                                      }}
                                                      class_names='cfd-real-account__accounts--item__add-derived'
                                                  />
                                              )}
                                      </div>
                                  );
                              })
                            : account.is_visible && (
                                  <div className='cfd-demo-account__accounts--item' key={account.name}>
                                      <AccountManager
                                          has_account={false}
                                          type={account.type || ''}
                                          appname={account.name}
                                          platform={account.platform}
                                          disabled={account.disabled}
                                          onClickGet={
                                              account.platform === CFD_PLATFORMS.MT5
                                                  ? () => {
                                                        toggleJurisdictionModal();
                                                        setAccountType({
                                                            category: 'real',
                                                            type: account.type,
                                                        });
                                                        setAppstorePlatform(account.platform);
                                                    }
                                                  : () => {
                                                        setAccountType({
                                                            category: 'real',
                                                            type: account.type,
                                                        });
                                                        setAppstorePlatform(account.platform);
                                                        createCFDAccount({
                                                            category: 'real',
                                                            type: account.type,
                                                        });
                                                        enableCFDPasswordModal();
                                                    }
                                          }
                                          description={account.description}
                                      />
                                  </div>
                              )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default observer(CFDRealAccounts);
