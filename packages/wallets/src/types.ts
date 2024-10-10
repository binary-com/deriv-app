import type {
    useAccountLimits,
    useActiveAccount,
    useActiveTradingAccount,
    useActiveWalletAccount,
    useAllAccountsList,
    useAllWalletAccounts,
    useAuthentication,
    useAuthorize,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useCreateOtherCFDAccount,
    useCreateWallet,
    useCryptoTransactions,
    useCryptoWithdrawal,
    useCtraderAccountsList,
    useCurrencyConfig,
    useDerivAccountsList,
    useDxtradeAccountsList,
    useDynamicLeverage,
    useExchangeRateSubscription,
    useInfiniteTransactions,
    useMT5AccountsList,
    usePOA,
    usePOI,
    useSettings,
    useSortedMT5Accounts,
    useTradingPlatformStatus,
    useTransactions,
    useTransferBetweenAccounts,
    useWalletAccountsList,
} from '@deriv/api-v2';
import { TSocketError, TSocketResponse } from '@deriv/api-v2/types';
import { IconTypes } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';

// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace THooks {
    export type AccountLimits = NonNullable<ReturnType<typeof useAccountLimits>['data']>;
    export type Authentication = NonNullable<ReturnType<typeof useAuthentication>['data']>;
    export type AvailableMT5Accounts = NonNullable<ReturnType<typeof useAvailableMT5Accounts>['data']>[number];
    export type Authorize = NonNullable<ReturnType<typeof useAuthorize>['data']>;
    export type CreateWallet = NonNullable<ReturnType<typeof useCreateWallet>['data']>;
    export type CreateMT5Account = NonNullable<ReturnType<typeof useCreateMT5Account>['data']>;
    export type CreateOtherCFDAccount = NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['data']>;
    export type CtraderAccountsList = NonNullable<ReturnType<typeof useCtraderAccountsList>['data']>[number];
    export type DxtradeAccountsList = NonNullable<ReturnType<typeof useDxtradeAccountsList>['data']>[number];
    export type ExchangeRate = NonNullable<ReturnType<typeof useExchangeRateSubscription>['data']>;
    export type TradingPlatformStatus = NonNullable<ReturnType<typeof useTradingPlatformStatus>['data']>;
    export type MT5AccountsList = NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
    export type SortedMT5Accounts = NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number];
    export type WalletAccountsList = NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
    export type ActiveWalletAccount = NonNullable<ReturnType<typeof useActiveWalletAccount>['data']>;
    export type DerivAccountsList = NonNullable<ReturnType<typeof useDerivAccountsList>['data']>[number];
    export type ActiveTradingAccount = NonNullable<ReturnType<typeof useActiveTradingAccount>['data']>;
    export type ActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;
    export type AllWalletAccounts = NonNullable<ReturnType<typeof useAllWalletAccounts>['data']>[number];
    export type AllAccountsList = NonNullable<ReturnType<typeof useAllAccountsList>>['data'];
    export type DynamicLeverage = NonNullable<ReturnType<typeof useDynamicLeverage>['data']>;
    export type CryptoTransactions = NonNullable<ReturnType<typeof useCryptoTransactions>['data']>[number];
    export type CryptoWithdrawal = NonNullable<ReturnType<typeof useCryptoWithdrawal>['mutateAsync']>;
    export type POA = NonNullable<ReturnType<typeof usePOA>['data']>;
    export type POI = NonNullable<ReturnType<typeof usePOI>['data']>;
    export type CurrencyConfig = NonNullable<ReturnType<typeof useCurrencyConfig>['data']>[string];
    export type GetCurrencyConfig = NonNullable<ReturnType<typeof useCurrencyConfig>['getConfig']>;
    export type Transactions = NonNullable<ReturnType<typeof useTransactions>['data']>[number];
    export type InfiniteTransactions = NonNullable<ReturnType<typeof useInfiniteTransactions>['data']>[number];
    export type TransferAccount = NonNullable<
        NonNullable<ReturnType<typeof useTransferBetweenAccounts>['data']>['accounts']
    >[number];
    export type AccountSettings = NonNullable<ReturnType<typeof useSettings>['data']>;
    export type DocumentUpload = TSocketError<'document_upload'> & TSocketResponse<'document_upload'>;
}
// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TPlatforms {
    export type All = MT5 | OtherAccounts | SortedMT5Accounts;
    export type MT5 = THooks.AvailableMT5Accounts['platform'];
    export type OtherAccounts = Exclude<
        Parameters<NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>>[0]['payload']['platform'],
        'derivez'
    >;
    export type SortedMT5Accounts = THooks.SortedMT5Accounts['platform'];
}
// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TMarketTypes {
    export type All = CreateOtherCFDAccount | SortedMT5Accounts;
    export type CreateOtherCFDAccount = Parameters<
        NonNullable<ReturnType<typeof useCreateOtherCFDAccount>['mutate']>
    >[0]['payload']['market_type'];
    export type SortedMT5Accounts = Exclude<THooks.SortedMT5Accounts['market_type'], undefined>;
}

// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TDisplayBalance {
    export type CtraderAccountsList = THooks.CtraderAccountsList['display_balance'];
    export type DxtradeAccountsList = THooks.DxtradeAccountsList['display_balance'];
    export type MT5AccountsList = THooks.MT5AccountsList['display_balance'];
}

export type TGenericSizes = '2xl' | '2xs' | '3xl' | '3xs' | '4xl' | '5xl' | '6xl' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';

export type TWalletLandingCompanyName =
    | Extract<THooks.MT5AccountsList['landing_company_short'], 'malta' | 'svg'>
    | 'virtual';
export type TMT5LandingCompanyName = THooks.MT5AccountsList['landing_company_short'];

export type TWalletCarouselItem = Omit<THooks.AllWalletAccounts, 'landing_company_name'>;

export type TIconTypes = Record<string, IconTypes>;

export type TCurrencyIconTypes = Record<THooks.WalletAccountsList['wallet_currency_type'], IconTypes>;

export type TProductForMarketDetails = NonNullable<
    Exclude<THooks.AvailableMT5Accounts['product'], 'financial' | 'standard'>
>;

export type TTranslations = ReturnType<typeof useTranslations>;

export type TLanguageType = 'AR' | 'EN' | 'FR';
