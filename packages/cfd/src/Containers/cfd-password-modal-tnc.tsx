import React from 'react';
import { getCFDPlatformLabel, CFD_PRODUCTS_TITLE, CFD_PLATFORMS } from '@deriv/shared';
import { observer } from '@deriv/stores';
import CfdPasswordModalInfo from './cfd-password-modal-info';
import JurisdictionCheckBox from './jurisdiction-checkbox';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import classNames from 'classnames';

type CfdPasswordModalTncProps = {
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
    checked: boolean;
    need_tnc: boolean;
    onCheck: () => void;
    className?: string;
};

const CfdPasswordModalTnc = observer(
    ({ platform, checked, onCheck, className, need_tnc }: CfdPasswordModalTncProps) => {
        const { jurisdiction_selected_shortcode, account_title } = useCfdStore();
        return (
            <div className={classNames('cfd-password-modal-tnc', className)}>
                <CfdPasswordModalInfo
                    jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                    platform={getCFDPlatformLabel(platform)}
                    product={account_title}
                    need_tnc={need_tnc}
                />
                {need_tnc && (
                    <JurisdictionCheckBox
                        is_checked={checked}
                        onCheck={onCheck}
                        class_name='cfd-password-modal__checkbox'
                        jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                    />
                )}
            </div>
        );
    }
);

export default CfdPasswordModalTnc;
