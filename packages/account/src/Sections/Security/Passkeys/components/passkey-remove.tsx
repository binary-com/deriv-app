import { Icon } from '@deriv/components';
import { Localize } from '@deriv-com/translations';
import { DerivLightIcVerifyPasskeyIcon } from '@deriv/quill-icons';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

export const PasskeyRemove = ({
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
                    <Localize i18n_default_text='To keep your account safe, we need to verify your identity before removing this passkey.' />
                }
                icon={<DerivLightIcVerifyPasskeyIcon height='96px' width='96px' className='passkey-status__icon' />}
                title={<Localize i18n_default_text='Security verification' />}
                onPrimaryButtonClick={onPrimaryButtonClick}
                onSecondaryButtonClick={onSecondaryButtonClick}
                primary_button_text={<Localize i18n_default_text='Verify with passkey' />}
                secondary_button_text={<Localize i18n_default_text='Verify with email' />}
            />
        </div>
    );
};
