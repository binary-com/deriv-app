
import classNames         from 'classnames';
import { Button, Modal }  from 'deriv-components';
import PropTypes          from 'prop-types';
import React              from 'react';
import { translate }      from '../utils/tools';
import '../assets/sass/dialog.scss';

const Dialog = ({
    children,
    onOkButtonClick,
    onCancelButtonClick,
    is_open,
    title,
}) => {
    return (
        <Modal
            className='bot-dialog'
            is_open={is_open}
            has_close_icon={false}
            toggleModal={onCancelButtonClick}
        >
            <div className='bot-dialog__content'>
                <div className='bot-dialog__header'>
                    {title}
                </div>
                <div className='bot-dialog__text'>
                    {children}
                </div>
                <div className='bot-dialog__footer'>
                    {onCancelButtonClick &&
                        <Button
                            className={classNames(
                                'btn--secondary--default',
                                'bot-dialog__cancel'
                            )}
                            text={translate('Cancel')}
                            onClick={onCancelButtonClick}
                            has_effect
                        />}
                    {onOkButtonClick &&
                        <Button
                            className={classNames(
                                'btn--primary--default',
                                'bot-dialog__ok'
                            )}
                            text={translate('Ok')}
                            onClick={onOkButtonClick}
                            has_effect
                        />}
                    {/* TODO Add array to send more buttons if requierd */}
                </div>
            </div>
        </Modal>
    );
};

Dialog.propTypes = {
    children           : PropTypes.node,
    is_open            : PropTypes.bool,
    onCancelButtonClick: PropTypes.func,
    onOkButtonClick    : PropTypes.func,
    title              : PropTypes.string,
};

export default Dialog;
