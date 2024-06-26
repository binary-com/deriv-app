import clsx from 'clsx';
import { Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { CONNECTED_APPS_INFO_BULLETS } from '../../../Constants/connected-apps-config';

type TConnectedAppsInfoBulletsProps = {
    class_name: string;
    text_color?: string;
};

const ConnectedAppsInfoBullets = ({ class_name, text_color }: TConnectedAppsInfoBulletsProps) => {
    const { isDesktop } = useDevice();

    const text_size = isDesktop ? 'xxs' : 'xxxs';

    return (
        <Text as='ol' size={text_size} color={text_color} className={clsx('connected-apps__bullets--list', class_name)}>
            {CONNECTED_APPS_INFO_BULLETS.map(bullet => (
                <li key={bullet.key}>{bullet.text}</li>
            ))}
        </Text>
    );
};

export default ConnectedAppsInfoBullets;
