import { EMPLOYMENT_VALUES, occupationList } from '../../constants/financialInformationList';
import { filterOccupationList, shouldHideOccupation } from '../financialAssessmentUtils';

describe('filterOccupationList', () => {
    it('should filter occupation list based on employment status', () => {
        expect(filterOccupationList(EMPLOYMENT_VALUES.employed)).toEqual(
            occupationList.filter(item => item.value !== EMPLOYMENT_VALUES.unemployed)
        );

        expect(filterOccupationList(EMPLOYMENT_VALUES.selfEmployed)).toEqual(
            occupationList.filter(item => item.value !== EMPLOYMENT_VALUES.unemployed)
        );

        expect(filterOccupationList(EMPLOYMENT_VALUES.unemployed)).toEqual(occupationList);
    });
});

describe('shouldHideOccupation', () => {
    it('should return true if employment status is unemployed', () => {
        expect(shouldHideOccupation(EMPLOYMENT_VALUES.unemployed)).toBe(true);
    });

    it('should return false if employment status is not unemployed', () => {
        expect(shouldHideOccupation(EMPLOYMENT_VALUES.employed)).toBe(false);
        expect(shouldHideOccupation(EMPLOYMENT_VALUES.selfEmployed)).toBe(false);
    });
});
