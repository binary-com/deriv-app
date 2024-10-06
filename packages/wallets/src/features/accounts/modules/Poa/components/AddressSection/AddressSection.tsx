import React from 'react';
import { useFormikContext } from 'formik';
import { Localize, useTranslations } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { FormDropdown, FormField } from '../../../../../../components';
import { TAddressDetails, TAddressSectionProps } from '../../types';
import './AddressSection.scss';

const AddressSection: React.FC<TAddressSectionProps> = ({ hasError }) => {
    const { localize } = useTranslations();
    const { status } = useFormikContext<TAddressDetails>();
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-address-section'>
            {isDesktop && (
                <div className='wallets-address-section__title'>
                    <Text weight='bold'>
                        <Localize i18n_default_text='Address' />
                    </Text>
                    <div className='wallets-address-section__title__divider' />
                </div>
            )}
            {!hasError && (
                <div className='wallets-address-section__inline'>
                    <InlineMessage variant='warning'>
                        <div className='wallets-address-section__inline-message'>
                            <Localize i18n_default_text='Use the same address that appears on your proof of address (utility bill, bank statement, etc.).' />
                        </div>
                    </InlineMessage>
                </div>
            )}
            <div className='wallets-address-section__input'>
                <FormField label={localize('First line of address*')} name='firstLine' />
                <FormField label={localize('Second line of address (optional)')} name='secondLine' />
                <FormField label={localize('Town/City*')} name='townCityLine' />
                <FormDropdown
                    isFullWidth
                    label={localize('State/Province')}
                    list={status.statesList}
                    listHeight='sm'
                    name='stateProvinceLine'
                />
                <FormField label={localize('Postal/ZIP code')} name='zipCodeLine' />
            </div>
        </div>
    );
};

export default AddressSection;
