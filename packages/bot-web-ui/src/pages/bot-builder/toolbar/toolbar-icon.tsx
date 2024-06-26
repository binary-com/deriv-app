import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { popover_zindex } from 'Constants/z-indexes';

type TToolbarIcon = {
    popover_message: string;
    icon: string;
    icon_id: string;
    action: () => void;
    icon_color?: string;
    data_testid?: string;
};

const ToolbarIcon = ({ popover_message, icon, icon_id, icon_color, action, data_testid }: TToolbarIcon) => {
    const { ui } = useStore();
    const { is_desktop } = ui;

    const renderIcon = () => (
        <Icon
            icon={icon}
            id={icon_id}
            className='toolbar__icon'
            onClick={action}
            {...(icon_color && { color: icon_color })}
            data_testid={data_testid}
        />
    );

    return is_desktop ? (
        <Popover
            alignment='bottom'
            message={popover_message}
            zIndex={String(popover_zindex.TOOLBAR)}
            should_disable_pointer_events
        >
            {renderIcon()}
        </Popover>
    ) : (
        renderIcon()
    );
};

export default ToolbarIcon;
