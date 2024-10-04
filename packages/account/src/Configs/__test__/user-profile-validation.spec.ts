import * as Yup from 'yup';
import {
    getAddressDetailValidationSchema,
    getEmploymentAndTaxValidationSchema,
    getPersonalDetailsBaseValidationSchema,
} from '../user-profile-validation-config';
import { TinValidations } from '@deriv/api/types';
import { ValidationConstants } from '@deriv-com/utils';

describe('getPersonalDetailsBaseValidationSchema', () => {
    let validation_schema: ReturnType<typeof getPersonalDetailsBaseValidationSchema>;

    it('should validate a valid set of personal details for non-eu clients', () => {
        validation_schema = getPersonalDetailsBaseValidationSchema('svg');
        const valid_values = {
            first_name: 'John',
            last_name: 'Doe',
            phone: '+1234567890',
            account_opening_reason: 'Investment',
            date_of_birth: '1990-01-01',
            place_of_birth: 'Germany',
        };

        expect(validation_schema.isValidSync(valid_values)).toBeTruthy();
    });

    it('should validate a valid set of personal details for eu clients', () => {
        validation_schema = getPersonalDetailsBaseValidationSchema('maltainvest');
        const valid_values = {
            salutation: 'Mr',
            first_name: 'John',
            last_name: 'Doe',
            phone: '+1234567890',
            account_opening_reason: 'Investment',
            date_of_birth: '1990-01-01',
            place_of_birth: 'Germany',
            citizen: 'Germany',
        };

        expect(validation_schema.isValidSync(valid_values)).toBeTruthy();
    });

    it('should throw an error if salutation is not provided for maltainvest clients', () => {
        validation_schema = getPersonalDetailsBaseValidationSchema('maltainvest');
        const invalid_values = {
            first_name: 'John',
            last_name: 'Doe',
            phone: '+1234567890',
            account_opening_reason: 'Investment',
            date_of_birth: '1990-01-01',
            place_of_birth: 'Germany',
            citizen: 'Germany',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe('Salutation is required.');
        }
    });

    it('should throw an error if first name is invalid', async () => {
        const { first_name } = getPersonalDetailsBaseValidationSchema('svg').fields;

        await expect(first_name.validate('John')).resolves.toBe('John');
        await expect(first_name.validate('')).rejects.toThrow('First name is required.');
        await expect(first_name.validate('A1')).rejects.toThrow('Letters, spaces, periods, hyphens, apostrophes only.');
        await expect(
            first_name.validate('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKL')
        ).rejects.toThrow('Enter no more than 50 characters.');
    });

    it('should throw an error if last name is invalid', async () => {
        const { last_name } = getPersonalDetailsBaseValidationSchema('maltainvest').fields;

        await expect(last_name.validate('Doe')).resolves.toBe('Doe');
        await expect(last_name.validate('')).rejects.toThrow('Last name is required.');
        await expect(last_name.validate('A2')).rejects.toThrow('Letters, spaces, periods, hyphens, apostrophes only.');
        await expect(
            last_name.validate('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKL')
        ).rejects.toThrow('Enter no more than 50 characters.');
    });

    it('should throw an error if date of birth is invalid', async () => {
        const { date_of_birth } = getPersonalDetailsBaseValidationSchema('svg').fields;

        await expect(date_of_birth.validate('1990-01-01')).resolves.toBe('1990-01-01');
        await expect(date_of_birth.validate('')).rejects.toThrow('Date of birth is required.');
        await expect(date_of_birth.validate('2021-01-01')).rejects.toThrow('You must be 18 years old and above.');
    });

    it('should throw an error if phone number is invalid', async () => {
        const { phone } = getPersonalDetailsBaseValidationSchema('svg').fields;

        await expect(phone.validate('+1234567890')).resolves.toBe('+1234567890');
        await expect(phone.validate('')).rejects.toThrow('Phone is required.');
        await expect(phone.validate('1234567890')).rejects.toThrow(
            'Please enter a valid phone number (e.g. +15417541234).'
        );
        await expect(phone.validate('1234567890'.repeat(4))).rejects.toThrow('You should enter 9-20 numbers.');
    });

    it('should throw an error if place of birth is invalid', async () => {
        const { place_of_birth } = getPersonalDetailsBaseValidationSchema('svg').fields;

        await expect(place_of_birth.validate('Germany')).resolves.toBe('Germany');
        await expect(place_of_birth.validate('')).rejects.toThrow('Place of birth is required.');
    });

    it('should throw an error if account opening reason is invalid', async () => {
        const { account_opening_reason } = getPersonalDetailsBaseValidationSchema('svg').fields;

        await expect(account_opening_reason.validate('Investment')).resolves.toBe('Investment');
        await expect(account_opening_reason.validate('')).rejects.toThrow('Account opening reason is required.');
    });

    it('should throw an error if citizen is invalid', async () => {
        const { citizen } = getPersonalDetailsBaseValidationSchema('maltainvest').fields;

        await expect(citizen.validate('Germany')).resolves.toBe('Germany');
        await expect(citizen.validate('')).rejects.toThrow('Citizenship is required.');
    });
});

