import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import ConnectedAppsInfoBullets from './connected-apps-info-bullets';

const ConnectedAppsEmpty = () => {
    const { isDesktop } = useDevice();

    const text_size = isDesktop ? 'xs' : 'xxs';

    return (
        <div className='connected-apps__empty--wrapper'>
            <Text size={text_size} align='center' weight='bold'>
                <Localize i18n_default_text="You currently don't have any third-party authorised apps associated with your account." />
            </Text>
            <ConnectedAppsInfoBullets text_color='primary' class_name='connected-apps__bullets--without-apps' />
        </div>
    );
};

export default ConnectedAppsEmpty;
