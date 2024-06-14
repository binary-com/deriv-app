import clsx from 'clsx';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { CONNECTED_APPS_INFO_BULLETS } from '../../../Constants/connected-apps-config';

type TConnectedAppsInfoBulletsProps = {
    class_name: string;
    text_color?: string;
};

const ConnectedAppsInfoBullets = observer(({ class_name, text_color }: TConnectedAppsInfoBulletsProps) => {
    const { ui } = useStore();
    const { is_mobile_or_tablet } = ui;

    const text_size = is_mobile_or_tablet ? 'xxxs' : 'xxs';

    return (
        <Text as='ol' size={text_size} color={text_color} className={clsx('connected-apps__bullets--list', class_name)}>
            {CONNECTED_APPS_INFO_BULLETS.map(bullet => (
                <li key={bullet.key}>{bullet.text}</li>
            ))}
        </Text>
    );
});

export default ConnectedAppsInfoBullets;
