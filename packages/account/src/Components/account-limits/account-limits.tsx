import React from 'react';
import { FormikValues } from 'formik';
import clsx from 'clsx';
import { formatMoney, useIsMounted } from '@deriv/shared';
import { Loading, ThemedScrollbars } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import DemoMessage from '../demo-message';
import LoadErrorMessage from '../load-error-message';
import AccountLimitsArticle from './account-limits-article';
import AccountLimitsContext, { TAccountLimitsContext } from './account-limits-context';
import AccountLimitsExtraInfo from './account-limits-extra-info';
import AccountLimitsFooter from './account-limits-footer';
import AccountLimitsOverlay from './account-limits-overlay';
import AccountLimitsTableCell from './account-limits-table-cell';
import AccountLimitsTableHeader from './account-limits-table-header';
import AccountLimitsTurnoverLimitRow, { TAccountLimitsCollection } from './account-limits-turnover-limit-row';
import WithdrawalLimitsTable from './withdrawal-limits-table';

type TAccountLimits = {
    footer_ref?: React.RefObject<HTMLElement>;
    is_app_settings?: boolean;
    overlay_ref: HTMLDivElement;
    setIsOverlayShown?: (is_overlay_shown?: boolean) => void;
    setIsPopupOverlayShown?: (is_popup_overlay_shown: boolean) => void;
    should_bypass_scrollbars?: boolean;
    should_show_article?: boolean;
};

