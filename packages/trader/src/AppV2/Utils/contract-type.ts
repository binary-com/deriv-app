import { isRiseFallContract, isTurbosContract, isVanillaContract } from '@deriv/shared';

export const checkContractTypePrefix = (values: string[]): boolean => {
    return [isVanillaContract, isTurbosContract, isRiseFallContract].some(contractTypeCheck =>
        values.every(value => contractTypeCheck(value))
    );
};
