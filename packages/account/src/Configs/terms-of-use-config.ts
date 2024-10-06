import React from 'react';
import { getDefaultFields, isDesktop } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { GetSettings } from '@deriv/api-types';

type TTermsOfConfigSettings = GetSettings & { fatca_declaration?: number };

const getTermsOfUseConfig = (account_settings: TTermsOfConfigSettings) => ({
    agreed_tos: {
        supported_in: ['svg', 'maltainvest'],
        default_value: false,
    },
    tnc_acceptance: {
        supported_in: ['svg', 'maltainvest'],
        default_value: false,
    },
    resident_self_declaration: {
        supported_in: ['maltainvest'],
        default_value: false,
    },
    fatca_declaration: {
        supported_in: ['svg', 'maltainvest'],
        default_value: String(account_settings?.fatca_declaration ?? '0'),
    },
});

const termsOfUseConfig = (
    {
        real_account_signup_target,
        account_settings,
        residence,
    }: { real_account_signup_target: string; account_settings: TTermsOfConfigSettings; residence?: string },
    TermsOfUse: React.Component
) => {
    const active_title = localize('Terms of use');

    return {
        header: {
            active_title: isDesktop() ? active_title : null,
            title: active_title,
        },
        body: TermsOfUse,
        form_value: getDefaultFields(real_account_signup_target, getTermsOfUseConfig(account_settings)),
        props: {
            real_account_signup_target,
            is_multi_account: Boolean(String(account_settings?.fatca_declaration ?? '')),
            residence,
        },
        icon: 'IcDashboardTermsOfUse',
    };
};

export default termsOfUseConfig;
