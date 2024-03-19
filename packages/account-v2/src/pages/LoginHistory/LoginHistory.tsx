import React from 'react';
import { Table } from '@deriv-com/ui';
import { useLoginHistoryData } from '../../hooks/useLoginHistoryData';

type TRowData = {
    action?: string;
    browser?: string;
    datetime?: string;
    ipAddress?: string;
    status?: string;
};
const columnOrder = ['datetime', 'action', 'browser', 'ipAddress', 'status'] as const;

const headers = {
    action: 'Action',
    browser: 'Browser',
    datetime: 'Date and Time',
    ipAddress: 'IP Address',
    status: 'Status',
};

const columns = columnOrder.map(key => ({ header: headers[key] }));

export const LoginHistory = () => {
    const { data: loginData } = useLoginHistoryData(25);

    return (
        <div className='flex flex-col '>
            <Table
                columns={columns}
                data={[
                    {
                        action: 'Login',
                        browser: 'Chrome v122.0.0.0',
                        datetime: '2024-03-07 12:04:42 GMT',
                        ipAddress: '942',
                        status: 'Successful',
                    },
                ]}
                isFetching={true}
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- adding empty function until the types are fixed in the Table component
                loadMoreFunction={() => {}}
                renderHeader={header => <span>{header}</span>}
                rowRender={(data: TRowData) => (
                    <div className='grid grid-flow-col'>
                        {columnOrder.map(key => (
                            <div key={key}>{data[key]}</div>
                        ))}
                    </div>
                )}
            />
        </div>
    );
};
