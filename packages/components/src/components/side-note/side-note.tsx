import React from 'react';
import { isMobileOrTablet } from '@deriv/shared';
import Icon from '../icon/icon';
import Text from '../text';
import './side-note.scss';

const type_icon_mapper = {
    warning: 'IcAlertWarning',
    information: 'IcAlertInfo',
    announcement: 'IcAlertAnnounce',
    error: 'IcAlertDanger',
};

type TProps = {
    type?: keyof typeof type_icon_mapper;
    action?: { onClick: VoidFunction; label: React.ReactNode };
} & RequireAtLeastOne<{ title: React.ReactNode; description: React.ReactNode; children: React.ReactNode }>;

const SideNote: React.FC<React.PropsWithChildren<TProps>> = ({ title, description, type, action, children }) => {
    const title_font_size = isMobileOrTablet() ? 'xxs' : 'xs';
    const content_font_size = isMobileOrTablet() ? 'xxxs' : 'xxs';

    return (
        <div className='side-note'>
            <div className='side-note__content'>
                {(title || type) && (
                    <div className='side-note__header'>
                        <Text weight='bold' size={title_font_size}>
                            {title}
                        </Text>
                        {type && <Icon icon={type_icon_mapper[type]} />}
                    </div>
                )}
                {(description || children) && (
                    <Text size={content_font_size}>
                        {description && <span>{description}</span>}
                        {children}
                    </Text>
                )}
            </div>
            {action && (
                <div className='side-note__action' onClick={action?.onClick}>
                    <Text size={content_font_size} color='red'>
                        {action?.label}
                    </Text>
                    <Icon icon='IcChevronRight' color='red' size={16} />
                </div>
            )}
        </div>
    );
};

export default SideNote;
