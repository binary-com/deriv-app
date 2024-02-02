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

export type TRequestSchema = {
    bot_create: number;
    data: TDataBotItemParameters;
};

export const initial_req_schema: TRequestSchema = {
    bot_create: 1,
    data: {
        name: 'your bot',
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
