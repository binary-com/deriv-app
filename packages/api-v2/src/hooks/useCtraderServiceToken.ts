import useMutation from '../useMutation';

/** A custom hook that get Service Token for CTrader Platform. */
const useCtraderServiceToken = () => {
    const { data: ctrader_token, ...rest } = useMutation('service_token');

    return {
        /** return the ctrader account token */
        data: ctrader_token?.service_token?.ctrader?.token,
        ...rest,
    };
};

export default useCtraderServiceToken;
