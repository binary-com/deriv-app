import { financialAssessmentValidations } from '../validations';

describe('Financial Assessment Validations', () => {
    it('should throw error if financial assessment fields empty', () => {
        Object.values(financialAssessmentValidations).forEach(validation => {
            expect(validation.validate('')).rejects.toThrowError();
        });
    });

    it('should resolve if fields has values', async () => {
        const {
            accountTurnover,
            educationLevel,
            employmentIndustry,
            employmentStatus,
            estimatedWorth,
            incomeSource,
            netIncome,
            occupation,
            sourceOfWealth,
        } = financialAssessmentValidations;

        await expect(accountTurnover.validate('$25,000 - $50,000')).resolves.toBeTruthy();
        await expect(educationLevel.validate('Secondary')).resolves.toBeTruthy();
        await expect(employmentIndustry.validate('Education')).resolves.toBeTruthy();
        await expect(employmentStatus.validate('Student')).resolves.toBeTruthy();
        await expect(estimatedWorth.validate('$250,001 - $500,000')).resolves.toBeTruthy();
        await expect(incomeSource.validate('State Benefits')).resolves.toBeTruthy();
        await expect(netIncome.validate('$100,001 - $500,000')).resolves.toBeTruthy();
        await expect(occupation.validate('Professionals')).resolves.toBeTruthy();
        await expect(sourceOfWealth.validate('Inheritance')).resolves.toBeTruthy();
    });
});
