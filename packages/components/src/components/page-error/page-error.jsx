import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared';
import ButtonLink from '../button-link/button-link.jsx';
import DesktopWrapper from '../desktop-wrapper/desktop-wrapper.jsx';
import MobileWrapper from '../mobile-wrapper/mobile-wrapper.jsx';
import Text from '../text/text.jsx';

const PageError = ({
    buttonOnClick,
    buttonSize,
    classNameImage,
    header,
    image_url,
    messages,
    redirect_labels,
    redirect_urls,
    should_clear_error_on_click,
    setError,
}) => {
    const onClickHandler = () => {
        if (should_clear_error_on_click) {
            setError(false, null);
        } else if (typeof buttonOnClick === 'function') {
            buttonOnClick();
        }
    };

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
                    <MobileWrapper>
                        <img
                            className={classNameImage}
                            src={image_url}
                            alt={'404'}
                            loading='lazy'
                            width='328px'
                            height='200px'
                        />
                    </MobileWrapper>
                </>
            )}
            <div
                className={classNames('dc-page-error__box', {
                    'dc-page-error__box--left': !!image_url,
                })}
            >
                <Text as='h3' size='l' align='center' weight='bold' line_height='s' color='prominent'>
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
                            message.has_html ? (
                                <Text
                                    as='p'
                                    size='s'
                                    align={isMobile() ? 'center' : 'left'}
                                    line_height='x'
                                    key={index}
                                    className='dc-page-error__message-paragraph'
                                    dangerouslySetInnerHTML={{ __html: message.message }}
                                />
                            ) : (
                                <Text
                                    as='p'
                                    size='s'
                                    align={isMobile() ? 'center' : 'left'}
                                    line_height='x'
                                    key={index}
                                    className='dc-page-error__message-paragraph'
                                >
                                    {message}
                                </Text>
                            )
                        )}
                    </Text>
                </div>
                <div className='dc-page-error__btn-wrapper'>
                    {redirect_urls?.map((url, index) => {
                        return (
                            <ButtonLink
                                className='dc-page-error__btn'
                                to={url}
                                onClick={onClickHandler}
                                size={buttonSize || 'large'}
                                key={index}
                            >
                                <Text weight='bold' className='dc-page-error__btn-text dc-btn__text'>
                                    {redirect_labels[index]}
                                </Text>
                            </ButtonLink>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

PageError.propTypes = {
    buttonOnClick: PropTypes.func,
    buttonSize: PropTypes.string,
    classNameImage: PropTypes.string,
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    image_url: PropTypes.string,
    messages: PropTypes.array,
    redirect_labels: PropTypes.array,
    redirect_urls: PropTypes.array,
    setError: PropTypes.func,
    should_clear_error_on_click: PropTypes.bool,
};

export default PageError;
