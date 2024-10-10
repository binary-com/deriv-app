import { PriceProposalResponse, Proposal } from '@deriv/api-types';
import {
    convertToUnix,
    getDecimalPlaces,
    getLocalizedBasis,
    getPropertyValue,
    isAccumulatorContract,
    isTurbosContract,
    toMoment,
    TRADE_TYPES,
} from '@deriv/shared';
import { TError, TTradeStore } from 'Types';

type TObjContractBasis = {
    text: string;
    value: string;
};

type TObjMultiplier = {
    cancellation?: string;
    limit_order?: {
        take_profit?: number;
        stop_loss?: number;
    };
    multiplier?: number;
};

type TObjAccum = {
    growth_rate?: number;
    limit_order?: {
        take_profit?: number;
    };
};

type TObjExpiry = {
    date_expiry?: number;
};

type TValidationParams =
    | {
          validation_params?: {
              payout?: {
                  max: string;
              };
              max_payout?: string;
              max_ticks?: number;
              stake?: {
                  max: string;
                  min: string;
              };
              take_profit: {
                  max: string;
                  min: string;
              };
              stop_loss: { max: string; min: string };
          };
      }
    | undefined;

export type ExpandedProposal = Proposal & TValidationParams;

const isVisible = (elem: HTMLElement) => !(!elem || (elem.offsetWidth === 0 && elem.offsetHeight === 0));

const map_error_field: { [key: string]: string } = {
    barrier: 'barrier_1',
    barrier2: 'barrier_2',
    date_expiry: 'expiry_date',
};

export const getProposalErrorField = (response: PriceProposalResponse) => {
    const error_field: string = getPropertyValue(response, ['error', 'details', 'field']);
    if (!error_field) {
        return null;
    }
    const error_id = map_error_field[error_field] || error_field;
    const el_error = document.getElementsByName(error_id)[0];
    return el_error && isVisible(el_error) ? error_id : null;
};

export const getProposalInfo = (
    store: TTradeStore,
    response: PriceProposalResponse & TError,
    obj_prev_contract_basis: TObjContractBasis
) => {
    const proposal: ExpandedProposal = response.proposal || ({} as ExpandedProposal);
    const profit = (proposal.payout || 0) - (proposal.ask_price || 0);
    const returns = (profit * 100) / (proposal.ask_price || 1);
    const stake = proposal.display_value;
    const basis_list = store.basis_list;

    const contract_basis: TObjContractBasis | undefined =
        store.is_vanilla || store.is_turbos
            ? { text: getLocalizedBasis().payout_per_point, value: 'display_number_of_contracts' }
            : basis_list.find(o => o.value !== store.basis) || ({} as TObjContractBasis);

    const is_stake = contract_basis?.value === 'stake';

    const price = is_stake ? stake : (proposal[contract_basis?.value as keyof ExpandedProposal] as string | number);

    const obj_contract_basis = {
        text: contract_basis?.text || '',
        value: price || '',
    };

    const commission = proposal.commission;
    const cancellation = proposal.cancellation;
    const accumulators_details = {
        ...proposal.contract_details,
        growth_rate: store.growth_rate,
        spot_time: proposal.spot_time,
    };

    return {
        commission,
        cancellation,
        id: proposal.id || '',
        has_error: !!response.error,
        has_error_details: !!getProposalErrorField(response),
        error_code: response?.error?.code,
        error_field: response?.error?.details?.field,
        limit_order: proposal.limit_order,
        message: proposal.longcode || response?.error?.message,
        obj_contract_basis,
        payout: proposal.payout,
        profit: profit.toFixed(getDecimalPlaces(store.currency)),
        returns: `${returns.toFixed(2)}%`,
        stake,
        spot: proposal.spot,
        validation_params: proposal?.validation_params,
        ...accumulators_details,
    };
};

export const createProposalRequests = (store: TTradeStore) => {
    const requests = {} as Record<string, ReturnType<typeof createProposalRequestForContract>>;

    Object.keys(store.trade_types).forEach(type => {
        const new_req = createProposalRequestForContract(store, type);
        requests[type] = new_req;
    });

    return requests;
};

const setProposalMultiplier = (store: TTradeStore, obj_multiplier: TObjMultiplier) => {
    obj_multiplier.multiplier = store.multiplier;
    obj_multiplier.cancellation = store.has_cancellation ? store.cancellation_duration : undefined;

    obj_multiplier.limit_order = store.has_take_profit || store.has_stop_loss ? {} : undefined;

    if (store.has_take_profit && store.take_profit && obj_multiplier.limit_order) {
        obj_multiplier.limit_order.take_profit = +store.take_profit || 0; // send positive take_profit to API
    }

    if (store.has_stop_loss && store.stop_loss && obj_multiplier.limit_order) {
        obj_multiplier.limit_order.stop_loss = +store.stop_loss || 0; // send positive stop_loss to API
    }
};

const setProposalAccumulator = (store: TTradeStore, obj_accumulator: TObjAccum) => {
    obj_accumulator.growth_rate = store.growth_rate;

    obj_accumulator.limit_order = store.has_take_profit ? {} : undefined;

    if (store.has_take_profit && store.take_profit && obj_accumulator.limit_order) {
        obj_accumulator.limit_order.take_profit = +store.take_profit || 0; // send positive take_profit to API
    }
};

export const createProposalRequestForContract = (store: TTradeStore, type_of_contract: string) => {
    const obj_accumulator: TObjAccum = {};
    const obj_expiry: TObjExpiry = {};
    const obj_multiplier: TObjMultiplier = {};
    let limit_order;

    if (store.expiry_type === 'endtime' && store.expiry_time) {
        const expiry_date = toMoment(store.expiry_date);
        obj_expiry.date_expiry = convertToUnix(expiry_date.unix(), store.expiry_time);
    }

    if (store.contract_type === TRADE_TYPES.MULTIPLIER) {
        setProposalMultiplier(store, obj_multiplier);
    }

    if (store.contract_type === TRADE_TYPES.ACCUMULATOR) {
        setProposalAccumulator(store, obj_accumulator);
    }

    if (isTurbosContract(store.contract_type) && store.has_take_profit && store.take_profit) {
        limit_order = { take_profit: +store.take_profit || 0 };
    }

    return {
        proposal: 1,
        subscribe: 1,
        amount: parseFloat(store.amount.toString()) || 0,
        basis: store.basis,
        contract_type: type_of_contract,
        currency: store.currency,
        symbol: store.symbol,
        ...(store.start_date && store.start_time && { date_start: convertToUnix(store.start_date, store.start_time) }),
        ...(store.expiry_type === 'duration'
            ? {
                  duration: parseInt(store.duration.toString()),
                  duration_unit: store.duration_unit,
              }
            : obj_expiry),
        ...((store.barrier_count > 0 || store.form_components.indexOf('last_digit') !== -1) &&
            !isAccumulatorContract(type_of_contract) &&
            !isTurbosContract(type_of_contract) && {
                barrier: store.barrier_1 || store.last_digit,
            }),
        ...(store.barrier_count === 2 && !isAccumulatorContract(type_of_contract) && { barrier2: store.barrier_2 }),
        ...(isTurbosContract(type_of_contract) && {
            payout_per_point: store.payout_per_point || store.last_digit,
        }),
        limit_order,
        ...obj_accumulator,
        ...obj_multiplier,
    };
};
