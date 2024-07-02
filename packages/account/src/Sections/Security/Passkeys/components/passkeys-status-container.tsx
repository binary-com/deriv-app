import { observer } from '@deriv/stores';
import { NoPasskeys } from './no-passkeys';
import { TCurrentManagedPasskey, TOnPasskeyMenuClick, TPasskey } from '../passkeys';
import { PasskeyCreated } from './passkey-created';
import { PASSKEY_STATUS_CODES, TPasskeysStatus } from '../passkeys-configs';
import { PasskeysLearnMore } from './passkeys-learn-more';
import { PasskeysList } from './passkeys-list';
import { PasskeyRename } from './passkey-rename';
import { TPasskeysButtonOnClicks } from './passkeys-status-layout';
import { PasskeyRemoved } from 'Sections/Security/Passkeys/components/passkey-removed';
import { PasskeyRemovingVerification } from 'Sections/Security/Passkeys/components/passkey-removing-verification';

type TPasskeysStatusContainer = {
    current_managed_passkey: TCurrentManagedPasskey;
    passkey_status: TPasskeysStatus;
    passkeys_list: TPasskey[];
    onPasskeyMenuClick: TOnPasskeyMenuClick;
} & TPasskeysButtonOnClicks;

export const PasskeysStatusContainer = observer(
    ({
        current_managed_passkey,
        onPrimaryButtonClick,
        onSecondaryButtonClick,
        passkeys_list,
        passkey_status,
        onPasskeyMenuClick,
    }: TPasskeysStatusContainer) => {
        switch (passkey_status) {
            case PASSKEY_STATUS_CODES.CREATED:
                return (
                    <PasskeyCreated
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                    />
                );
            case PASSKEY_STATUS_CODES.LEARN_MORE:
                return (
                    <PasskeysLearnMore
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                    />
                );
            case PASSKEY_STATUS_CODES.NO_PASSKEY:
                return (
                    <NoPasskeys
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                    />
                );
            case PASSKEY_STATUS_CODES.RENAMING:
                return (
                    <PasskeyRename
                        current_managed_passkey={current_managed_passkey}
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                    />
                );
            case PASSKEY_STATUS_CODES.REMOVED:
                return <PasskeyRemoved onPrimaryButtonClick={onPrimaryButtonClick} />;
            case PASSKEY_STATUS_CODES.VERIFYING:
                return <PasskeyRemovingVerification onPrimaryButtonClick={onPrimaryButtonClick} />;

            default:
                return (
                    <PasskeysList
                        onPasskeyMenuClick={onPasskeyMenuClick}
                        passkeys_list={passkeys_list || []}
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                    />
                );
        }
    }
);
