import {
    getPersonalDetailsInitialValues,
    getPersonalDetailsValidationSchema,
    makeSettingsRequest,
} from '../validation';

describe('getPersonalDetailsValidationSchema', () => {
    const valid_data = {
        first_name: 'John',
        last_name: 'Doe',
        phone: '+123456789',
        address_line_1: 'Kuala Lumpur',
        address_city: 'Kuala Lumpur',
        citizen: 'Malaysian',
        tax_identification_number: '123123123',
        tax_residence: 'Germany',
        employment_status: 'Employed',
        date_of_birth: '1990-01-01',
        tax_identification_confirm: true,
    };

    const invalid_data = {
        first_name: 'John',
        last_name: 'Doe123',
        phone: 'wrong',
        address_line_1: '',
        address_city: '',
        citizen: '',
    };

    it('should validate a valid input for non-eu users', async () => {
        const validationSchema = getPersonalDetailsValidationSchema();
        const isValid = await validationSchema.isValid(valid_data);
        expect(isValid).toBe(true);
    });

    it('should not validate an invalid input for non-eu users', async () => {
        const validationSchema = getPersonalDetailsValidationSchema();
        try {
            await validationSchema.isValid(invalid_data);
        } catch (error) {
            // @ts-expect-error [TODO]: Fix type for error
            expect(error.errors.length).toBeGreaterThan(0);
        }
    });

    it('should validate a valid input for eu users', async () => {
        const validationSchema = getPersonalDetailsValidationSchema();
        const isValid = await validationSchema.isValid(valid_data);
        expect(isValid).toBe(true);
    });

    it('should return empty object for virtual account', () => {
        const validationSchema = getPersonalDetailsValidationSchema(true);
        expect(validationSchema.fields).toEqual({});
    });
});

const account_settings = {
    first_name: 'John',
    last_name: 'Doe',
    place_of_birth: 'co',
    address_state: 'state_test',
};
const mock_residence_list = [
    { value: 'id', text: 'Indonesia' },
    { value: 'co', text: 'Colombia' },
];
const mock_state_list = [
    {
        text: 'State Test',
        value: 'state_test',
    },
];

describe('getPersonalDetailsInitialValues', () => {
    it('should return correct initial values', () => {
        const initial_values = getPersonalDetailsInitialValues(account_settings, mock_residence_list, mock_state_list);

        expect(initial_values.first_name).toBe('John');
        expect(initial_values.last_name).toBe('Doe');
        expect(initial_values.place_of_birth).toBe('Colombia');
        expect(initial_values.address_state).toBe('State Test');
    });

    it('should return default values for virtual account', () => {
        const mock_settings = {
            ...account_settings,
            residence: 'id',
        };

        const initial_values = getPersonalDetailsInitialValues(
            mock_settings,
            mock_residence_list,
            mock_state_list,
            true
        );

        expect(initial_values).toEqual({
            email_consent: 0,
            residence: 'id',
        });
    });
});

describe('makeSettingsRequest', () => {
    it('should return correct request object for virtual user', () => {
        const mock_settings = {
            ...account_settings,
            email_consent: '1',
        };

        const result = makeSettingsRequest(mock_settings as any, mock_residence_list, mock_state_list, true);
        expect(result).toEqual({ email_consent: '1' });
    });

    it('should return correct request object for non-virtual user', () => {
        const mock_settings = {
            ...account_settings,
            tax_residence: 'Indonesia',
            tax_identification_number: '123',
            residence: 'Indonesia',
        };
        const result = makeSettingsRequest(mock_settings, mock_residence_list, mock_state_list, false);
        expect(result).toEqual({
            first_name: 'John',
            last_name: 'Doe',
            place_of_birth: '',
            address_state: '',
            tax_identification_number: '123',
            tax_residence: 'id',
        });
    });
});
