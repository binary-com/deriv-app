import React, { FC, Fragment } from 'react';
import classNames from 'classnames';
import { useEventListener } from 'usehooks-ts';
import useDevice from '../../../hooks/useDevice';
import CloseIcon from '../../../public/images/ic-close-dark.svg';
import { useModal } from '../../ModalProvider';
import './ModalWrapper.scss';

type TProps = {
    hideCloseButton?: boolean;
    isFullscreen?: boolean;
    shouldPreventCloseOnEscape?: boolean;
};

const ModalWrapper: FC<React.PropsWithChildren<TProps>> = ({
    children,
    hideCloseButton = false,
    isFullscreen = false,
    shouldPreventCloseOnEscape = false,
}) => {
    const { hide } = useModal();
    const { isMobile } = useDevice();

    useEventListener('keydown', (event: KeyboardEvent) => {
        if (!shouldPreventCloseOnEscape && event.key === 'Escape') {
            hide();
        }
    });

    const onClickOverlay = () => {
        isMobile && hide();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!shouldPreventCloseOnEscape && event.key === 'Space') {
            event.preventDefault();
            onClickOverlay();
        }
    };

    return (
        <Fragment>
            <div className='wallets-modal-overlay' />
            <div
                className={classNames('wallets-modal-wrapper', {
                    'wallets-modal-wrapper--fullscreen': isFullscreen,
                })}
                onClick={onClickOverlay}
                onKeyDown={handleKeyDown}
            >
                <div
                    className='wallets-modal-body'
                    onClick={e => e.stopPropagation()}
                    onKeyDown={e => e.stopPropagation()}
                >
                    {!hideCloseButton && <CloseIcon className='wallets-modal-wrapper__close-icon' onClick={hide} />}
                    {children}
                </div>
            </div>
        </Fragment>
    );
};

export default ModalWrapper;
