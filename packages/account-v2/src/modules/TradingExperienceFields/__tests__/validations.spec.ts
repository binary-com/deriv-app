import { tradingExperienceValidations } from '../validations';

describe('Trading Experience Validations', () => {
    it('should throw error if financial assessment fields empty', async () => {
        const {
            binaryOptionsTradingExperience,
            binaryOptionsTradingFrequency,
            cfdTradingExperience,
            cfdTradingFrequency,
            forexTradingExperience,
            forexTradingFrequency,
            otherTradingInstrumentsExperience,
            otherTradingInstrumentsFrequency,
        } = tradingExperienceValidations;

        await expect(binaryOptionsTradingExperience.validate('')).rejects.toThrowError();
        await expect(binaryOptionsTradingFrequency.validate('')).rejects.toThrowError();
        await expect(cfdTradingExperience.validate('')).rejects.toThrowError();
        await expect(cfdTradingFrequency.validate('')).rejects.toThrowError();
        await expect(forexTradingExperience.validate('')).rejects.toThrowError();
        await expect(forexTradingFrequency.validate('')).rejects.toThrowError();
        await expect(otherTradingInstrumentsExperience.validate('')).rejects.toThrowError();
        await expect(otherTradingInstrumentsFrequency.validate('')).rejects.toThrowError();
    });

    it('should resolve if fields has values', async () => {
        const {
            binaryOptionsTradingExperience,
            binaryOptionsTradingFrequency,
            cfdTradingExperience,
            cfdTradingFrequency,
            forexTradingExperience,
            forexTradingFrequency,
            otherTradingInstrumentsExperience,
            otherTradingInstrumentsFrequency,
        } = tradingExperienceValidations;

        await expect(binaryOptionsTradingExperience.validate('1-2 years')).resolves.toBeTruthy();
        await expect(binaryOptionsTradingFrequency.validate('1-5 transactions in 12 months')).resolves.toBeTruthy();
        await expect(cfdTradingExperience.validate('1-2 years')).resolves.toBeTruthy();
        await expect(cfdTradingFrequency.validate('2-6 transactions in 12 months')).resolves.toBeTruthy();
        await expect(forexTradingExperience.validate('1-2 years')).resolves.toBeTruthy();
        await expect(forexTradingFrequency.validate('3-7 transactions in 12 months')).resolves.toBeTruthy();
        await expect(otherTradingInstrumentsExperience.validate('1-2 years')).resolves.toBeTruthy();
        await expect(otherTradingInstrumentsFrequency.validate('6-10 transactions in 12 months')).resolves.toBeTruthy();
    });
});
