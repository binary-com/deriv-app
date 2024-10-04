import { useMutation } from '@deriv/api';
import { useCallback } from 'react';

const useTinValidations = () => {
    const { data, mutate: _mutate, ...rest } = useMutation('tin_validations');

    const mutate = useCallback((tax_residence: string) => _mutate({ payload: { tax_residence } }), [_mutate]);

    return {
        tin_validation_config: data?.tin_validations ?? {},
        mutate,
        ...rest,
    };
};

export default useTinValidations;
