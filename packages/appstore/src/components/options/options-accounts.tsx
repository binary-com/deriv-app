import React from 'react';
import { useStores } from 'Stores';
import {
    Text,
    StaticUrl,
    DesktopWrapper,
    MobileWrapper,
    MobileDialog,
    Modal,
    Button,
    Loading,
    ThemedScrollbars,
} from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import PlatformLauncher from '../platform-launcher';
import OptionsAccount from '../account';
import AddOptions from '../add-options';
import { isMobile, routes } from '@deriv/shared';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { getSortedAccountList } from '../../helpers';
import AccountManager from '../account-manager';
import classNames from 'classnames';

type TPlatformLauncherPropsArray = {
    app_icon: string;
    app_title: string;
    app_desc: string;
    link_to?: string;
    href?: string;
}[];
type TOptionsAccountsProps = {
    platformlauncherprops: TPlatformLauncherPropsArray;
    accountType: string;
};

const OptionsAccounts: React.FunctionComponent<TOptionsAccountsProps & RouteComponentProps> = props => {
    const { client, ui } = useStores();
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const {
        account_list,
        accounts,
        country_standpoint,
        is_eu,
        market_type,
        server,
        sub_account_type,
        has_error,
        platform,
        is_dark_mode_on,
        shortcode,
        should_show_server_name,
        resetVirtualBalance,
        has_any_real_account,
        loginid,
        switchAccount,
        is_logging_in,
    } = client;
    const sortedAccountList = React.useMemo(
        () => getSortedAccountList(account_list, accounts).filter(account => !account.is_virtual),
        [account_list, accounts]
    );
    const toggleAccountsDialog = ui.toggleAccountsDialog;
    const resetBalance = async () => {
        closeAccountsDialog();
        resetVirtualBalance();
    };
    const closeAccountsDialog = () => {
        toggleAccountsDialog(false);
    };

    const onClickDeposit = () => {
        props.history.push(routes.cashier_deposit);
    };
    const openSwitchAccountModal = () => {
        setIsModalOpen(true);
    };
    const doSwitch = async (loginid_selected: React.SetStateAction<string>) => {
        setIsModalOpen(false);
        closeAccountsDialog();
        if (loginid === loginid_selected) return;
        await switchAccount(loginid_selected);
    };

    return (
        <div className='options-accounts-container'>
            <div className='options-accounts-container__title'>
                {!isMobile() && (
                    <Text
                        size='m'
                        className='options-accounts-container__title-description-container--title'
                        weight='bold'
                    >
                        <Localize i18n_default_text={'Options'} />
                    </Text>
                )}
            </div>
            <div className='options-accounts-container__description'>
                <Text size={isMobile() ? 'xxs' : 's'} line_height={isMobile() ? 'l' : 'xxl'}>
                    <Localize
                        key={1}
                        i18n_default_text='Earn fixed payouts by predicting price movements with <0>Options</0>, or combine the upside of CFDs with the simpliciy of Options with <1>Multipliers</1>.'
                        components={[
                            <StaticUrl key={0} className='link' href='trade-types/options/' />,
                            <StaticUrl key={1} className='link' href='trade-types/multiplier/' />,
                        ]}
                    />
                </Text>
            </div>

            <div className='options-accounts-container__appLuncher'>
                {!is_logging_in ? (
                    <React.Fragment>
                        {props.accountType === 'demo' && (
                            <div className='options-accounts-container__appLuncher--account-demo'>
                                {getSortedAccountList(account_list, accounts)
                                    .filter(account => account.is_virtual)
                                    .map(account => (
                                        <OptionsAccount
                                            key={account.loginid}
                                            balance={accounts[account.loginid].balance}
                                            currency={accounts[account.loginid].currency}
                                            currency_icon={`IcCurrency-${account.icon}`}
                                            display_type={'currency'}
                                            has_balance={'balance' in accounts[account.loginid]}
                                            has_reset_balance={accounts[account.loginid].is_virtual}
                                            is_disabled={account.is_disabled}
                                            is_virtual={account.is_virtual}
                                            loginid_text={account.loginid}
                                            country_standpoint={country_standpoint}
                                            is_eu={is_eu}
                                            market_type={market_type}
                                            server={server}
                                            sub_account_type={sub_account_type}
                                            has_error={has_error}
                                            platform={platform}
                                            is_dark_mode_on={is_dark_mode_on}
                                            shortcode={shortcode}
                                            should_show_server_name={should_show_server_name}
                                            redirectAccount={() =>
                                                account.is_disabled ? undefined : () => doSwitch(account.loginid)
                                            }
                                            onClickResetVirtualBalance={resetBalance}
                                            selected_loginid={account.loginid}
                                            history={props.history}
                                            location={props.location}
                                            match={props.match}
                                            activeAccount={account.loginid}
                                        />
                                    ))}
                            </div>
                        )}
                        {has_any_real_account && props.accountType === 'real' && (
                            <div
                                className={classNames('options-accounts-container__appLuncher--account-real', {
                                    'options-accounts-container__appLuncher--account-real--scroller':
                                        !isMobile() && sortedAccountList.length >= 5 && props.accountType === 'real',
                                })}
                            >
                                {sortedAccountList.map(account =>
                                    isMobile() ? (
                                        account.loginid === loginid && (
                                            <OptionsAccount
                                                key={account.loginid}
                                                balance={accounts[account.loginid].balance}
                                                currency={accounts[account.loginid].currency}
                                                currency_icon={`IcCurrency-${account.icon}`}
                                                display_type={'currency'}
                                                has_balance={'balance' in accounts[account.loginid]}
                                                has_reset_balance={accounts[account.loginid].is_virtual}
                                                is_disabled={account.is_disabled}
                                                is_virtual={account.is_virtual}
                                                loginid_text={account.loginid}
                                                country_standpoint={country_standpoint}
                                                is_eu={is_eu}
                                                market_type={market_type}
                                                server={server}
                                                sub_account_type={sub_account_type}
                                                has_error={has_error}
                                                platform={platform}
                                                is_dark_mode_on={is_dark_mode_on}
                                                shortcode={shortcode}
                                                should_show_server_name={should_show_server_name}
                                                onClickResetVirtualBalance={resetBalance}
                                                selected_loginid={account.loginid}
                                                history={props.history}
                                                location={props.location}
                                                match={props.match}
                                                activeAccount={loginid}
                                                onClickDeposit={onClickDeposit}
                                                switchAccountModal={openSwitchAccountModal}
                                            />
                                        )
                                    ) : (
                                        <OptionsAccount
                                            key={account.loginid}
                                            balance={accounts[account.loginid].balance}
                                            currency={accounts[account.loginid].currency}
                                            currency_icon={`IcCurrency-${account.icon}`}
                                            display_type={'currency'}
                                            has_balance={'balance' in accounts[account.loginid]}
                                            has_reset_balance={accounts[account.loginid].is_virtual}
                                            is_disabled={account.is_disabled}
                                            is_virtual={account.is_virtual}
                                            loginid_text={account.loginid}
                                            country_standpoint={country_standpoint}
                                            is_eu={is_eu}
                                            market_type={market_type}
                                            server={server}
                                            sub_account_type={sub_account_type}
                                            has_error={has_error}
                                            platform={platform}
                                            is_dark_mode_on={is_dark_mode_on}
                                            shortcode={shortcode}
                                            should_show_server_name={should_show_server_name}
                                            redirectAccount={() => {
                                                return !account.is_disabled && doSwitch(account.loginid);
                                            }}
                                            onClickResetVirtualBalance={resetBalance}
                                            selected_loginid={loginid}
                                            history={props.history}
                                            location={props.location}
                                            match={props.match}
                                            activeAccount={loginid}
                                            onClickDeposit={onClickDeposit}
                                        />
                                    )
                                )}
                                {props.accountType === 'real' && (
                                    <div
                                        className={`options-accounts-container__appLuncher--add-options${
                                            sortedAccountList.length >= 4 ? '-scroller' : ''
                                        }`}
                                    >
                                        <AddOptions
                                            number_of_accounts={sortedAccountList.length}
                                            title={'More Options accounts'}
                                            description={'Including cryptocurrencies'}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        {!has_any_real_account && props.accountType === 'real' && (
                            <div className='options-accounts-container__accounts-platform-container--account-launcher'>
                                <AccountManager
                                    has_account={false}
                                    type={'Options'}
                                    appname={`Options account`}
                                    disabled={false}
                                    onClickGet={() => ui.openRealAccountSignup()}
                                    description={'Get a real Options account, start trading and manage your funds.'}
                                />
                            </div>
                        )}
                        {!has_any_real_account && (
                            <span className='options-accounts-container__appLuncher--account--divider' />
                        )}
                    </React.Fragment>
                ) : (
                    <Loading
                        className='options-accounts-container__appLuncher--account__loader'
                        is_fullscreen={false}
                    />
                )}

                <MobileDialog
                    title={localize('Switch your account')}
                    visible={is_modal_open}
                    has_full_height
                    portal_element_id='deriv_app'
                    onClose={() => setIsModalOpen(false)}
                    wrapper_classname='account-switcher-container'
                    footer={
                        <Modal.Footer has_separator style={{ position: 'fixed', bottom: '0px', width: '100%' }}>
                            <Button style={{ width: '100%' }} secondary onClick={() => setIsModalOpen(false)}>
                                {'Back to trading hub'}
                            </Button>
                        </Modal.Footer>
                    }
                >
                    {sortedAccountList.map(account => (
                        <OptionsAccount
                            key={account.loginid}
                            balance={accounts[account.loginid].balance}
                            currency={accounts[account.loginid].currency}
                            currency_icon={`IcCurrency-${account.icon}`}
                            display_type={'currency'}
                            has_balance={'balance' in accounts[account.loginid]}
                            has_reset_balance={accounts[account.loginid].is_virtual}
                            is_disabled={account.is_disabled}
                            is_virtual={account.is_virtual}
                            loginid_text={account.loginid}
                            country_standpoint={country_standpoint}
                            is_eu={is_eu}
                            market_type={market_type}
                            server={server}
                            sub_account_type={sub_account_type}
                            has_error={has_error}
                            platform={platform}
                            is_dark_mode_on={is_dark_mode_on}
                            shortcode={shortcode}
                            should_show_server_name={should_show_server_name}
                            redirectAccount={() => {
                                return !account.is_disabled && doSwitch(account.loginid);
                            }}
                            onClickResetVirtualBalance={resetBalance}
                            selected_loginid={account.loginid}
                            history={props.history}
                            location={props.location}
                            match={props.match}
                            activeAccount={loginid}
                            onClickDeposit={onClickDeposit}
                            switchAccountModal={openSwitchAccountModal}
                            is_modal={true}
                        />
                    ))}
                </MobileDialog>
            </div>
            <div className='options-accounts-container__platformLuncher'>
                {props.platformlauncherprops.map((item, index) => {
                    return (
                        <div className='options-accounts-container__platformLuncher--item' key={item.app_title}>
                            <PlatformLauncher {...item} has_real_account={has_any_real_account} />
                            {!isMobile() && props.platformlauncherprops.length - 1 !== index && (
                                <span className='options-accounts-container__platformLuncher--item_divider' />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default withRouter(observer(OptionsAccounts));
