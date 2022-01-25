import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

export type TCFDFinancialStpPendingDialog = {
    enableApp: () => void;
    disableApp: () => void;
    toggleModal: () => void;
    is_cfd_pending_dialog_open: boolean;
    is_fully_authenticated: boolean;
};

export type TCFDAccountCopy = {
    text: string | undefined;
    className: string;
};

export type TAccounIconValues = { [key: string]: string };

export type TSpecBoxProps = {
    value: string | undefined;
    is_bold?: boolean;
};

export type TPasswordBoxProps = {
    platform: string;
    onClick: () => void;
};

export type TType = {
    category: string;
    type: string;
    platform: string;
};

export type TCFDAccountCardActionProps = {
    button_label?: string | JSX.Element;
    handleClickSwitchAccount: () => void;
    has_real_account?: boolean;
    is_accounts_switcher_on?: boolean;
    is_button_primary?: boolean;
    is_disabled: boolean;
    is_virtual?: boolean;
    onSelectAccount: () => void;
    type: TType;
    platform: string;
    title: string;
};

export type TExistingData = DetailsOfEachMT5Loginid & {
    display_login?: string;
};

export type TCFDAccountCard = {
    button_label?: string | JSX.Element;
    commission_message: string;
    descriptor: string;
    is_hovered?: boolean;
    existing_data: TExistingData | undefined;
    has_banner?: boolean;
    has_cfd_account: boolean;
    has_cfd_account_error?: boolean;
    has_real_account?: boolean;
    is_accounts_switcher_on?: boolean;
    is_button_primary?: boolean;
    is_disabled: boolean;
    is_logged_in: boolean;
    is_virtual?: boolean;
    is_eu?: boolean;
    onHover?: (value: string | undefined) => void;
    platform: string;
    specs?: { [key: string]: string };
    title: string;
    type: TType;
    onSelectAccount: () => void;
    onClickFund: (arg: TExistingData) => void;
    onPasswordManager: (
        arg1: string | undefined,
        arg2: string,
        arg3: string,
        arg4: string,
        arg5: string | undefined
    ) => void;
    should_show_trade_servers?: boolean;
    toggleAccountsDialog?: (arg?: boolean) => void;
    toggleShouldShowRealAccountsList?: (arg?: boolean) => void;
};