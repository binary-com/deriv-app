import React from 'react';
import PropTypes from 'prop-types';
import { useIsMounted } from '@deriv/shared';
import { Dialog, Icon, Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';

const WarningNoteBullet = ({ message }) => (
    <div className='da-api-token__bullet-wrapper'>
        <div className='da-api-token__bullet' />
        <Text as='p' color='prominent ' size='xs' line_height='m'>
            {message}
        </Text>
    </div>
);

const WarningDialogMessage = () => (
    <>
        <Text as='p' color='prominent ' size='xs' line_height='m'>
            {localize(
                'Be careful who you share this token with. Anyone with this token can perform the following actions on your account behalf'
            )}
        </Text>
        <div className='da-api-token__bullet-container'>
            <WarningNoteBullet message={localize('Add accounts')} />
            <WarningNoteBullet message={localize('Create or delete API tokens for trading and withdrawals')} />
            <WarningNoteBullet message={localize('Modify account settings')} />
        </div>
    </>
);

const ApiTokenClipboard = ({ scopes, text_copy, info_message, success_message, popoverAlignment = 'bottom' }) => {
    const [is_copied, setIsCopied] = React.useState(false);
    const [is_visible, setIsVisible] = React.useState(false);
    const [is_popover_open, setIsPopoverOpen] = React.useState(false);
    const isMounted = useIsMounted();
    let timeout_clipboard = null;
    const has_admin_scope = scopes.includes('Admin');

    const toggleDialogVisibility = event => {
        setIsVisible(!is_visible);
        event.stopPropagation();
    };

    const togglePopupvisibility = () => {
        setIsPopoverOpen(!is_popover_open);
    };

    const copyToClipboard = text => {
        const textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    };

    const onClick = () => {
        setIsVisible(false);
        copyToClipboard(text_copy);
        setIsCopied(true);
        setIsPopoverOpen(true);
        timeout_clipboard = setTimeout(() => {
            if (isMounted()) {
                setIsPopoverOpen(false);
                setIsCopied(false);
            }
        }, 2000);
    };

    React.useEffect(() => {
        return () => clearTimeout(timeout_clipboard);
    }, [timeout_clipboard]);

    return (
        <>
            <Dialog
                is_visible={is_visible}
                confirm_button_text={localize('Ok')}
                onConfirm={onClick}
                className='da-api-token__dialog'
                primary_button_type='button'
            >
                <WarningDialogMessage />
            </Dialog>
            <Popover
                alignment={popoverAlignment}
                classNameBubble='dc-clipboard__popover'
                message={is_copied ? success_message : info_message}
                is_open={is_popover_open}
                relative_render={false}
                zIndex={9999}
            >
                {is_copied && (
                    <Icon
                        icon='IcCheckmarkCircle'
                        custom_color='var(--status-success)'
                        className='dc-clipboard'
                        size={14}
                        data_testid='dt_token_copied_icon'
                    />
                )}
                {!is_copied && (
                    <Icon
                        icon='IcClipboard'
                        custom_color='var(--text-prominent)'
                        className='dc-clipboard'
                        onClick={has_admin_scope ? toggleDialogVisibility : onClick}
                        onMouseEnter={togglePopupvisibility}
                        onMouseLeave={togglePopupvisibility}
                        size={14}
                        data_testid='dt_copy_token_icon'
                    />
                )}
            </Popover>
        </>
    );
};

ApiTokenClipboard.propTypes = {
    scopes: PropTypes.array.isRequired,
    text_copy: PropTypes.string,
    info_message: PropTypes.string,
    success_message: PropTypes.string,
    popoverAlignment: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

export default ApiTokenClipboard;
