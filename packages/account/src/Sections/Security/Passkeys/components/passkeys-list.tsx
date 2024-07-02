import { Localize } from '@deriv/translations';
import { TOnPasskeyMenuClick, TPasskey } from '../passkeys';
import { PasskeyCard } from './passkey-card';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

type TPasskeysList = {
    passkeys_list: TPasskey[];
    onPasskeyMenuClick: TOnPasskeyMenuClick;
} & TPasskeysButtonOnClicks;

export const PasskeysList = ({
    passkeys_list,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    onPasskeyMenuClick,
}: TPasskeysList) => (
    <div className='passkeys'>
        <PasskeysStatusLayout
            className='passkeys-list__wrapper'
            onPrimaryButtonClick={onPrimaryButtonClick}
            onSecondaryButtonClick={onSecondaryButtonClick}
            primary_button_text={<Localize i18n_default_text='Create passkey' />}
            scroll_offset='16rem'
            secondary_button_text={<Localize i18n_default_text='Learn more' />}
        >
            {passkeys_list.map(passkey => (
                <PasskeyCard {...passkey} key={passkey.passkey_id} onPasskeyMenuClick={onPasskeyMenuClick} />
            ))}
        </PasskeysStatusLayout>
    </div>
);
