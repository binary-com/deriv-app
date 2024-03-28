import { useCallback, useMemo } from 'react';
import useQuery from '../useQuery';
import useInvalidateQuery from '../useInvalidateQuery';
import useMutation from '../useMutation';

type TFinancialAssessmentPayload = NonNullable<
    NonNullable<
        NonNullable<Parameters<ReturnType<typeof useMutation<'set_financial_assessment'>>['mutate']>>[0]
    >['payload']
>;

/** A custom hook to get and update the user financial assessment. */
const useFinancialAssessment = () => {
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useQuery('get_financial_assessment');
    const { mutate, ...mutate_rest } = useMutation('set_financial_assessment', {
        onSuccess: () => invalidate('get_financial_assessment'),
    });

    const update = useCallback((payload: TFinancialAssessmentPayload) => mutate({ payload }), [mutate]);

    // Add additional information to the financial_assessment response.
    const modified_financial_assessment = useMemo(() => {
        return {
            ...data?.get_financial_assessment,
        } as TFinancialAssessmentPayload;
    }, [data?.get_financial_assessment]);

    return {
        /** The financial_assessment response. */
        data: modified_financial_assessment,
        /** Function to update user financial_assessment */
        update,
        /** The mutation related information */
        mutation: mutate_rest,
        ...rest,
    };
};

export default useFinancialAssessment;
