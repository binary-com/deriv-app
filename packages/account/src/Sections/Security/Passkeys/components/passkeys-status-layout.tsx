import { Fragment, PropsWithChildren, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import { Button, Text } from '@deriv/components';
import FormBody from '../../../../Components/form-body';
import FormFooter from '../../../../Components/form-footer';

export type TPasskeysButtonOnClicks = {
    onPrimaryButtonClick?: (value?: string) => void;
    onSecondaryButtonClick?: () => void;
    onBackButtonClick?: () => void;
};

type TPasskeysStatusLayout = {
    className?: string;
    description?: ReactNode;
    icon?: ReactElement;
    primary_button_disabled?: boolean;
    primary_button_text?: ReactElement;
    primary_button_type?: 'button' | 'submit';
    scroll_offset?: string;
    secondary_button_text?: ReactElement;
    title?: ReactElement;
} & TPasskeysButtonOnClicks;

export const PasskeysStatusLayout = ({
    children,
    className,
    description,
    icon,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    primary_button_disabled = false,
    primary_button_text,
    primary_button_type = 'button',
    scroll_offset = '22rem',
    secondary_button_text,
    title,
}: PropsWithChildren<TPasskeysStatusLayout>) => {
    const is_footer_visible = primary_button_text || secondary_button_text;
    return (
        <Fragment>
            <FormBody scroll_offset={scroll_offset} className={clsx('passkeys-status__wrapper', className)}>
                {icon}
                {title && (
                    <Text as='div' weight='bold' align='center' className='passkeys-status__title'>
                        {title}
                    </Text>
                )}
                {description && (
                    <Text as='div' size='xs' align='center'>
                        {description}
                    </Text>
                )}
                {children}
            </FormBody>
            {is_footer_visible && (
                <FormFooter className='passkeys-status__footer'>
                    {secondary_button_text && (
                        <Button type='button' has_effect secondary onClick={onSecondaryButtonClick} large>
                            {secondary_button_text}
                        </Button>
                    )}
                    {primary_button_text && (
                        <Button
                            type={primary_button_type}
                            has_effect
                            primary
                            onClick={primary_button_type === 'button' ? () => onPrimaryButtonClick?.() : undefined}
                            is_disabled={primary_button_disabled}
                        >
                            {primary_button_text}
                        </Button>
                    )}
                </FormFooter>
            )}
        </Fragment>
    );
};
