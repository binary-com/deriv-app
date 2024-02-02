import React from 'react';
import { useStore } from '@deriv/stores';
import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { TBotListItem } from 'Stores/server-bot-store';
import { useDBotStore } from 'Stores/useDBotStore';

type THeader = {
    label: string;
    className: string;
};

const default_class_name = 'bot-list-contract__label';

const HEADERS: THeader[] = [
    {
        label: localize('Bot name'),
        className: default_class_name,
    },
    {
        label: localize('Strategy parameters'),
        className: default_class_name,
    },
    {
        label: localize('Actions'),
        className: default_class_name,
    },
    {
        label: localize('Last modified'),
        className: default_class_name,
    },
    {
        label: localize('Status'),
        className: default_class_name,
    },
];

const ServerBotList = () => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const DBotStores = useDBotStore();
    const {
        server_bot: { bot_list, removeBot, startBot, stopBot },
    } = DBotStores;
    return (
        <div className='bot-list__wrapper'>
            {bot_list && (
                <>
                    <div className='load-strategy__title'>
                        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
                            <Localize i18n_default_text='Your bots:' />
                        </Text>
                    </div>
                    <div className='bot-list-contract__header'>
                        {HEADERS.map(({ label, className }) => {
                            return (
                                <div className={className} key={label}>
                                    <Text size={is_mobile ? 'xxs' : 'xs'} weight='bold'>
                                        {label}
                                    </Text>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
            <div className='bot-list-contract__wrapper'>
                {bot_list?.map((bot: TBotListItem) => {
                    const { name, bot_id, status } = bot;
                    return (
                        <div key={bot_id} className='bot-list-contract__item'>
                            <div className='bot-list-contract__item__label'>{name}</div>
                            <div>
                                <p>{localize('[ Strategy parameters ]')}</p>
                            </div>
                            <div className='bot-list-contract__actions'>
                                <Button green onClick={() => startBot(bot_id)}>
                                    {localize('Start')}
                                </Button>
                                <Button primary onClick={() => stopBot(bot_id)}>
                                    {localize('Stop')}
                                </Button>
                                <Button green>{localize('Pause')}</Button>
                                <Button primary onClick={() => removeBot(bot_id)}>
                                    {localize('Remove')}
                                </Button>
                            </div>
                            <div>{localize('last modified: [ Date ]')}</div>
                            <div>{`status: ${status}`}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ServerBotList;
