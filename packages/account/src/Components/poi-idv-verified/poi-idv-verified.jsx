import React from 'react';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import PoaButton from 'Components/poa-button';
import IdvDocumentVerified from '../../Assets/ic-idv-verified.svg';

const IdvVerified = ({ needs_poa, is_from_external }) => {
    const mobile_header_text = needs_poa
        ? localize('Your ID is verified. You will also need to submit proof of your address.')
        : localize('ID verification passed');

    return (
        <div className='proof-of-identity__container'>
            <IdvDocumentVerified className='icon' />
            <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                {isMobile() ? mobile_header_text : localize('Your document number has been verified')}
            </Text>
            {needs_poa && (
                <React.Fragment>
                    {!isMobile() && (
                        <Text className='text' size='xs' align='center'>
                            {localize("Next, we'll need your proof of address.")}
                        </Text>
                    )}
                    {!is_from_external && <PoaButton custom_text={localize('Submit proof address')} />}
                </React.Fragment>
            )}
        </div>
    );
};

export default IdvVerified;
