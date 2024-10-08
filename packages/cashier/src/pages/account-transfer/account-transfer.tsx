import React from 'react';
import { Loading } from '@deriv/components';
import { useCashierLocked, useTradingPlatformStatus } from '@deriv/hooks';
import { WS } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { useCashierStore } from '../../stores/useCashierStores';
import PageContainer from '../../components/page-container';
import CashierLocked from '../../components/cashier-locked';
import Error from '../../components/error';
import NoBalance from '../../components/no-balance';
import Virtual from '../../components/cashier-container/virtual';
import AccountTransferLocked from './account-transfer-locked';
import AccountTransferNoAccount from './account-transfer-no-account';
import AccountTransferForm from './account-transfer-form';
import AccountTransferFormSideNote from './account-transfer-form/account-transfer-form-side-note';

type TAccountTransferProps = {
    onClickDeposit?: VoidFunction;
    onClickNotes?: VoidFunction;
    onClose: VoidFunction;
    openAccountSwitcherModal?: VoidFunction;
};

const AccountTransfer = observer(({ onClickDeposit, onClickNotes, onClose }: TAccountTransferProps) => {
    const { client } = useStore();
    const { account_transfer, general_store } = useCashierStore();

    const {
        accounts_list,
        error,
        has_no_account,
        has_no_accounts_balance,
        is_transfer_locked,
        onMountAccountTransfer: onMount,
        setAccountTransferAmount,
        setIsTransferConfirm,
    } = account_transfer;
    const { is_loading } = general_store;
    const is_cashier_locked = useCashierLocked();
    const { data: TradingPlatformStatusData } = useTradingPlatformStatus();

    const { is_switching, is_virtual } = client;
    const [is_loading_status, setIsLoadingStatus] = React.useState(true);

    React.useEffect(() => {
        onMount();
        (async () => {
            try {
                await WS.wait('authorize', 'website_status', 'get_settings', 'paymentagent_list');
                setIsLoadingStatus(false);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
        })();

        return () => {
            setAccountTransferAmount('');
            setIsTransferConfirm(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (is_virtual) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <Virtual />
            </PageContainer>
        );
    }
    if (is_loading || is_switching || is_loading_status || !TradingPlatformStatusData) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <Loading className='cashier__loader' is_fullscreen={false} />
            </PageContainer>
        );
    }

    if (is_cashier_locked) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <CashierLocked />
            </PageContainer>
        );
    }
    if (is_transfer_locked) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <AccountTransferLocked />
            </PageContainer>
        );
    }
    if (error.is_show_full_page || (error.message && !accounts_list.length)) {
        // for errors with CTA hide the form and show the error,
        // for others show them at the bottom of the form next to submit button
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <Error error={error} />
            </PageContainer>
        );
    }
    if (has_no_account) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <AccountTransferNoAccount />
            </PageContainer>
        );
    }
    if (has_no_accounts_balance) {
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <NoBalance onClickDeposit={onClickDeposit} />
            </PageContainer>
        );
    }

    return (
        <PageContainer hide_breadcrumb right={<AccountTransferFormSideNote />}>
            <AccountTransferForm
                onClose={onClose}
                error={error}
                onClickDeposit={onClickDeposit}
                onClickNotes={onClickNotes}
                TradingPlatformStatusData={TradingPlatformStatusData}
            />
        </PageContainer>
    );
});

export default AccountTransfer;
