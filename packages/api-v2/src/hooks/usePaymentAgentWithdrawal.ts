import useMutation from '../useMutation';

/** A custom hook to request paymentagent withdrawal */
const usePaymentAgentWithdrawal = () => {
    const { data, ...rest } = useMutation('paymentagent_withdraw');

    /** Paymentagent withdrawal response */
    return {
        data,
        ...rest,
    };
};

export default usePaymentAgentWithdrawal;
