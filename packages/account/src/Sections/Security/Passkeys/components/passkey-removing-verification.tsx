import { Localize } from '@deriv/translations';
// import { mobileOSDetect } from '@deriv/shared';
import { DerivLightIcVerifyPasskeyIcon } from '@deriv/quill-icons';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

export const PasskeyRemovingVerification = ({ onPrimaryButtonClick }: TPasskeysButtonOnClicks) => {
    // TODO: edit the description considering OS
    return (
        <div className='passkeys'>
            <PasskeysStatusLayout
                description={
                    <Localize i18n_default_text="We'll send you a secure link to verify your request. Tap on it to confirm you want to remove the passkey. This protects your account from unauthorised requests." />
                }
                icon={<DerivLightIcVerifyPasskeyIcon height='96px' width='96px' />}
                title={<Localize i18n_default_text='Verify your request' />}
                onPrimaryButtonClick={onPrimaryButtonClick}
                primary_button_text={<Localize i18n_default_text='Send email (back to list)' />}
            />
        </div>
    );
};
