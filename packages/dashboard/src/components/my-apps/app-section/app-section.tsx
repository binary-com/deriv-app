import React from 'react';
import classNames from 'classnames';
import { Button, Text, Icon } from '@deriv/components';

const AppSection: React.FC<TAppSectionProps> = ({ children, title, virtual }) => {
    const [is_open, setIsOpen] = React.useState(true);

    const onClick = () => {
        setIsOpen(!is_open);
    };

    return (
        <React.Fragment>
            <div
                className={classNames('dw-app-section-header', {
                    'dw-app-section-header--active': is_open,
                })}
            >
                <Icon icon='IcChevronDownBold' className='dw-app-section-header__chevron-icon' onClick={onClick} />
                <Text size='m' weight='bold' line_height='xs'>
                    {title}
                </Text>
                {!virtual && (
                    <Button className='dw-app-section-header__add'>
                        <Icon icon='IcAddRounded' custom_color='var(--brand-red-coral)' size={24} />
                    </Button>
                )}
            </div>
            {is_open && <div className='dw-app-section-container'>{children}</div>}
        </React.Fragment>
    );
};

type TAppSectionProps = {
    title: string;
    virtual: boolean;
};
export default AppSection;
