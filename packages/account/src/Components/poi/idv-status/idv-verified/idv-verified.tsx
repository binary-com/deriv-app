import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { Localize } from '@deriv/translations';
import { ContinueTradingButton } from '../../../poa/continue-trading-button/continue-trading-button';
import { DerivLightApprovedPoiIcon } from '@deriv/quill-icons';
import PoaButton from '../../../poa/poa-button/poa-button';

type TIdvVerified = {
    needs_poa: boolean;
    is_from_external: boolean;
    redirect_button: React.ReactNode;
};

const IdvVerified = ({ needs_poa, is_from_external, redirect_button }: Partial<TIdvVerified>) => {
    const header_Text = needs_poa ? (
        <Localize i18n_default_text='Your ID is verified. You will also need to submit proof of your address.' />
    ) : (
        <Localize i18n_default_text='ID verification passed' />
    );
    const { isDesktop } = useDevice();
    return (
        <div
            className={clsx('proof-of-identity__container', 'proof-of-identity__container--status')}
            data-testid='poi_idv_verified_container'
        >
            <DerivLightApprovedPoiIcon className='icon' />
            <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                {header_Text}
            </Text>
            {needs_poa ? (
                <React.Fragment>
                    {isDesktop && (
                        <Text className='text' size='xs' align='center'>
                            <Localize i18n_default_text="Next, we'll need your proof of address." />
                        </Text>
                    )}
                    {!is_from_external && (
                        <PoaButton custom_text={<Localize i18n_default_text='Submit proof of address' />} />
                    )}
                </React.Fragment>
            ) : (
                redirect_button || <ContinueTradingButton className='continue-trade' />
            )}
        </div>
    );
};

export default IdvVerified;
