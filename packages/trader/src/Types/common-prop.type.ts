import {
    ActiveSymbolsResponse,
    BuyContractResponse,
    BuyContractRequest,
    ContractsForSymbolResponse,
    ForgetAllResponse,
    ForgetResponse,
    PriceProposalOpenContractsResponse,
    PriceProposalOpenContractsRequest,
    PriceProposalResponse,
    PriceProposalRequest,
    ServerTimeResponse,
    TicksHistoryResponse,
    TicksStreamResponse,
    TicksStreamRequest,
    TradingTimesResponse,
    UpdateContractHistoryResponse,
    UpdateContractResponse,
    UpdateContractRequest,
} from '@deriv/api-types';
import { TCoreStores } from '@deriv/stores/types';
import ModulesStore from 'Stores/Modules';
import { useTraderStore } from 'Stores/useTraderStores';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { TSocketEndpointNames, TSocketResponse } from '../../../api/types';
import {
    buildBarriersConfig,
    buildDurationConfig,
    buildForwardStartingConfig,
    getContractTypesConfig,
} from '@deriv/shared';

export type TRootStore = {
    client: TCoreStores['client'];
    common: TCoreStores['common'];
    modules: ModulesStore;
    ui: TCoreStores['ui'];
    gtm: TCoreStores['gtm'];
    notifications: TCoreStores['notifications'];
    contract_replay: TCoreStores['contract_replay'];
    contract_trade: TCoreStores['contract_trade'];
    portfolio: TCoreStores['portfolio'];
    chart_barrier_store: TCoreStores['chart_barrier_store'];
    active_symbols: TCoreStores['active_symbols'];
};

export type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
    passthrough?: {
        root_store: TCoreStores;
        WS: TWebSocket;
    };
};

export type TBuyRequest = {
    proposal_id: string;
    price: string | number;
    passthrough?: BuyContractRequest['passthrough'];
};

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
    fields?: string[];
};

export type TTextValueStrings = {
    text: string;
    value: string;
};

export type TTextValueNumber = {
    text: string;
    value: number;
};

export type TProposalTypeInfo = TTradeStore['proposal_info'][string];

export type TError = {
    error?: {
        code?: string;
        details?: {
            field?: string;
        };
        message?: string;
    };
};

type TRoute = {
    component?: React.ComponentType<RouteComponentProps> | React.ComponentType<Record<string, never>> | typeof Redirect;
    default?: boolean;
    exact?: boolean;
    getTitle?: () => string;
    path?: string;
    to?: string;
};

export type TRouteConfig = TRoute & {
    is_authenticated?: boolean;
    routes?: TRoute[];
};

export type TTradeStore = ReturnType<typeof useTraderStore>;

type TWebSocketCall = {
    activeSymbols: (mode?: 'string') => Promise<ActiveSymbolsResponse>;
    send?: (req?: Record<string, unknown>) => Promise<{ error?: TServerError & Record<string, unknown> }>;
    subscribeProposalOpenContract: (
        contract_id: PriceProposalOpenContractsRequest['contract_id'],
        callback: (response: PriceProposalOpenContractsResponse) => void
    ) => void;
};

type TWebSocketSend = (req?: Record<string, unknown>) => Promise<{ error?: TServerError & Record<string, unknown> }>;

export type TWebSocket = {
    activeSymbols: (mode?: 'string') => Promise<ActiveSymbolsResponse>;
    authorized: TWebSocketCall;
    buy: (req: TBuyRequest) => Promise<BuyContractResponse & { error?: TServerError }>;
    contractUpdate: (
        contract_id: UpdateContractRequest['contract_id'],
        limit_order: UpdateContractRequest['limit_order']
    ) => Promise<{ error?: TServerError } & UpdateContractResponse>;
    contractUpdateHistory: (contract_id?: number) => Promise<UpdateContractHistoryResponse & { error?: TServerError }>;
    forget: (id: string) => Promise<ForgetResponse>;
    forgetAll: <T extends TSocketEndpointNames>(value: T) => Promise<ForgetAllResponse>;
    forgetStream: (stream_id: string) => void;
    send?: TWebSocketSend;
    subscribeProposal: (
        req: Partial<PriceProposalRequest>,
        callback: (response: Promise<PriceProposalResponse & { error?: TServerError }>) => void
    ) => Promise<PriceProposalResponse & { error?: TServerError }>;
    subscribeTicks: (symbol: string, callback: (response: TicksStreamResponse) => void) => void;
    subscribeTicksHistory: (
        req: TicksStreamRequest,
        callback: (response: TicksHistoryResponse | TicksStreamResponse) => void
    ) => Promise<{ error?: TServerError } & (TicksHistoryResponse | TicksStreamResponse)>;
    storage: {
        contractsFor: (symbol: string) => Promise<ContractsForSymbolResponse>;
        send?: TWebSocketSend;
    };
    time: () => Promise<ServerTimeResponse>;
    tradingTimes: (date: string) => Promise<TradingTimesResponse>;
    wait: <T extends TSocketEndpointNames>(value: T) => Promise<TSocketResponse<T>>;
};

export type TContractTypesList = {
    [key: string]: {
        name: string;
        categories: TTextValueStrings[];
    };
};

export type TConfig = ReturnType<typeof getContractTypesConfig>[string]['config'] & {
    has_spot?: boolean;
    durations?: ReturnType<typeof buildDurationConfig>;
    trade_types?: { [key: string]: string };
    barrier_category?: string;
    barriers?: ReturnType<typeof buildBarriersConfig>;
    forward_starting_dates?: ReturnType<typeof buildForwardStartingConfig>;
    growth_rate_range?: number[];
    multiplier_range?: number[];
    cancellation_range?: string[];
    barrier_choices?: string[];
};
