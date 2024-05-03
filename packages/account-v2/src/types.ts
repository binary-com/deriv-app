import {
    useAllAccountsList,
    useCloseDerivAccount,
    useGetAccountStatus,
    useKycAuthStatus,
    useSettings,
} from '@deriv/api-v2';
import { CurrencyConstants } from '@deriv-com/utils';
import {
    AUTH_STATUS_CODES,
    getPaymentMethodsConfig,
    IDV_ERROR_CODES,
    PAYMENT_METHOD_IDENTIFIER,
    POI_SERVICE,
} from './constants';

export type TSupportedDocuments = Exclude<
    Exclude<ReturnType<typeof useKycAuthStatus>['kyc_auth_status'], undefined>['identity']['supported_documents'],
    undefined
>['idv'];

export type TSupportedPOIServices = Exclude<
    ReturnType<typeof useKycAuthStatus>['kyc_auth_status'],
    undefined
>['identity']['service'];

export type TPOIStatus = Exclude<
    ReturnType<typeof useKycAuthStatus>['kyc_auth_status'],
    undefined
>['identity']['status'];

export type TGetSettingsResponse = ReturnType<typeof useSettings>['data'];

export type TAuthStatusCodes = typeof AUTH_STATUS_CODES[keyof typeof AUTH_STATUS_CODES];

export type TPaymentMethod = keyof ReturnType<typeof getPaymentMethodsConfig>;

export type TPaymentMethodIdentifier =
    | typeof PAYMENT_METHOD_IDENTIFIER[keyof typeof PAYMENT_METHOD_IDENTIFIER]
    | 'none';

export type TPaymentMethodInfo = {
    documentsRequired?: number;
    identifier: TPaymentMethodIdentifier;
    inputLabel: string | null;
    isGenericPM: boolean;
    items: Exclude<
        Exclude<
            Exclude<ReturnType<typeof useGetAccountStatus>['data'], undefined>['authentication'],
            undefined
        >['ownership'],
        undefined
    >['requests'];
    paymentMethod: string;
};

export type TFile = File & { file: Blob };

export type TPaymentMethodData = Record<TPaymentMethod, TPaymentMethodInfo>;

export type TProofOfOwnershipData = {
    documentsRequired: number;
    files: TFile[];
    id: number;
    identifierType: TPaymentMethodIdentifier | 'none';
    isGenericPM: boolean;
    paymentMethodIdentifier: string;
};

export type TProofOfOwnershipFormValue = Record<TPaymentMethod, Record<number | string, TProofOfOwnershipData>>;
export type TPOIService = typeof POI_SERVICE[keyof typeof POI_SERVICE];

export type TIDVErrorStatusCode = typeof IDV_ERROR_CODES[keyof typeof IDV_ERROR_CODES]['code'];

export type TAccountLimitValues = {
    category?: string;
    hintInfo?: string;
    isLessProminent?: boolean;
    title?: string;
    value?: number | string;
};

export type TCurrency = CurrencyConstants.Currency;

export type TProofOfOwnershipErrors = Record<TPaymentMethod, { files?: string[]; paymentMethodIdentifier?: string }[]>;

export type TAccountClosureError = NonNullable<ReturnType<typeof useCloseDerivAccount>['error']>['error'] & {
    details: {
        [key: string]: unknown;
    };
};

export type TAccountList = Exclude<ReturnType<typeof useAllAccountsList>['data'], undefined>;

export type TDTraderAccountDetails = TAccountList['dtrade'];
