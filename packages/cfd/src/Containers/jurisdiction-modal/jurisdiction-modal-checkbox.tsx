import React from 'react';
import { Checkbox, StaticUrl, Text } from '@deriv/components';
import { DBVI_COMPANY_NAMES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { TJurisdictionCheckBoxProps } from '../props.types';
import { JURISDICTION } from '../../Helpers/cfd-config';

const JurisdictionCheckBox = observer(
    ({
        class_name,
        is_checked,
        jurisdiction_selected_shortcode,
        onCheck,
        should_restrict_bvi_account_creation,
        should_restrict_vanuatu_account_creation,
    }: TJurisdictionCheckBoxProps) => {
        const { ui } = useStore();
        const { is_mobile_or_tablet } = ui;

        const shouldShowCheckBox = () => {
            if (
                !jurisdiction_selected_shortcode ||
                jurisdiction_selected_shortcode === JURISDICTION.SVG ||
                (jurisdiction_selected_shortcode === JURISDICTION.BVI && should_restrict_bvi_account_creation) ||
                (jurisdiction_selected_shortcode === JURISDICTION.VANUATU && should_restrict_vanuatu_account_creation)
            ) {
                return false;
            }
            return true;
        };

        const getCheckboxLabel = () => (
            <Text as='p' align='center' size={is_mobile_or_tablet ? 'xxs' : 'xs'} line_height='xs'>
                <Localize
                    i18n_default_text="I confirm and accept {{company}} 's <0>Terms and Conditions</0>"
                    values={{ company: DBVI_COMPANY_NAMES[jurisdiction_selected_shortcode].name }}
                    components={[
                        <StaticUrl
                            key={0}
                            className='link--no-bold'
                            href={DBVI_COMPANY_NAMES[jurisdiction_selected_shortcode].tnc_url}
                            is_document
                        />,
                    ]}
                />
            </Text>
        );

        return (
            <React.Fragment>
                {shouldShowCheckBox() && (
                    <div className={class_name}>
                        <Checkbox
                            value={is_checked}
                            onChange={onCheck}
                            label={getCheckboxLabel()}
                            defaultChecked={!!is_checked}
                        />
                    </div>
                )}
            </React.Fragment>
        );
    }
);

export default JurisdictionCheckBox;
