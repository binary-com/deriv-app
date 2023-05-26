import { getUnsupportedContracts } from '../constants';
import { getSymbolDisplayName, TActiveSymbols } from './active-symbols';
import { getMarketInformation } from './market-underlying';

type TPortfolioPos = {
    buy_price: number;
    contract_id?: number;
    contract_type?: string;
    longcode: string;
    payout: number;
    shortcode: string;
    transaction_id?: number;
    transaction_ids?: {
        buy: number;
        sell: number;
    };
    limit_order?: {
        stop_loss?: null | number;
        take_profit?: null | number;
    };
};

type TIsUnSupportedContract = {
    contract_type?: string;
    is_forward_starting?: 0 | 1;
};

const isUnSupportedContract = (portfolio_pos: TIsUnSupportedContract) =>
    !!getUnsupportedContracts()[portfolio_pos.contract_type as keyof typeof getUnsupportedContracts] || // check unsupported contract type
    !!portfolio_pos.is_forward_starting; // for forward start contracts

export const formatPortfolioPosition = (
    portfolio_pos: TPortfolioPos,
    active_symbols: TActiveSymbols = [],
    indicative?: number
) => {
    const purchase = portfolio_pos.buy_price;
    const payout = portfolio_pos.payout;
    const display_name = getSymbolDisplayName(active_symbols, getMarketInformation(portfolio_pos.shortcode).underlying);
    const transaction_id =
        portfolio_pos.transaction_id || (portfolio_pos.transaction_ids && portfolio_pos.transaction_ids.buy);

    return {
        contract_info: portfolio_pos,
        details: portfolio_pos.longcode.replace(/\n/g, '<br />'),
        display_name,
        id: portfolio_pos.contract_id,
        indicative: (indicative && isNaN(indicative)) || !indicative ? 0 : indicative,
        payout,
        purchase,
        reference: Number(transaction_id),
        type: portfolio_pos.contract_type,
        is_unsupported: isUnSupportedContract(portfolio_pos),
        contract_update: portfolio_pos.limit_order,
    };
};

export type TIDVErrorStatus =
    | 'POI_NAME_DOB_MISMATCH'
    | 'POI_DOB_MISMATCH'
    | 'POI_NAME_MISMATCH'
    | 'POI_EXPIRED'
    | 'POI_FAILED';

export const formatIDVError = (errors: string[]) => {
    const error_keys = { name: 'POI_NAME_MISMATCH', birth: 'POI_DOB_MISMATCH' };
    const status: TIDVErrorStatus[] = [];
    errors.forEach(error => {
        const error_regex = error.match(/(name|birth)/i);
        if (error_regex) {
            status.push(error_keys[error_regex[0].toLowerCase()]);
        }
    });
    return status.length === 2 ? 'POI_NAME_DOB_MISMATCH' : status[0];
};
