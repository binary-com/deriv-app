type TParameters = {
    initial_stake: number;
    size: number;
    take_profit: number;
    stop_loss: number;
};

type TContractParametersItem = {
    contract_type: string;
    symbol: string;
    duration: string;
    duration_unit: string;
    basis: string;
    amount: number;
    currency: string;
};

type TDataBotItemParameters = {
    name: string;
    strategy: string;
    parameters: TParameters;
    contract_parameters: TContractParametersItem;
};

export type TBotListItem = {
    bot_id: string;
    name: string;
    status: string;
    strategy: string;
};

export type TBotList = {
    bot_listing: Array<TBotListItem>;
    message: string;
    status: string;
};

type TRequestSchemaKeys =
    | { bot_list: TBotList }
    | { bot_create: number }
    | { bot_remove: number }
    | { bot_start: number }
    | { bot_stop: number }
    | { bot_notification: number };

export type TRequestSchema = {
    data?: TDataBotItemParameters;
    subscribe?: number;
    bot_id?: string;
} & TRequestSchemaKeys;

export const initial_req_schema: TRequestSchema = {
    bot_create: 1,
    data: {
        name: 'Martingale strategy',
        strategy: 'martingale',
        parameters: {
            initial_stake: 1,
            size: 2,
            take_profit: 3,
            stop_loss: 3,
        },
        contract_parameters: {
            contract_type: 'CALL',
            symbol: '1HZ10V',
            duration: '5',
            duration_unit: 't',
            basis: 'stake',
            amount: 1,
            currency: 'USD',
        },
    },
};
