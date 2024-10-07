import { EMPLOYMENT_VALUES } from '../constants';
import { TEmploymentStatus } from '../types';
import { TInitPreBuildDVRs, TOptions, getPreBuildDVRs } from './declarative-validation-rules';
import fromEntries from 'object.fromentries';

type TConfig = {
    default_value: string | boolean | number;
    supported_in: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rules?: Array<(TOptions | any)[]>;
    values?: Record<string, string | boolean>;
};
export type TSchema = { [key: string]: TConfig };

/**
 * Prepare default field and names for form.
 * @param {string} landing_company
 * @param {object} schema
 */
export const getDefaultFields = (landing_company: string, schema: TSchema | Record<string, never>) => {
    const output: { [key: string]: string | number | boolean } = {};
    Object.entries(filterByLandingCompany(landing_company, schema)).forEach(([field_name, opts]) => {
        output[field_name] = opts.default_value;
    });
    return output;
};

export const filterByLandingCompany = (landing_company: string, schema: TSchema | Record<string, never>) =>
    fromEntries(Object.entries(schema).filter(([, opts]) => opts.supported_in.includes(landing_company)));

/**
 * Generate validation function for the landing_company
 * @param landing_company
 * @param schema
 * @return {function(*=): {}}
 */
export const generateValidationFunction = (landing_company: string, schema: TSchema) => {
    const rules_schema = landing_company ? filterByLandingCompany(landing_company, schema) : schema;
    const rules: { [key: string]: TConfig['rules'] } = {};
    Object.entries(rules_schema).forEach(([key, opts]) => {
        rules[key] = opts.rules;
    });

    return (values: { [key: string]: string }) => {
        const errors: { [key: string]: string | string[] } = {};

        Object.entries(values).forEach(([field_name, value]) => {
            if (field_name in rules) {
                rules[field_name]?.some(([rule, message, options]) => {
                    if (
                        checkForErrors({
                            field_name,
                            value,
                            rule,
                            options,
                            values,
                        })
                    ) {
                        errors[field_name] = typeof message === 'string' ? ['error', message] : message;
                        return true;
                    }

                    return false;
                });
            }
        });

        return errors;
    };
};

type TCheckForErrors = {
    field_name: string;
    value: string;
    rule: string;
    options: TOptions;
    values: Record<string, string | boolean>;
};
/**
 * Returns true if the rule has error, false otherwise.
 * @param value
 * @param rule
 * @param options
 * @return {boolean}
 */
const checkForErrors = ({ value, rule, options, values }: TCheckForErrors) => {
    const validate = getValidationFunction(rule);
    return !validate(value, options, values);
};

/**
 * Get validation function from rules array
 * @param rule
 * @throws Error when validation rule not found
 * @return {function(*=): *}
 */
export const getValidationFunction = (rule: string) => {
    const func = getPreBuildDVRs()[rule as keyof TInitPreBuildDVRs]?.func ?? rule;
    if (typeof func !== 'function') {
        throw new Error(
            `validation rule ${rule} not found. Available validations are: ${JSON.stringify(
                Object.keys(getPreBuildDVRs())
            )}`
        );
    }
    /**
     * Generated validation function from the DVRs.
     */
    return (value: string, options: TOptions, values: Record<string, string | boolean>) =>
        !!func(value, options, values);
};

// Adding string as type because, employment_status can come from Personal details or Financial assessment.
export const shouldHideOccupationField = (employment_status?: TEmploymentStatus | string) =>
    EMPLOYMENT_VALUES.UNEMPLOYED === employment_status;
