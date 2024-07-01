import React from 'react';
import { observer } from '@deriv/stores';

const Notifications = observer(({ notifications }: { notifications: Array<string> }) => {
    return (
        <div className='server-bot__notifications'>
            {notifications?.map((notification: string, index: number) => {
                return (
                    <div
                        key={index}
                        className='server-bot__notification'
                    >
                        {notification}
                    </div>
                )
            })}
        </div>
    )
});

export default Notifications;
