import React, { useState } from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import './server-bot.scss';
import ServerBotList from './server-bot-list';
import ServerQSForm from './server-qs-form';
import Chart from '../chart';
import { initial_req_schema } from './request_schema';

const ServerBot = observer(() => {
    const { client } = useStore();
    const DBotStores = useDBotStore();
    const {
        server_bot: { getBotList, bot_list, createBot },
    } = DBotStores;
    const [add_btn_active, setAddBtnActive] = useState(false);

    const setFormValues = () => {
        const data = JSON.parse(localStorage.getItem('qs-fields') ?? '{}');
        const parameters = initial_req_schema.data.parameters;
        const contract_parameters = initial_req_schema.data.contract_parameters;

        Object.keys(data).forEach(key => {
            if (key === 'size' || key === 'take_profit' || key === 'stop_loss') {
                parameters[key] = data[key];
            }
            if (key === 'stake') {
                parameters.initial_stake = data.stake;
            }
            if (key === 'type') {
                contract_parameters.contract_type = data.type;
            }
            if (key === 'duration' || key === 'symbol' || key === 'duration_unit' || key === 'amount') {
                (contract_parameters[key] as string | number) = data[key];
            }
            if (key === 'currency') {
                contract_parameters[key] = data[client?.currency || 'USD'];
            }
        });
    };

    React.useEffect(() => {
        if (!bot_list[0]) {
            getBotList();
        }
        setFormValues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='server-bot'>
            <Button onClick={() => setAddBtnActive(true)} green>
                {localize('+ add bot')}
            </Button>
            <div>
                <div>
                    <ServerBotList />
                </div>
                <div>
                    <div className='chart-modal-dialog' data-testid='chart-modal-dialog'>
                        <Chart show_digits_stats={false} />
                    </div>
                </div>
            </div>
            <ServerQSForm add_btn_active={add_btn_active} setAddBtnActive={setAddBtnActive} createBot={createBot} />
        </div>
    );
});

export default ServerBot;
