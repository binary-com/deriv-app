import { renderHook, act } from '@testing-library/react-hooks';
import useFinancialAssessment from '../useFinancialAssessment';
import useQuery from '../../useQuery';
import useMutation from '../../useMutation';

jest.mock('../../useQuery');
jest.mock('../../useMutation');
jest.mock('../../useInvalidateQuery');

const mockUpdate = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    (useMutation as jest.Mock).mockReturnValue({
        mutate: mockUpdate,
    });
    (useQuery as jest.Mock).mockReturnValue({
        data: {
            get_financial_assessment: {
                account_turnover: '10000',
                education_level: 'Bachelor',
                employment_industry: 'IT',
                employment_status: 'Employed',
                estimated_worth: '100000',
                income_source: 'Salary',
                net_income: '5000',
                occupation: 'Developer',
                source_of_wealth: 'Salary',
            },
        },
    });
});

describe('useFinancialAssessment', () => {
    it('should return the financial assessment values', () => {
        const { result } = renderHook(() => useFinancialAssessment());

        expect(result.current.data).toStrictEqual({
            account_turnover: '10000',
            education_level: 'Bachelor',
            employment_industry: 'IT',
            employment_status: 'Employed',
            estimated_worth: '100000',
            income_source: 'Salary',
            net_income: '5000',
            occupation: 'Developer',
            source_of_wealth: 'Salary',
        });
    });

    it('should update financial assessment', () => {
        const { result } = renderHook(() => useFinancialAssessment());

        act(() => {
            result.current.update({
                account_turnover: 'Less than $25,000',
                education_level: 'Secondary',
                employment_industry: 'Finance',
                employment_status: 'Self-Employed',
                estimated_worth: 'Less than $100,000',
                income_source: 'Pension',
                net_income: 'Less than $25,000',
                occupation: 'Managers',
                source_of_wealth: 'Inheritance',
            });
        });

        expect(mockUpdate).toHaveBeenCalledWith({
            payload: {
                account_turnover: 'Less than $25,000',
                education_level: 'Secondary',
                employment_industry: 'Finance',
                employment_status: 'Self-Employed',
                estimated_worth: 'Less than $100,000',
                income_source: 'Pension',
                net_income: 'Less than $25,000',
                occupation: 'Managers',
                source_of_wealth: 'Inheritance',
            },
        });
    });
});
