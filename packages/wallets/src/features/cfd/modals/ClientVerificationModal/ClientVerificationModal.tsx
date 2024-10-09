import React from 'react';
import { DerivLightUploadPoiIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components';
import { getMarketTypeDetails, MARKET_TYPE } from '../../constants';
import { TModifiedMT5Accounts } from '../../types';
import { DocumentsList } from './components';
import './ClientVerificationModal.scss';

type TClientVerificationModal = {
    account: TModifiedMT5Accounts;
};

const ClientVerificationModal: React.FC<TClientVerificationModal> = ({ account }) => {
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    const { title } = getMarketTypeDetails(localize, account.product)[account.market_type || MARKET_TYPE.ALL];

    return (
        <ModalStepWrapper title={account.is_added ? localize('Verify account') : localize('Create account')}>
            <div className='wallets-client-verification-modal'>
                <DerivLightUploadPoiIcon height={128} width={128} />
                <Text
                    align='center'
                    className='wallets-client-verification-modal__description'
                    size={isMobile ? 'md' : 'sm'}
                >
                    {account.is_added ? (
                        <Localize i18n_default_text='Your account needs verification.' />
                    ) : (
                        <Localize
                            i18n_default_text={
                                'Once your account details are complete, your MT5 {{accountName}} account will be ready for you.'
                            }
                            values={{ accountName: title }}
                        />
                    )}
                </Text>
                <DocumentsList account={account} />
            </div>
        </ModalStepWrapper>
    );
};

export default ClientVerificationModal;
