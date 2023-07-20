import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { Jurisdiction } from '@deriv/shared';
import { jurisdictionVerificationContents } from '../../Constants/jurisdiction-contents/jurisdiction-verification-contents';
import { TJurisdictionTitleIndicatorProps } from 'Containers/props.types';
import { TJurisdictionCardItemVerificationItem, TJurisdictionCardVerificationStatus } from 'Components/props.types';
import { useAuthenticationStatusInfo } from '@deriv/hooks';

const JurisdictionTitleIndicator = ({
    title_indicators,
    type_of_card,
    verification_docs,
}: TJurisdictionTitleIndicatorProps) => {
    const { poi, poa } = useAuthenticationStatusInfo();

    const getVerificationIconVariant = (verification_document: TJurisdictionCardItemVerificationItem): string => {
        let icon_variant: TJurisdictionCardVerificationStatus = 'Default';
        if ([Jurisdiction.BVI, Jurisdiction.LABUAN, Jurisdiction.VANUATU].includes(type_of_card)) {
            if (['document_number', 'selfie', 'identity_document'].includes(verification_document)) {
                if (poi.bvi_labuan_vanuatu.pending) {
                    icon_variant = 'Pending';
                } else if (poi.bvi_labuan_vanuatu.need_resubmission) {
                    icon_variant = 'Failed';
                } else if (poi.bvi_labuan_vanuatu.verified) {
                    icon_variant = 'Verified';
                }
            }
        } else if (Jurisdiction.MALTA_INVEST === type_of_card) {
            if (['document_number', 'selfie', 'identity_document'].includes(verification_document)) {
                if (poi.maltainvest.pending) {
                    icon_variant = 'Pending';
                } else if (poi.maltainvest.need_resubmission) {
                    icon_variant = 'Failed';
                } else if (poi.maltainvest.verified) {
                    icon_variant = 'Verified';
                }
            }
        }
        if (verification_document === 'name_and_address') {
            if (poa.pending) {
                icon_variant = 'Pending';
            } else if (poa.need_resubmission) {
                icon_variant = 'Failed';
            } else if (poa.verified) {
                icon_variant = 'Verified';
            }
        }
        return icon_variant;
    };

    return title_indicators.type === 'displayText' ? (
        <Text
            as='span'
            color='colored-background'
            weight='bold'
            align='center'
            size='xxxs'
            className={classNames(
                'cfd-card-section-title-indicator',
                `cfd-card-section-title-indicator__${title_indicators.display_text_skin_color}`
            )}
        >
            {title_indicators.display_text}
        </Text>
    ) : (
        <div
            data-testid='dt_jurisdiction_title_indicator_icon'
            className='cfd-card-section-title-indicator-icon-container'
        >
            {verification_docs?.map(verification_document => (
                <div
                    data-testid={`dt_jurisdiction_title_indicator_${getVerificationIconVariant(
                        verification_document
                    )}_icon`}
                    key={verification_document}
                >
                    <Icon
                        size={24}
                        icon={jurisdictionVerificationContents().required_verification_docs[
                            verification_document
                        ]?.icon.concat(getVerificationIconVariant(verification_document))}
                    />
                </div>
            ))}
        </div>
    );
};

export default JurisdictionTitleIndicator;
