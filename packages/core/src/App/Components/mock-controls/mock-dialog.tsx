import React from 'react';
import { Button, Dropdown, Input, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { useWS } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import './mock-dialog.scss';

const MockDialog = () => {
    const WS = useWS();
    const { client } = useStore();
    const [session_id, setSessionId] = React.useState(localStorage.getItem('session_id') || '');
    const [session_list, setSessionList] = React.useState<string[]>([]);

    React.useEffect(() => {
        getSessionList();
    }, []);

    const getSessionList = async () => {
        const response = await WS.send({
            generate_mock: 1,
            session_list: 1,
        });

        const { session_list: list } = response;
        if (Array.isArray(list)) {
            setSessionList(prev => [...prev, ...list]);
        }
    };

    const handleMockLogin = async () => {
        const response = WS.send({
            generate_mock: 1,
            login: 1,
        });
        if (response) {
            const { active_loginid, ...accounts } = response;
            client.setLoginInformation(accounts, active_loginid);
        }
    };

    const handleSessionIdChange = (id: string) => {
        window.localStorage.setItem('session_id', id);
        if (id !== session_id) {
            WS.closeAndOpenNewConnection(getLanguage(), id);
            setSessionId(id);
        }
    };

    const handleClearAll = () => {
        window.localStorage.removeItem('session_id');
        setSessionId('');
        WS.closeAndOpenNewConnection(getLanguage(), '');
    };

    return (
        <div className='mock-dialog'>
            <div className='mock-dialog__title'>
                <Text weight='bold' size='sm'>
                    Mock Server Config
                </Text>
            </div>
            <div className='mock-dialog__form'>
                <div className='mock-dialog__form--dropdown-container'>
                    <Dropdown
                        placeholder='Available session id'
                        list={session_list.map((s: string) => ({
                            text: s,
                            value: s,
                        }))}
                        value={session_id}
                        is_align_text_left
                    />
                    <Button>
                        <svg
                            stroke='currentColor'
                            fill='none'
                            strokeWidth='2'
                            viewBox='0 0 24 24'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            height='1em'
                            width='1em'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <polyline points='1 4 1 10 7 10' />
                            <polyline points='23 20 23 14 17 14' />
                            <path d='M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15' />
                        </svg>
                    </Button>
                </div>
                <Input
                    className='mock-dialog__form--input'
                    type='text'
                    label='Session Id'
                    value={session_id}
                    onChange={e => setSessionId(e.target.value)}
                />
                <div className='mock-dialog__form--submit-container'>
                    <Button onClick={() => handleMockLogin()}>Login</Button>
                    <Button onClick={() => handleSessionIdChange(session_id)}>Connect</Button>
                    <Button onClick={() => handleClearAll()}>Reset All</Button>
                </div>
            </div>
        </div>
    );
};

export default MockDialog;
