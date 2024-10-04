import { GetAccountStatus, GetSettings, ResidenceList } from '@deriv/api-types';
import { TSchema, getDefaultFields, toMoment } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TUpgradeInfo } from 'Types';

type TPersonalDetailsConfig = {
    upgrade_info?: TUpgradeInfo;
    real_account_signup_target: string;
    residence_list: ResidenceList;
    account_settings: GetSettings & {
        document_type: string;
        document_number: string;
    };
    residence: string;
    account_status: GetAccountStatus;
};

export const personal_details_config = ({
    residence_list,
    account_settings,
    real_account_signup_target,
}: TPersonalDetailsConfig): TSchema => {
    if (!residence_list || !account_settings) {
        return {};
    }

    const config = {
        account_opening_reason: {
            supported_in: ['maltainvest'],
            default_value: account_settings.account_opening_reason ?? '',
        },
        salutation: {
            supported_in: ['maltainvest'],
            default_value: account_settings.salutation ?? '',
        },
        first_name: {
            supported_in: ['svg', 'maltainvest'],
            default_value: account_settings.first_name ?? '',
        },
        last_name: {
            supported_in: ['svg', 'maltainvest'],
            default_value: account_settings.last_name ?? '',
        },
        date_of_birth: {
            supported_in: ['svg', 'maltainvest'],
            default_value: account_settings.date_of_birth
                ? toMoment(account_settings.date_of_birth).format('YYYY-MM-DD')
                : '',
        },
        place_of_birth: {
            supported_in: ['maltainvest'],
            default_value:
                (account_settings.place_of_birth &&
                    residence_list.find(item => item.value === account_settings.place_of_birth)?.text) ||
                '',
        },
        citizen: {
            supported_in: ['maltainvest'],
            default_value:
                (account_settings.citizen &&
                    residence_list.find(item => item.value === account_settings.citizen)?.text) ||
                '',
        },
        phone: {
            supported_in: ['svg', 'maltainvest'],
            default_value: account_settings.phone ?? '',
        },
        document_type: {
            default_value: account_settings.document_type ?? {
                id: '',
                text: '',
                value: '',
                example_format: '',
            },
            supported_in: ['svg'],
        },
        document_number: {
            default_value: account_settings.document_number ?? '',
            supported_in: ['svg'],
        },
        confirmation_checkbox: {
            default_value: false,
            supported_in: ['svg'],
        },
    };

    if (real_account_signup_target !== 'maltainvest') {
        const properties_to_update: (keyof typeof config)[] = ['place_of_birth', 'account_opening_reason'];

        properties_to_update.forEach(key => {
            config[key].supported_in.push('svg');
        });
    }

    return config;
};

const personalDetailsConfig = <T>(
    {
        upgrade_info,
        real_account_signup_target,
        residence_list,
        account_settings,
        account_status,
        residence,
    }: TPersonalDetailsConfig,
    PersonalDetails: T
) => {
    const config = personal_details_config({
        residence_list,
        account_settings,
        real_account_signup_target,
        residence,
        account_status,
    });
    const disabled_items = account_settings.immutable_fields;
    return {
        header: {
            active_title: localize('Complete your personal details'),
            title: localize('Personal details'),
        },
        body: PersonalDetails,
        form_value: getDefaultFields(real_account_signup_target, config),
        props: {
            is_svg: upgrade_info?.can_upgrade_to === 'svg',
            account_opening_reason_list: [
                {
                    text: localize('Hedging'),
                    value: 'Hedging',
                },
                {
                    text: localize('Income Earning'),
                    value: 'Income Earning',
                },
                {
                    text: localize('Speculative'),
                    value: 'Speculative',
                },
            ],
            salutation_list: [
                {
                    label: localize('Mr'),
                    value: 'Mr',
                },

                {
                    label: localize('Ms'),
                    value: 'Ms',
                },
            ],
            disabled_items,
            account_status,
            residence,
            account_settings,
            real_account_signup_target,
        },
        passthrough: ['residence_list', 'is_fully_authenticated', 'has_real_account'],
        icon: 'IcDashboardPersonalDetails',
    };
};

export default personalDetailsConfig;
