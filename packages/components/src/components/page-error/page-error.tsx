import classNames from 'classnames';
import React from 'react';
import { isMobileOrTablet } from '@deriv/shared';
import DesktopWrapper from '../desktop-wrapper';
import MobileOrTabletWrapper from '../mobile-wrapper';
import ButtonLink from '../button-link/button-link';
import Text from '../text/text';
import Button from '../button';

type TMessageObject = { message: string; has_html?: boolean };

type TPageErrorProps = {
    buttonOnClick?: () => void;
    buttonSize?: 'small' | 'medium' | 'large';
    classNameImage?: string;
    header: React.ReactNode;
    image_url?: string;
    messages: Array<TMessageObject | React.ReactNode>;
    redirect_labels: Array<JSX.Element | string>;
    redirect_urls?: string[];
    setError?: (has_error: boolean, error: React.ReactNode) => void;
    should_clear_error_on_click?: boolean;
    should_redirect?: boolean;
};

const PageError = ({
    buttonOnClick,
    buttonSize = 'large',
    classNameImage,
    header,
    image_url,
    messages,
    redirect_labels,
    redirect_urls,
    should_clear_error_on_click,
    setError,
    should_redirect = true,
}: TPageErrorProps) => {
    const onClickHandler = () => {
        if (should_clear_error_on_click) {
            setError?.(false, null);
        } else {
            buttonOnClick?.();
        }
    };
    const is_mobile = isMobileOrTablet();

    return (
        // if image_url is passed we should split the page to two columns and left-align messages
        <div className='dc-page-error__container'>
            {!!image_url && (
                <>
                    <DesktopWrapper>
                        <img
                            className={classNameImage}
                            src={image_url}
                            alt={'404'}
                            loading='lazy'
                            width='607px' // width and height should be specified so it doesn't jump to the right after image loads
                            height='366px'
                        />
                    </DesktopWrapper>
                    <MobileOrTabletWrapper>
                        <img
                            className={classNameImage}
                            src={image_url}
                            alt={'404'}
                            loading='lazy'
                            width='328px'
                            height='200px'
                        />
                    </MobileOrTabletWrapper>
                </>
            )}
            <div
                className={classNames('dc-page-error__box', {
                    'dc-page-error__box--left': !!image_url,
                })}
            >
                <Text
                    as='h3'
                    size={is_mobile ? 's' : 'l'}
                    align='center'
                    weight='bold'
                    line_height='s'
                    color='prominent'
                >
                    {header}
                </Text>
                <div
                    className={classNames('dc-page-error__message-wrapper', {
                        'dc-page-error__message-wrapper--left': !!image_url,
                    })}
                >
                    <Text
                        color='prominent'
                        className={classNames('dc-page-error__message', {
                            'dc-page-error__message--left': !!image_url,
                        })}
                    >
                        {messages.map((message, index) =>
                            (message as TMessageObject)?.has_html ? (
                                <Text
                                    as='p'
                                    size={is_mobile ? 'xxs' : 's'}
                                    align={is_mobile ? 'center' : 'left'}
                                    line_height='x'
                                    key={index}
                                    className='dc-page-error__message-paragraph'
                                    dangerouslySetInnerHTML={{ __html: (message as TMessageObject)?.message }}
                                />
                            ) : (
                                <Text
                                    as='p'
                                    size={is_mobile ? 'xxs' : 's'}
                                    align={is_mobile ? 'center' : 'left'}
                                    line_height='x'
                                    key={index}
                                    className='dc-page-error__message-paragraph'
                                >
                                    {message as React.ReactNode}
                                </Text>
                            )
                        )}
                    </Text>
                </div>
                <div className='dc-page-error__btn-wrapper' data-testid='dc-page-error__btn-wrapper'>
                    {should_redirect &&
                        redirect_labels.length !== 0 &&
                        redirect_urls?.map?.((url, index) => (
                            <ButtonLink
                                className='dc-page-error__btn'
                                to={url}
                                onClick={onClickHandler}
                                size={buttonSize}
                                key={index}
                            >
                                <Text
                                    weight='bold'
                                    size={is_mobile ? 'xs' : 's'}
                                    className='dc-page-error__btn-text dc-btn__text'
                                >
                                    {redirect_labels[index]}
                                </Text>
                            </ButtonLink>
                        ))}
                    {!should_redirect && (
                        <Button
                            type='button'
                            className='dc-page-error__btn--no-redirect'
                            onClick={onClickHandler}
                            primary
                            large={!is_mobile}
                            medium={is_mobile}
                        >
                            <Text
                                weight='bold'
                                size={is_mobile ? 'xs' : 's'}
                                className='dc-page-error__btn-text dc-btn__text'
                            >
                                {redirect_labels[0]}
                            </Text>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageError;
