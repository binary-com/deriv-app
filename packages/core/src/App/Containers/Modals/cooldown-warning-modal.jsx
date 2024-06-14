import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { formatDate, formatTime, isMobileOrTablet } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

const CooldownWarningModal = observer(() => {
    const { client, ui } = useStore();
    const { real_account_creation_unlock_date } = client;
    const { should_show_cooldown_modal, setShouldShowCooldownModal } = ui;
    const unblock_date = formatDate(real_account_creation_unlock_date, 'DD MMMM');
    const unblock_time = formatTime(real_account_creation_unlock_date, 'hh:mm [GMT]');
    const real_account_unblock_date = localize('{{unblock_date}} at {{unblock_time}}', { unblock_date, unblock_time });
    const handleToggleModal = () => setShouldShowCooldownModal(!should_show_cooldown_modal);

    return (
        <Modal
            width='44rem'
            title={localize('Account creation paused for 24 hours')}
            is_open={should_show_cooldown_modal}
            toggleModal={handleToggleModal}
            className='center-risk-modal'
            has_close_icon={!isMobileOrTablet()}
        >
            <Modal.Body>
                <Icon icon='IcRedWarning' size={63} />
                <Text as='p' size='xs' align='center' className='risk-acceptance__text'>
                    <Localize
                        i18n_default_text="Sorry, you're unable to create an account at this time. As you declined our previous risk warnings, we need you to wait for 24 hours after your first account creation attempt before you can proceed.<0/><0/>"
                        components={<br key={0} />}
                    />
                    <Localize
                        i18n_default_text='We take your financial well-being seriously and want to ensure you are fully aware of the risks before trading.<0/><0/>'
                        components={<br key={0} />}
                    />
                    <Localize
                        i18n_default_text='Thank you for your understanding. You can create your account on {{real_account_unblock_date}} or later.'
                        values={{ real_account_unblock_date }}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type='button'
                    large
                    text={localize('OK')}
                    primary
                    onClick={() => {
                        setShouldShowCooldownModal(false);
                    }}
                />
            </Modal.Footer>
        </Modal>
    );
});

export default CooldownWarningModal;
