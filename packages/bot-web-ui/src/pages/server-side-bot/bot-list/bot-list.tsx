import React, { useEffect } from 'react';
import { Button, Icon, Text, useOnClickOutside } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { botNotification } from 'Components/bot-notification/bot-notification';
import { useDBotStore } from 'Stores/useDBotStore';
import LoginModal from './common/login-modal';
import BotListItem from './bot-list-item';
import BotListMenu from './bot-list-menu';
import DeleteServerBot from './delete-server-bot';

type TBotList = {
    setFormVisibility: (is_open: boolean) => void;
};

const BotList: React.FC<TBotList> = observer(({ setFormVisibility }) => {
    const [is_delete_dialog_visible, setDeleteDialogVisibility] = React.useState(false);
    const [is_login_modal_visible, setLoginModalVisble] = React.useState(false);
    const [temp_bot_id, setTempBotId] = React.useState('');

    const {
        ui: { is_mobile },
    } = useStore();
    const { server_bot } = useDBotStore();
    const {
        getBotList,
        bot_list = [],
        is_loading_bot_list,
        startBot,
        stopBot,
        deleteBot,
        active_bot,
        setActiveBotId,
        should_subscribe,
    } = server_bot;

    const [menu_open, setMenuOpen] = React.useState({ visible: false, y: 0, bot_id: '' });
    const menu_ref = React.useRef(null);

    const { client } = useStore();
    const { is_logged_in } = client;

    useEffect(() => {
        if (should_subscribe) getBotList();

        window.addEventListener('focus', getBotList);
        return () => {
            window.removeEventListener('focus', getBotList);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const el_ssb_bot_list = document.getElementById('ssb-bot-list');

        if (el_ssb_bot_list) {
            el_ssb_bot_list?.addEventListener('scroll', () => {
                if (menu_open.visible) {
                    closeMenu();
                }
            });
            return () => {
                el_ssb_bot_list?.removeEventListener('scroll', closeMenu);
            };
        }
    }, [menu_open.visible]);

    const handleMenuClick = (e: React.MouseEvent<HTMLDivElement>, bot_id: string) => {
        setMenuOpen(open => ({
            visible: open.bot_id === bot_id ? !menu_open.visible : true,
            y: e.clientY,
            bot_id,
        }));
    };

    const botAction = (action: string, bot_id: string) => {
        switch (action) {
            case 'RUN':
                if (active_bot?.status !== 'stopped') {
                    botNotification(localize('You can only run one bot at a time.'));
                    break;
                }
                startBot(bot_id);
                break;
            case 'STOP':
                stopBot(bot_id);
                break;
            case 'OPEN':
                setActiveBotId(bot_id);
                closeMenu();
                break;
            case 'DELETE':
                if (active_bot?.status === 'running' && active_bot.bot_id === bot_id) {
                    botNotification(localize('You cannot delete a running bot.'));
                    closeMenu();
                    break;
                }
                setTempBotId(bot_id);
                setDeleteDialogVisibility(true);
                closeMenu();
                break;
            default:
                break;
        }
    };

    const onDeleteConfirm = () => {
        deleteBot(temp_bot_id);
        setDeleteDialogVisibility(false);
    };

    const closeMenu = () => {
        setMenuOpen({ visible: false, y: 0, bot_id: '' });
    };

    useOnClickOutside(menu_ref, closeMenu, event => menu_open.visible && !menu_ref?.current.contains(event.target));
    const has_list = !!bot_list?.length;
    const should_disable_delete = menu_open.bot_id === active_bot.bot_id && active_bot.status === 'running';

    return (
        <>
            <div className='ssb-list'>
                {/* PORTAL -- DON'T REMOVE */}
                <div id='ssb-bot-list-menu' ref={menu_ref} />
                <BotListMenu
                    is_open={menu_open.visible}
                    y_position={menu_open.y}
                    bot_id={menu_open.bot_id}
                    botAction={botAction}
                    is_mobile={is_mobile}
                    disable_delete={should_disable_delete}
                />

                <div className='ssb-list__header'>
                    <Text size={is_mobile ? 'xxs' : 'xs'} weight='bold'>
                        <Localize i18n_default_text='Bot list' />
                    </Text>
                    {has_list && (
                        <span
                            className='ssb-list__header__add'
                            onClick={() => {
                                setFormVisibility(true);
                            }}
                            tabIndex={0}
                            onKeyDown={(e: React.KeyboardEvent) => {
                                if (e.key === 'Enter') {
                                    setFormVisibility(true);
                                }
                            }}
                        >
                            <Icon icon='IcAddBold' />
                        </span>
                    )}
                </div>
                <div id='ssb-bot-list' className='ssb-list__content'>
                    {has_list ? (
                        <>
                            {bot_list.map(item => {
                                return (
                                    <BotListItem
                                        botAction={botAction}
                                        key={item.bot_id}
                                        item={item}
                                        handleMenuClick={handleMenuClick}
                                        active_bot={active_bot}
                                        setActiveBotId={setActiveBotId}
                                    />
                                );
                            })}
                        </>
                    ) : (
                        <div className='ssb-list__content__no-list'>
                            {is_logged_in && is_loading_bot_list ? (
                                <Text>Loading...</Text>
                            ) : (
                                <>
                                    <Text size='xs'>
                                        <Localize i18n_default_text='This is Beta version of server bot.' />
                                    </Text>
                                    <Text size='xs'>
                                        <Localize
                                            i18n_default_text='To get started, tap <0>+ Create bot</0>'
                                            components={[<strong key={0} />]}
                                        />
                                    </Text>
                                    {!has_list && (
                                        <div className='ssb-list__content__no-list__action'>
                                            <Button
                                                primary
                                                onClick={() => {
                                                    if (!is_logged_in) {
                                                        setLoginModalVisble(true);
                                                    } else {
                                                        setFormVisibility(true);
                                                    }
                                                }}
                                            >
                                                <Localize i18n_default_text='+ Create bot' />
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <DeleteServerBot
                onDelete={onDeleteConfirm}
                is_open={is_delete_dialog_visible}
                setVisibility={setDeleteDialogVisibility}
            />
            <LoginModal is_login_modal_visible={is_login_modal_visible} setLoginModalVisble={setLoginModalVisble} />
        </>
    );
});

export default BotList;
