import React from 'react';
import clsx from 'clsx';
import { Div100vhContainer, Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';

type TIconMessageContent = {
    className?: string;
    full_width?: boolean;
    icon: React.ReactElement;
    is_disabled_for_mobile?: boolean;
    message: React.ReactNode;
    text?: React.ReactNode;
};

const IconMessageContent = ({
    children,
    className,
    full_width,
    icon,
    is_disabled_for_mobile = false,
    message,
    text,
}: React.PropsWithChildren<TIconMessageContent>) => {
    const { isDesktop } = useDevice();

    return (
        <Div100vhContainer
            className={clsx('account-management__message-wrapper', {
                'account-management__message-wrapper-full-width': full_width,
            })}
            is_disabled={isDesktop || is_disabled_for_mobile}
            height_offset='110px'
        >
            <div
                className={clsx('account-management__message-content', {
                    [`${className}__message-content`]: className,
                })}
            >
                {icon && (
                    <div
                        className={clsx('account-management__message-icon', {
                            [`${className}__message-icon`]: className,
                        })}
                    >
                        {icon}
                    </div>
                )}
                <Text
                    as='div'
                    color='general'
                    weight='bold'
                    align='center'
                    className={clsx('account-management__message', {
                        [`${className}__message`]: className,
                    })}
                >
                    {message}
                </Text>
                {text && (
                    <div className='account-management__text-container'>
                        <Text
                            className={clsx({
                                [`${className}__text`]: className,
                            })}
                            as='p'
                            size='xs'
                            align='center'
                        >
                            {text}
                        </Text>
                    </div>
                )}
                {children}
            </div>
        </Div100vhContainer>
    );
};

export default IconMessageContent;