const AccountLimits = observer(
    ({
        footer_ref,
        is_app_settings,
        overlay_ref,
        setIsOverlayShown: setIsPopupOverlayShown,
        should_bypass_scrollbars,
        should_show_article = true,
    }: TAccountLimits) => {
        const { client } = useStore();
        const { account_limits, account_status, currency, getLimits, is_virtual, is_switching } = client;
        const isMounted = useIsMounted();
        const [is_loading, setLoading] = React.useState(true);
        const [is_overlay_shown, setIsOverlayShown] = React.useState(false);
        const { isDesktop } = useDevice();

        const handleGetLimitsResponse = () => {
            if (isMounted()) setLoading(false);
        };

        React.useEffect(() => {
            if (is_virtual) {
                setLoading(false);
            } else {
                getLimits().then(handleGetLimitsResponse);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        React.useEffect(() => {
            if (!is_virtual && account_limits && is_loading && Object.keys(account_status).length > 0) {
                setLoading(false);
            }
        }, [account_limits, is_virtual, is_loading, account_status]);

        React.useEffect(() => {
            if (typeof setIsPopupOverlayShown === 'function') {
                setIsPopupOverlayShown(is_overlay_shown);
            }
        }, [is_overlay_shown, setIsPopupOverlayShown]);

        const toggleOverlay = () => setIsOverlayShown(!is_overlay_shown);

        if (is_switching || is_loading) {
            return <Loading is_fullscreen={false} />;
        }

        if (is_virtual) {
            return (
                <div data-testid='dt_account_demo_message_wrapper' className='account__demo-message-wrapper'>
                    <DemoMessage />
                </div>
            );
        }

        const {
            api_initial_load_error,
            open_positions,
            account_balance,
            payout,
            market_specific,
            num_of_days_limit,
            remainder,
            withdrawal_since_inception_monetary,
        } = account_limits;

        if (api_initial_load_error) {
            return <LoadErrorMessage error_message={api_initial_load_error} />;
        }

        const { commodities, forex, indices, synthetic_index } = market_specific ?? {};
        const forex_ordered = forex?.slice().sort((a: FormikValues, b: FormikValues) => a.name.localeCompare(b.name));
        const derived_ordered = synthetic_index
            ?.slice()
            .sort((a: FormikValues, b: FormikValues) => (a.level > b.level ? 1 : -1));

        const context_value: TAccountLimitsContext = {
            currency,
            footer_ref,
            overlay_ref,
            toggleOverlay,
        };

        return (
            <AccountLimitsContext.Provider value={context_value}>
                <section className='da-account-limits__wrapper' data-testid='account_limits_data'>
                    <div
                        className={clsx('da-account-limits', {
                            'da-account-limits--app-settings': is_app_settings,
                        })}
                    >
                        {should_show_article && !isDesktop && <AccountLimitsArticle />}
                        <div className='da-account-limits__table-wrapper'>
                            <ThemedScrollbars is_bypassed={!!should_bypass_scrollbars || !isDesktop}>
                                <table className='da-account-limits__table' data-testid='trading_limit_item_table'>
                                    <thead>
                                        <tr>
                                            <AccountLimitsTableHeader>
                                                <Localize i18n_default_text='Trading limits' />
                                            </AccountLimitsTableHeader>
                                            <AccountLimitsTableHeader align='right'>
                                                <Localize i18n_default_text='Limit' />
                                            </AccountLimitsTableHeader>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <AccountLimitsTableCell
                                                renderExtraInfo={() => (
                                                    <AccountLimitsExtraInfo
                                                        message={localize(
                                                            'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.'
                                                        )}
                                                    />
                                                )}
                                            >
                                                <Localize i18n_default_text='*Maximum number of open positions' />
                                            </AccountLimitsTableCell>
                                            <AccountLimitsTableCell align='right'>
                                                {open_positions}
                                            </AccountLimitsTableCell>
                                        </tr>
                                        <tr>
                                            <AccountLimitsTableCell
                                                renderExtraInfo={() => (
                                                    <AccountLimitsExtraInfo
                                                        message={localize(
                                                            'Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.'
                                                        )}
                                                    />
                                                )}
                                            >
                                                <Localize i18n_default_text='*Maximum account cash balance' />
                                            </AccountLimitsTableCell>
                                            <AccountLimitsTableCell align='right'>
                                                {/* null or 0 are expected form BE when max balance limit is not set */}
                                                {account_balance ? (
                                                    formatMoney(currency, account_balance, true)
                                                ) : (
                                                    <Localize i18n_default_text='Not set' />
                                                )}
                                            </AccountLimitsTableCell>
                                        </tr>
                                        <tr>
                                            <AccountLimitsTableCell
                                                renderExtraInfo={() => (
                                                    <AccountLimitsExtraInfo
                                                        message={localize(
                                                            'Represents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.'
                                                        )}
                                                    />
                                                )}
                                            >
                                                <Localize i18n_default_text='Maximum aggregate payouts on open positions' />
                                            </AccountLimitsTableCell>
                                            <AccountLimitsTableCell align='right'>
                                                {formatMoney(currency, payout as number, true)}
                                            </AccountLimitsTableCell>
                                        </tr>
                                        <tr>
                                            <AccountLimitsTableCell is_hint>
                                                <Localize i18n_default_text='*Any limits in your Self-exclusion settings will override these default limits.' />
                                            </AccountLimitsTableCell>
                                            <AccountLimitsTableCell />
                                        </tr>
                                    </tbody>
                                </table>
                                <table className='da-account-limits__table' data-testid='trading_daily_turnover_table'>
                                    <thead>
                                        <tr>
                                            <AccountLimitsTableHeader
                                                renderExtraInfo={() => (
                                                    <AccountLimitsExtraInfo
                                                        message={localize(
                                                            'Represents the maximum volume of contracts that you may purchase in any given trading day.'
                                                        )}
                                                    />
                                                )}
                                            >
                                                <Localize i18n_default_text='Maximum daily turnover' />
                                            </AccountLimitsTableHeader>
                                            <AccountLimitsTableHeader align='right'>
                                                <Localize i18n_default_text='Limit' />
                                            </AccountLimitsTableHeader>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AccountLimitsTurnoverLimitRow
                                            collection={commodities as TAccountLimitsCollection[]}
                                        />
                                        <AccountLimitsTurnoverLimitRow
                                            collection={forex_ordered as TAccountLimitsCollection[]}
                                        />
                                        <AccountLimitsTurnoverLimitRow
                                            collection={indices as TAccountLimitsCollection[]}
                                        />
                                        <AccountLimitsTurnoverLimitRow
                                            collection={derived_ordered as TAccountLimitsCollection[]}
                                        />
                                    </tbody>
                                </table>
                                {/* We only show "Withdrawal Limits" on account-wide settings pages. */}

                                {!is_app_settings && (
                                    <WithdrawalLimitsTable
                                        num_of_days_limit={num_of_days_limit}
                                        remainder={remainder}
                                        withdrawal_since_inception_monetary={withdrawal_since_inception_monetary}
                                    />
                                )}
                            </ThemedScrollbars>
                        </div>
                        {should_show_article && isDesktop && <AccountLimitsArticle />}
                        {footer_ref && <AccountLimitsFooter />}
                        {is_overlay_shown && overlay_ref && <AccountLimitsOverlay />}
                    </div>
                </section>
            </AccountLimitsContext.Provider>
        );
    }
);

export default AccountLimits;
