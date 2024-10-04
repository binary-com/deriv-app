import { localize } from '@deriv-com/translations';
import { GetSettings, ResidenceList } from '@deriv/api-types';
import { TSchema, getDefaultFields } from '@deriv/shared';

type TEmploymentTaxInfoConfigProps = {
    account_settings: GetSettings;
    residence_list: ResidenceList;
};

const generateEmploymentTaxInfoFormValues = ({
    account_settings,
    residence_list,
}: TEmploymentTaxInfoConfigProps): TSchema => ({
    employment_status: {
        supported_in: ['svg', 'maltainvest'],
        default_value: account_settings.employment_status ?? '',
    },
    tax_residence: {
        supported_in: ['svg', 'maltainvest'],
        default_value:
            (account_settings?.tax_residence
                ? residence_list.find(item => item.value === account_settings?.tax_residence)?.text
                : account_settings?.residence) || '',
    },
    tax_identification_number: {
        supported_in: ['svg', 'maltainvest'],
        default_value: account_settings.tax_identification_number ?? '',
    },
    tax_identification_confirm: {
        default_value: false,
        supported_in: ['svg', 'maltainvest'],
    },
    tin_skipped: {
        default_value: 0,
        supported_in: ['svg', 'maltainvest'],
    },
});

const getEmploymentTaxIfoConfig = (
    {
        account_settings,
        residence_list,
        real_account_signup_target,
    }: TEmploymentTaxInfoConfigProps & { real_account_signup_target: string },
    component: React.Component
) => {
    const config = generateEmploymentTaxInfoFormValues({ account_settings, residence_list });
    return {
        header: {
            active_title: localize('Complete your employment and tax information details'),
            title: localize('Employment and tax information'),
        },
        body: component,
        form_value: getDefaultFields(real_account_signup_target, config),
        props: {
            disabled_items: account_settings?.immutable_fields,
            real_account_signup_target,
        },
        passthrough: ['residence_list'],
    };
};

export default getEmploymentTaxIfoConfig;
