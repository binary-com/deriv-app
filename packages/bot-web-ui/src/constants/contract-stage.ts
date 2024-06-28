export type TContractStage = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const contract_stages = Object.freeze({
    NOT_RUNNING: 0,
    STARTING: 1,
    RUNNING: 2,
    PURCHASE_SENT: 3,
    PURCHASE_RECEIVED: 4,
    IS_STOPPING: 5,
    CONTRACT_CLOSED: 6,
});
