import { Fragment } from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { DerivLightIcInfoPasskeyIcon } from '@deriv/quill-icons';
import { DescriptionContainer } from './description-container';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';
import { TipsBlock } from './tips-block';

export const PasskeysLearnMore = ({ onPrimaryButtonClick, onSecondaryButtonClick }: TPasskeysButtonOnClicks) => (
    <div className='passkeys'>
        <Icon
            data_testid='dt_learn_more_back_button'
            icon='IcBackButton'
            onClick={onSecondaryButtonClick}
            className='passkeys-status__description-back-button'
        />
        <PasskeysStatusLayout
            className='passkeys-status__wrapper--expanded'
            description={
                <Fragment>
                    <DescriptionContainer />
                    <TipsBlock />
                </Fragment>
            }
            icon={<DerivLightIcInfoPasskeyIcon height='96px' width='96px' className='passkey-status__icon' />}
            title={<Localize i18n_default_text='Effortless login with passkeys' />}
            onPrimaryButtonClick={onPrimaryButtonClick}
            onSecondaryButtonClick={onSecondaryButtonClick}
            primary_button_text={<Localize i18n_default_text='Create passkey' />}
        />
    </div>
);
