import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import FormBody from '../../../../Components/form-body';

type TPasskeysStatus = {
    title: React.ReactElement;
    description?: React.ReactNode;
    icon: string;
    className?: string;
};

const PasskeysStatus = ({
    title,
    description,
    icon,
    children,
    className,
}: React.PropsWithChildren<TPasskeysStatus>) => {
    return (
        <React.Fragment>
            <FormBody scroll_offset='22rem' className={classNames('passkeys-status__wrapper', className)}>
                <Icon icon={icon} size={96} />
                <Text as='div' weight='bold' align='center' className='passkeys-status__title'>
                    {title}
                </Text>
                {description && (
                    <Text as='div' size='xs' align='center'>
                        {description}
                    </Text>
                )}
            </FormBody>
            {children}
        </React.Fragment>
    );
};

export default PasskeysStatus;
