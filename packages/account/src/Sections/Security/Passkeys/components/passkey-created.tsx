import { Localize } from '@deriv/translations';
import { DerivLightIcSuccessPasskeyIcon } from '@deriv/quill-icons';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

export const PasskeyCreated = ({ onPrimaryButtonClick, onSecondaryButtonClick }: TPasskeysButtonOnClicks) => (
    <div className='passkeys'>
        <PasskeysStatusLayout
            description={
                <Localize
                    i18n_default_text='Your account is now secured with a passkey.<0/>Manage your passkey through your<0/>Deriv account settings.'
                    components={[<br key={0} />]}
                />
            }
            icon={<DerivLightIcSuccessPasskeyIcon height='96px' width='96px' />}
            title={<Localize i18n_default_text='Success!' />}
            onPrimaryButtonClick={onPrimaryButtonClick}
            onSecondaryButtonClick={onSecondaryButtonClick}
            primary_button_text={<Localize i18n_default_text='Continue trading' />}
            secondary_button_text={<Localize i18n_default_text='Add more passkeys' />}
        />
    </div>
);
