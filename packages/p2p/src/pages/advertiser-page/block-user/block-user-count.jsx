import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Icon, MobileOrTabletWrapper, Modal, Popover, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { isDesktop } from '@deriv/shared';
import './block-user-count.scss';

const BlockUserCount = () => {
    const { general_store } = useStores();
    const { user_blocked_count } = general_store;

    const [is_block_user_count_modal_open, setIsBlockUserCountModalOpen] = React.useState(false);

    const getMessage = () => {
        switch (user_blocked_count) {
            case 0:
                return localize('Nobody has blocked you. Yay!');
            case 1:
                return localize('{{user_blocked_count}} person has blocked you', {
                    user_blocked_count,
                });
            default:
                return localize('{{user_blocked_count}} people have blocked you', {
                    user_blocked_count,
                });
        }
    };

    return (
        <React.Fragment>
            <MobileOrTabletWrapper>
                <Modal has_close_icon={false} is_open={is_block_user_count_modal_open} width='440px'>
                    <Modal.Body>
                        <Text color='prominent' size='xs'>
                            {getMessage()}
                        </Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            large
                            onClick={() => {
                                setIsBlockUserCountModalOpen(false);
                            }}
                            primary
                        >
                            {localize('Ok')}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </MobileOrTabletWrapper>
            <div onClick={!isDesktop() ? () => setIsBlockUserCountModalOpen(true) : null}>
                <Popover
                    alignment='top'
                    className='block-user-count'
                    classNameTarget='block-user-count__container'
                    message={getMessage()}
                >
                    <Icon className='block-user-count__container--icon' icon='IcUserBlockedOutline' size={16} />
                    <Text color='less-prominent' size={isDesktop() ? 'xs' : 14}>
                        {user_blocked_count}
                    </Text>
                </Popover>
            </div>
        </React.Fragment>
    );
};

export default observer(BlockUserCount);
