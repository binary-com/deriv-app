import React from 'react';
import { Button, Icon, Modal, Text, Popover } from '@deriv/components';
import { isDesktop, useIsMounted } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import ApiTokenContext from './api-token-context';
import { TPopoverAlignment, TFormattedToken, TApiContext } from '../../Types';

type TApiTokenDeleteButton = {
    popover_alignment?: TPopoverAlignment;
    token: TFormattedToken;
};

const ApiTokenDeleteButton = ({ token, popover_alignment = 'left' }: TApiTokenDeleteButton) => {
    const { deleteToken } = React.useContext<TApiContext>(ApiTokenContext);
    const [is_deleting, setIsDeleting] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(false);
    const [is_popover_open, setIsPopoverOpen] = React.useState(false);
    const isMounted = useIsMounted();

    const getConfirmationBeforeDelete = () => {
        if (isDesktop()) setIsPopoverOpen(false);
        setIsDeleting(true);
    };

    const onMouseEnterHandler = () => {
        if (!is_deleting && isDesktop()) setIsPopoverOpen(true);
    };

    const onMouseLeaveHandler = () => {
        if (!is_deleting && isDesktop()) setIsPopoverOpen(false);
    };

    const onCancel = () => setIsDeleting(false);

    const onSubmit = async () => {
        setIsLoading(true);
        await deleteToken(token.token ?? '');
        if (isMounted()) {
            setIsLoading(false);
            setIsDeleting(false);
        }
    };

    return (
        <React.Fragment>
            <Modal is_open={is_deleting} small>
                <Modal.Body>
                    <Text as='h1' color='prominent' weight='bold' className='da-api-token__modal-title'>
                        <Localize i18n_default_text='Delete token' />
                    </Text>
                    <Text as='p' color='prominent ' size='xs' line_height='m'>
                        <Localize i18n_default_text='Are you sure you want to delete this token?' />
                    </Text>
                </Modal.Body>
                <Modal.Footer className='da-api-token__modal-footer'>
                    <Button className='dc-dialog__button' has_effect onClick={onCancel} secondary large>
                        <Localize i18n_default_text='Cancel' />
                    </Button>
                    <Button
                        className='dc-dialog__button'
                        has_effect
                        onClick={onSubmit}
                        primary
                        large
                        is_loading={is_loading}
                    >
                        <Localize i18n_default_text='Yes, delete' />
                    </Button>
                </Modal.Footer>
            </Modal>
            <Popover
                alignment={popover_alignment}
                classNameBubble='dc-clipboard__popover'
                message={<Localize i18n_default_text='Delete this token' />}
                relative_render={false}
                zIndex='9999'
                is_open={is_popover_open}
            >
                <Icon
                    icon={'IcDelete'}
                    custom_color='var(--text-prominent)'
                    className='dc-clipboard da-api-token__delete-icon'
                    onClick={getConfirmationBeforeDelete}
                    size={14}
                    data_testid='dt_token_delete_icon'
                    onMouseEnter={onMouseEnterHandler}
                    onMouseLeave={onMouseLeaveHandler}
                />
            </Popover>
        </React.Fragment>
    );
};

export default ApiTokenDeleteButton;
