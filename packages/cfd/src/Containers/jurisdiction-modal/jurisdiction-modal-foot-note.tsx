import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { getAuthenticationStatusInfo, isMobileOrTablet, getMT5Title, CFD_PLATFORMS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TJurisdictionModalFootNoteProps } from '../props.types';
import { JURISDICTION } from '../../Helpers/cfd-config';

const FooterNote = ({
    account_status,
    account_type,
    card_classname,
    jurisdiction_selected_shortcode,
    should_restrict_bvi_account_creation,
    should_restrict_vanuatu_account_creation,
}: TJurisdictionModalFootNoteProps) => {
    const { common } = useStore();

    const { platform } = common;

    const account_type_name = getMT5Title(account_type);

    const { poa_pending } = getAuthenticationStatusInfo(account_status);

    if (platform === CFD_PLATFORMS.CTRADER && jurisdiction_selected_shortcode === 'svg') {
        return (
            <Localize i18n_default_text='Add your Deriv cTrader account under Deriv (SVG) LLC (company no. 273 LLC 2020).' />
        );
    }
    if (jurisdiction_selected_shortcode === JURISDICTION.SVG) {
        return (
            <Localize
                i18n_default_text='Add your Deriv MT5 <0>{{account_type_name}}</0> account under Deriv (SVG) LLC (company no. 273 LLC 2020).'
                values={{ account_type_name }}
            />
        );
    } else if (
        (jurisdiction_selected_shortcode === JURISDICTION.BVI && should_restrict_bvi_account_creation) ||
        (jurisdiction_selected_shortcode === JURISDICTION.VANUATU && should_restrict_vanuatu_account_creation)
    ) {
        return poa_pending ? (
            <Localize
                i18n_default_text='<0>You can open this account once your submitted documents have been verified.</0>'
                components={[<span key={0} className={`${card_classname}__footnote--pending`} />]}
            />
        ) : (
            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of address.' />
        );
    } else if (jurisdiction_selected_shortcode === JURISDICTION.BVI) {
        return (
            <Localize
                i18n_default_text='Add your Deriv MT5 <0>{{account_type_name}}</0>  account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114).'
                values={{ account_type_name }}
            />
        );
    } else if (jurisdiction_selected_shortcode === JURISDICTION.VANUATU) {
        return (
            <Localize
                i18n_default_text='Add Your Deriv MT5 <0>{{account_type_name}}</0>  account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.'
                values={{ account_type_name }}
            />
        );
    } else if (jurisdiction_selected_shortcode === JURISDICTION.LABUAN) {
        return (
            <Localize
                i18n_default_text='Add your Deriv MT5 <0>{{account_type_name}}</0>  STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (Licence no. MB/18/0024).'
                values={{ account_type_name }}
            />
        );
    } else if (jurisdiction_selected_shortcode === JURISDICTION.MALTA_INVEST) {
        return (
            <Localize i18n_default_text='Add your Deriv MT5 CFDs account under Deriv Investments (Europe) Limited, regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156).' />
        );
    }

    return null;
};

const JurisdictionModalFootNote = (props: TJurisdictionModalFootNoteProps) => {
    return (
        <React.Fragment>
            {props.jurisdiction_selected_shortcode && (
                <div data-testid='dt-jurisdiction-footnote' className={`${props.card_classname}__footnote`}>
                    <Text
                        as='p'
                        color='prominent'
                        align='center'
                        size={isMobileOrTablet() ? 'xxs' : 'xs'}
                        weight='bold'
                        line_height='xs'
                    >
                        <FooterNote {...props} />
                    </Text>
                </div>
            )}
        </React.Fragment>
    );
};

export default observer(JurisdictionModalFootNote);
