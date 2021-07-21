import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { Div100vhContainer, Text, Button, Icon, ThemedScrollbars } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';

const ListItem = ({ text }) => (
    <div className='account-management__list-message'>
        <div className='account-management__list-icon'>
            <Icon icon='IcCloseCircle' color='red' />
        </div>
        <div className='account-management__list-text-container'>
            <Text size='xs' className='account-management__list-text'>
                {text}
            </Text>
        </div>
    </div>
);

const IconMessageList = ({ className, icon, message, message_list, onContinue }) => {
    const has_maximum_list = message_list?.length > 3;
    return (
        <ThemedScrollbars is_bypassed={isMobile()}>
            <Div100vhContainer
                className='account-management__message-wrapper'
                is_disabled={isDesktop()}
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
                        weight='bold'
                        className={classNames('account-management__message', {
                            [`${className}__message`]: className,
                        })}
                    >
                        {message}
                    </Text>

                    {message_list && (
                        <div className='account-management__list-container'>
                            {has_maximum_list ? (
                                <MaximumList message_list={message_list} />
                            ) : (
                                message_list.map((text, idx) => <ListItem key={idx} text={text} />)
                            )}
                        </div>
                    )}
                    {onContinue && (
                        <Button
                            type='button'
                            className='account-management__continue'
                            onClick={onContinue}
                            large
                            text={localize('Upload Document')}
                            primary
                        />
                    )}
                </div>
            </Div100vhContainer>
        </ThemedScrollbars>
    );
};

const MaximumList = ({ message_list }) => {
    const [show_more, setShowMore] = React.useState(false);
    const maximum_list = message_list.slice(0, 3);

    return show_more ? (
        <React.Fragment>
            {message_list.map((text, idx) => (
                <ListItem key={idx} text={text} />
            ))}
            <Button
                type='button'
                className='account-management__list-button'
                onClick={() => setShowMore(false)}
                large
                text={localize('Show less')}
                tertiary
            />
        </React.Fragment>
    ) : (
        <React.Fragment>
            {maximum_list.map((text, idx) => (
                <ListItem key={idx} text={text} />
            ))}
            <Button
                type='button'
                className='account-management__list-button'
                onClick={() => setShowMore(true)}
                large
                text={localize('Show more')}
                tertiary
            />
        </React.Fragment>
    );
};

export default IconMessageList;
