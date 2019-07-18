import React             from 'react';
import Icon              from 'Assets/icon.jsx';
import { ToggleDrawer }  from '../../Elements/Drawer';
import { Notifications } from '../../Elements/Notifications';
import 'Sass/app/_common/drawer/drawer.scss';

const ToggleNotificationsDrawer = () => (
    <ToggleDrawer
        alignment='right'
        icon={<Icon icon='IconBell' />}
        icon_class='notify-toggle'
    >
        <Notifications />
    </ToggleDrawer>
);

export { ToggleNotificationsDrawer };
