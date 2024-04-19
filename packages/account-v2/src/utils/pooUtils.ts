import { TPaymentMethod, TPaymentMethodData, TProofOfOwnershipData, TProofOfOwnershipFormValue } from 'src/types';

const defaultValue: TProofOfOwnershipData = {
    documentsRequired: 0,
    files: [],
    id: 0,
    identifierType: 'none',
    isGenericPM: false,
    paymentMethodIdentifier: '',
};

export const generatePOOInitialValues = (paymentMethodData: TPaymentMethodData) => {
    const paymentMethods = Object.keys(paymentMethodData) as TPaymentMethod[];

    return paymentMethods.reduce<TProofOfOwnershipFormValue>((acc, paymentMethod) => {
        const documentsRequired = paymentMethodData[paymentMethod]?.documentsRequired ?? 0;
        const items = paymentMethodData[paymentMethod]?.items;
        const identifierType = paymentMethodData[paymentMethod]?.identifier ?? 'none';
        const isGenericPM = paymentMethodData[paymentMethod]?.isGenericPM ?? false;
        acc[paymentMethod] = {};
        items?.forEach(item => {
            acc[paymentMethod][item.id as number] = {
                ...defaultValue,
                documentsRequired,
                id: item.id as number,
                identifierType,
                isGenericPM,
            };
        });
        return acc;
    }, {} as TProofOfOwnershipFormValue);
};
