import { getIDVFormValidationSchema } from '../kyc-validation-config';

describe('getIDVFormValidationSchema', () => {
    it('should return return true when data matches schema', async () => {
        const schema = getIDVFormValidationSchema();

        const result = await schema.isValid({
            document_additional: 'hompl7358z',
            document_number: '123456789011',
            document_type: {
                additional: {
                    displayName: 'PAN Card',
                    exampleFormat: 'ABCDE1234F',
                    format: '^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$',
                },
                exampleFormat: '123456789012',
                id: 'aadhaar',
                text: 'Aadhaar Card',
                value: '^[0-9]{12}$',
            },
        });

        expect(result).toBeTruthy();
    });

    it('should return false when data fails to match schema', async () => {
        const schema = getIDVFormValidationSchema();

        const result = await schema.isValid({
            document_number: 'Abc123456',
            document_type: {
                exampleFormat: 'ABC1234567',
                id: 'epic',
                text: 'Voter ID',
                value: '^[a-zA-Z]{3}[0-9]{7}$',
            },
        });

        expect(result).toBeFalsy();
    });
});
