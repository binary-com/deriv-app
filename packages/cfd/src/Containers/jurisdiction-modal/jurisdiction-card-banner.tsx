import React from 'react';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import { TVerificationStatusBannerProps } from '../props.types';
import { getAuthenticationStatusInfo } from '@deriv/shared';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const JurisdictionCardBanner = ({
    account_status,
    account_type,
    card_classname,
    disabled,
    is_virtual,
    type_of_card,
}: TVerificationStatusBannerProps) => {
    const {
        poi_not_submitted_for_vanuatu,
        poi_or_poa_not_submitted,
        poi_verified_for_vanuatu,
        poi_verified_for_bvi_labuan_maltainvest,
        poi_pending_for_bvi_labuan_maltainvest,
        poi_pending_for_vanuatu,
        poi_resubmit_for_vanuatu,
        poi_resubmit_for_bvi_labuan_maltainvest,
        poi_acknowledged_for_vanuatu,
        poi_acknowledged_for_bvi_labuan_maltainvest,
        no_onfido_left,
    } = getAuthenticationStatusInfo(account_status);

    const getAccountTitle = () => account_type && (account_type === 'synthetic' ? 'Synthetics' : 'Financial');

    const is_svg = type_of_card && type_of_card === 'svg';
    const is_vanuatu = type_of_card && type_of_card === 'vanuatu';
    const is_regulated_except_vanuatu = type_of_card && ['bvi', 'labuan', 'maltainvest'].includes(type_of_card);

    const getTypeTitle = () => {
        switch (type_of_card) {
            case 'bvi':
                return 'BVI';
            case 'vanuatu':
                return 'Vanuatu';
            case 'labuan':
                return 'STP';
            default:
                return '';
        }
    };

    const VerificationStatusBanner = () => {
        if (is_virtual && is_svg) {
            return (
                <div className={`${card_classname}__verification-status--not_submitted`}>
                    <Text as='p' size='xxxs' align='center' color='prominent'>
                        <Localize
                            i18n_default_text='Switch to your real account to create a DMT5 {{account_title}} {{type_title}} account.'
                            values={{
                                account_title: getAccountTitle(),
                                type_title: getTypeTitle(),
                            }}
                        />
                    </Text>
                </div>
            );
        } else if (disabled) {
            // account not added
            return (
                <div className={`${card_classname}__verification-status--account_added`}>
                    <Text size='xxs' weight='bold' color='colored-background'>
                        <Localize i18n_default_text='Account added' />
                    </Text>
                </div>
            );
        } else if (is_svg) {
            return (
                <div className={`${card_classname}__verification-status--hint`}>
                    <Text size={'xxxs'} align='center' color='less-prominent'>
                        <Localize i18n_default_text='You will need to submit proof of identity and address once you reach certain thresholds' />
                    </Text>
                </div>
            );
        } else if (poi_or_poa_not_submitted) {
            // if poi or poa is not submitted
            return (
                <div className={`${card_classname}__verification-status--not_submitted`}>
                    <Text as='p' size='xxs' align='center' color='prominent'>
                        <Localize i18n_default_text='Proof of identity and address are required' />
                    </Text>
                </div>
            );
        } else if (
            (is_vanuatu && poi_verified_for_vanuatu) ||
            (is_regulated_except_vanuatu && poi_verified_for_bvi_labuan_maltainvest)
        ) {
            return (
                <div className={`${card_classname}__verification-status--poi_verified`}>
                    <Text as='p' size='xxs' align='center' color='colored-background'>
                        <Localize i18n_default_text='You are verified to add this account' />
                    </Text>
                </div>
            );
        } else if (is_vanuatu && poi_not_submitted_for_vanuatu) {
            return (
                <div className={`${card_classname}__verification-status--not_submitted`}>
                    <Text as='p' size='xxs' align='center' color='prominent'>
                        <Localize i18n_default_text='You will need to submit proof of identity' />
                    </Text>
                </div>
            );
        } else if (
            (is_vanuatu && poi_pending_for_vanuatu) ||
            (is_regulated_except_vanuatu && poi_pending_for_bvi_labuan_maltainvest)
        ) {
            return (
                <div className={`${card_classname}__verification-status--pending`}>
                    <Text size='xxs' color='prominent'>
                        <Localize i18n_default_text='Pending proof of identity review' />
                    </Text>
                </div>
            );
        }
        // else if (
        //     (is_vanuatu && !poi_acknowledged_for_vanuatu && no_onfido_left) ||
        //     (is_regulated_except_vanuatu && !poi_acknowledged_for_bvi_labuan_maltainvest && no_onfido_left)
        // ) {
        //     return (
        //         <div className={`${card_classname}__verification-status--failed`}>
        //             <Text size='xxs' color='colored-background'>
        //                 <Localize i18n_default_text='Please contact us via livechat' />
        //             </Text>
        //         </div>
        //     );
        // }
        else if (
            (is_vanuatu && poi_resubmit_for_vanuatu) ||
            (is_regulated_except_vanuatu && poi_resubmit_for_bvi_labuan_maltainvest)
        ) {
            return (
                <div className={`${card_classname}__verification-status--failed`}>
                    <Text size='xxs' color='colored-background'>
                        <Localize i18n_default_text='Resubmit proof of identity' />
                    </Text>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`${card_classname}__verification-status`}>
            <VerificationStatusBanner />
        </div>
    );
};

export default connect(({ client }: RootStore) => ({
    account_status: client.account_status,
    is_virtual: client.is_virtual,
}))(JurisdictionCardBanner);
