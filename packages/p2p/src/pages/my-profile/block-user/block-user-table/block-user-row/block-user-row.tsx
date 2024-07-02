import React from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Button, Table, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import UserAvatar from 'Components/user/user-avatar';
import { useStores } from 'Stores';

type TBlockUserRowProps = {
    row: {
        id: string;
        is_blocked: number;
        name: string;
    };
};

const BlockUserRow = ({ row: advertiser }: TBlockUserRowProps) => {
    const { buy_sell_store, general_store, my_profile_store } = useStores();
    const { onClickUnblock } = my_profile_store;
    const { id, is_blocked, name } = advertiser;
    const history = useHistory();

    return (
        <Table.Row className='block-user-row'>
            <Table.Cell>
                <div
                    className={classNames('block-user-row__cell', {
                        'block-user-row__cell--barred': general_store.is_barred,
                    })}
                    onClick={() => {
                        if (!general_store.is_barred) {
                            buy_sell_store.setSelectedAdState({
                                advertiser_details: { id, name },
                            });
                            history.push({
                                pathname: routes.p2p_advertiser_page,
                                search: `?id=${id}`,
                            });
                        }
                    }}
                >
                    <UserAvatar nickname={name} size={32} text_size='s' />
                    <div className='block-user-row__cell-container'>
                        <Text size='xs'>{name}</Text>
                    </div>
                </div>
            </Table.Cell>
            <Table.Cell className='block-user-row__button-group'>
                {is_blocked ? (
                    <Button
                        className='block-user-row__button-group__unblock-button'
                        secondary
                        medium
                        onClick={() => onClickUnblock(advertiser)}
                    >
                        <Localize i18n_default_text='Unblock' />
                    </Button>
                ) : (
                    <Button
                        className='block-user-row__button-group__block-button'
                        alternate
                        medium
                        onClick={() => onClickUnblock(advertiser)}
                    >
                        <Localize i18n_default_text='Block' />
                    </Button>
                )}
            </Table.Cell>
        </Table.Row>
    );
};

export default observer(BlockUserRow);
