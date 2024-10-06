import React from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Checkbox, InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { WalletLink } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import { THooks, TPlatforms } from '../../../../types';
import { companyNamesAndUrls, getMarketTypeDetails, PlatformDetails } from '../../constants';
import './CFDPasswordModalTnc.scss';

export type TCFDPasswordModalTncProps = {
    checked: boolean;
    onChange: () => void;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
};

const CFDPasswordModalTnc = ({ checked, onChange, platform, product }: TCFDPasswordModalTncProps) => {
    const { isDesktop } = useDevice();
    const { getModalState } = useModal();
    const { localize } = useTranslations();
    const selectedJurisdiction = getModalState('selectedJurisdiction');
    const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];
    const platformTitle = PlatformDetails[platform].title;
    const productTitle = getMarketTypeDetails(localize, product).all.title;

    return (
        <div className='wallets-cfd-modal-tnc'>
            <InlineMessage iconPosition='top' variant='info'>
                <Text align='start' data-testid='dt_wallets_tnc_inline_message' size={isDesktop ? '2xs' : 'xs'}>
                    <Localize
                        i18n_default_text='You are adding your {{platformTitle}} {{productTitle}} account under {{company}}, regulated by the British Virgin Islands Financial Services Commission (licence no. SIBA/L/18/1114).'
                        values={{ company: selectedCompany.name, platformTitle, productTitle }}
                    />
                </Text>
            </InlineMessage>
            <Checkbox
                checked={checked}
                data-testid='dt_wallets_tnc_checkbox'
                label={
                    <Text size={isDesktop ? 'xs' : 'sm'}>
                        <Localize
                            components={[<WalletLink key={0} staticUrl={selectedCompany.tncUrl} variant='bold' />]}
                            i18n_default_text='I confirm and accept {{company}}’s <0>terms and conditions</0>'
                            values={{
                                company: selectedCompany.name,
                            }}
                        />
                    </Text>
                }
                name='zerospread-checkbox'
                onChange={onChange}
            />
        </div>
    );
};

export default CFDPasswordModalTnc;
