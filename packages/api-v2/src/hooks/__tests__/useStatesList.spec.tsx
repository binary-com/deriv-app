import { renderHook } from '@testing-library/react-hooks';
import useQuery from '../../useQuery';
import useStatesList from '../useStatesList';
import type { StatesList } from '@deriv/api';

jest.mock('../../useQuery');

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery<'states_list'>>;

describe('useStatesList', () => {
    it('should return an empty array when the store is not ready', () => {
        mockUseQuery.mockReturnValue({
            data: {
                states_list: [] as StatesList,
            },
        } as ReturnType<typeof useQuery<'states_list'>>);
        const { result } = renderHook(() => useStatesList('in'));

        expect(result.current.data).toHaveLength(0);
    });

    it('should return data fetched along with correct status', () => {
        mockUseQuery.mockReturnValue({
            data: {
                states_list: [
                    { text: 'state 1', value: 's1' },
                    { text: 'state 2', value: 's2' },
                ] as StatesList,
            },
            isFetched: true,
        } as ReturnType<typeof useQuery<'states_list'>>);
        const { result } = renderHook(() => useStatesList('in'));
        expect(result.current.isFetched).toBeTruthy();
    });

    it('should call the useQuery with options if passed', () => {
        renderHook(() => useStatesList('in', { enabled: false }));
        expect(mockUseQuery).toHaveBeenCalledWith('states_list', {
            payload: { states_list: 'in' },
            options: { enabled: false },
        });
    });
});