describe('getEmploymentAndTaxValidationSchema', () => {
    let validation_schema: ReturnType<typeof getEmploymentAndTaxValidationSchema>;

    const tin_config: TinValidations = {
        tin_employment_status_bypass: ['Student'],
        tin_format: ['^\\d{5}$'],
        is_tin_mandatory: false,
    };

    beforeAll(() => {
        validation_schema = getEmploymentAndTaxValidationSchema({ tin_config });
    });

    it('should validate employment and tax details when valid values are provided', () => {
        const valid_values = {
            employment_status: 'Employed',
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '12345',
        };

        expect(validation_schema.isValidSync(valid_values)).toBeTruthy();
    });

    it('should throw employment status required error when employment status is not provided', () => {
        const invalid_values = {
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '12345',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(Yup.ValidationError);
            expect((error as Yup.ValidationError).message).toBe('Employment status is required.');
        }
    });

    it('should ensure tax details are confirmed when tax identification number and tax residence is provided', () => {
        const invalid_values = {
            employment_status: 'Employed',
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: false,
            tax_identification_number: '12345',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(Yup.ValidationError);
            expect((error as Yup.ValidationError).message).toBe(
                'tax_identification_confirm must be one of the following values: true'
            );
        }
    });

    it('should ensure tax identification number is not longer than 25 characters', () => {
        const invalid_values = {
            employment_status: 'Employed',
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '12345678901234567890123456',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe(
                "Tax identification number can't be longer than 25 characters."
            );
        }
    });

    it('should ensure tax identification number is properly formatted', () => {
        const invalid_values = {
            employment_status: 'Employed',
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '1234',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe('Tax identification number is not properly formatted.');
        }
    });

    it('should ensure tax identification number starts with a letter or number', () => {
        const invalid_values = {
            employment_status: 'Employed',
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '-1234',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe('Tax identification number is not properly formatted.');
        }
    });

    it('should ensure tax residence is provided when tax identification number is provided', () => {
        const invalid_values = {
            employment_status: 'Employed',
            tax_residence: '',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '1234',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe('Please fill in tax residence.');
        }
    });

    it('should not validate tax details when tin_skipped is true', () => {
        const valid_values = {
            employment_status: 'Student',
            tin_skipped: 1,
            tax_residence: 'Germany',
        };
        expect(validation_schema.isValidSync(valid_values)).toBeTruthy();
    });
});

describe('getAddressDetailValidationSchema', () => {
    const maxCharsMessage = 'Only 70 characters, please.';
    const { addressPermittedSpecialCharacters } = ValidationConstants.messagesHints;

    it('validates address_line_1 correctly without svg flag', async () => {
        const { address_line_1 } = getAddressDetailValidationSchema(false).fields;

        await expect(address_line_1.validate('123 Main St')).resolves.toBe('123 Main St');
        await expect(address_line_1.validate('')).rejects.toThrow('First line of address is required');
        await expect(address_line_1.validate('a$^&')).rejects.toThrow(
            `Use only the following special characters: ${addressPermittedSpecialCharacters}`
        );
        await expect(address_line_1.validate('a'.repeat(71))).rejects.toThrow(maxCharsMessage);
        await expect(address_line_1.validate('P.O. Box 121')).resolves.toBe('P.O. Box 121');
    });

    it("PO box shouldn't exist for SVG ", async () => {
        const { address_line_1 } = getAddressDetailValidationSchema(true).fields;
        await expect(address_line_1.validate('P.O. Box 123')).rejects.toThrow('P.O. Box is not accepted in address');
    });

    it('validates address_line_2 correctly', async () => {
        const { address_line_2 } = getAddressDetailValidationSchema(false).fields;

        await expect(address_line_2.validate('Apt 4B')).resolves.toBe('Apt 4B');
        await expect(address_line_2.validate('a$^&')).rejects.toThrow(
            `Use only the following special characters: ${addressPermittedSpecialCharacters}`
        );
        await expect(address_line_2.validate('a'.repeat(71))).rejects.toThrow(maxCharsMessage);
        await expect(address_line_2.validate('P.O. Box 120')).resolves.toBe('P.O. Box 120');
    });

    it('validates address_line_2 correctly with svg flag', async () => {
        const { address_line_2 } = getAddressDetailValidationSchema(true).fields;

        await expect(address_line_2.validate('P.O. Box 122')).rejects.toThrow('P.O. Box is not accepted in address');
    });

    it('validates address_postcode correctly with country id', async () => {
        const { address_postcode } = getAddressDetailValidationSchema(false).fields;
        await expect(address_postcode.validate('12345')).resolves.toBe('12345');
        await expect(address_postcode.validate('$%&')).rejects.toThrow(
            'Only letters, numbers, space and hyphen are allowed.'
        );
        await expect(address_postcode.validate('a'.repeat(21))).rejects.toThrow(
            'Please enter a postal/ZIP code under 20 characters.'
        );
        await expect(address_postcode.validate('JE1 1AA')).resolves.toBe('JE1 1AA');
    });

    it('validates address_state correctly', async () => {
        const { address_state } = getAddressDetailValidationSchema(false).fields;

        await expect(address_state.validate('NY')).resolves.toBe('NY');
        await expect(address_state.validate('a'.repeat(102))).rejects.toThrow('State is not in a proper format');

        await expect(address_state.validate('%_ASD')).rejects.toThrow('State is not in a proper format');
    });

    it('validates address_city correctly', async () => {
        const { address_city } = getAddressDetailValidationSchema(false).fields;

        await expect(address_city.validate('New York')).resolves.toBe('New York');
        await expect(address_city.validate('')).rejects.toThrow('City is required');
        await expect(address_city.validate('a'.repeat(102))).rejects.toThrow('Only 99 characters, please.');
        await expect(address_city.validate('%_ASD')).rejects.toThrow(
            'Only letters, periods, hyphens, apostrophes, and spaces, please.'
        );
    });
});
