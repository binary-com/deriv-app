import { Localize } from '@deriv/translations';
// import { mobileOSDetect } from '@deriv/shared';
import { DerivLightIcSuccessPasskeyIcon } from '@deriv/quill-icons';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

export const PasskeyRemoved = ({ onPrimaryButtonClick }: TPasskeysButtonOnClicks) => {
    // TODO: edit the description considering OS
    return (
        <div className='passkeys'>
            <PasskeysStatusLayout
                description={
                    <Localize i18n_default_text='Your passkey is successfully removed. To avoid sign-in prompts, also remove the passkey from your password manager.' />
                }
                icon={<DerivLightIcSuccessPasskeyIcon height='96px' width='96px' />}
                title={<Localize i18n_default_text='Passkey successfully removed' />}
                onPrimaryButtonClick={onPrimaryButtonClick}
                primary_button_text={<Localize i18n_default_text='Continue' />}
            />
        </div>
    );
};
