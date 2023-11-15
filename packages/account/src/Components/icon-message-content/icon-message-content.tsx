import React from 'react';
import classNames from 'classnames';
import { Div100vhContainer, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';

type TIconMessageContent = {
    className?: string;
    full_width?: boolean;
    icon: React.ReactElement;
    is_disabled_for_mobile?: boolean;
    message: React.ReactNode;
    text?: string | React.ReactElement;
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
    const { ui } = useStore();
    const { is_desktop } = ui;
    return (
        <Div100vhContainer
            className={classNames('account-management__message-wrapper', {
                'account-management__message-wrapper-full-width': full_width,
            })}
            is_disabled={is_desktop || is_disabled_for_mobile}
            height_offset='110px'
        >
            <div
                className={classNames('account-management__message-content', {
                    [`${className}__message-content`]: className,
                })}
            >
                {icon && (
                    <div
                        className={classNames('account-management__message-icon', {
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
                    size='s'
                    align='center'
                    className={classNames('account-management__message', {
                        [`${className}__message`]: className,
                    })}
                >
                    {message}
                </Text>
                {text && (
                    <div className='account-management__text-container'>
                        <Text
                            className={classNames({
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
