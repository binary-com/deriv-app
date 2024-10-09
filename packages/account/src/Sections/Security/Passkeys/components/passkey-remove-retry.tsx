import { Icon } from '@deriv/components';
import { Localize } from '@deriv-com/translations';
import { DerivLightIcVerifyPasskeyIcon } from '@deriv/quill-icons';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

export const PasskeyRemoveRetry = ({
    onBackButtonClick,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
}: TPasskeysButtonOnClicks) => {
    return (
        <div className='passkeys'>
            <Icon
                data_testid='dt_learn_more_back_button'
                icon='IcBackButton'
                onClick={onBackButtonClick}
                className='passkeys-status__description-back-button'
            />

            <PasskeysStatusLayout
                className='passkeys-status__wrapper'
                description={
                    <Localize i18n_default_text='Verification unsuccessful. Please try again or verify with email instead..' />
                }
                icon={<DerivLightIcVerifyPasskeyIcon height='96px' width='96px' className='passkey-status__icon' />}
                title={<Localize i18n_default_text='Verification failed' />}
                onPrimaryButtonClick={onPrimaryButtonClick}
                onSecondaryButtonClick={onSecondaryButtonClick}
                primary_button_text={<Localize i18n_default_text='Try again' />}
                secondary_button_text={<Localize i18n_default_text='Verify with email' />}
            />
        </div>
    );
};
