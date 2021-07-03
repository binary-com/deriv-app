import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';
import DataTable from 'Components/data-table/data-table.jsx';
import Theme from '../shared/theme';
import 'Components/data-table/data-table.scss';
import './data-table.stories.css';

const mock_data = [];
for (let i = 1; i < 30; i++)
    mock_data.push({
        id: i,
        name: `Test name ${i}`,
        family: `Test family ${i}`,
    });

const mock_columns = [
    {
        key: 'id',
        title: '',
        col_index: 'id',
    },
    {
        title: 'First Name',
        col_index: 'name',
    },
    {
        title: 'Last Name',
        col_index: 'family',
    },
];

const handleRowAction = row_obj => console.log(row_obj);

const handleActionColumns = () => ({ row_obj, is_header, is_footer }) => {
    if (is_header || is_footer) {
        return <div className='test__row-action' />;
    }
    console.log(row_obj);
    return (
        <div className='test__row-action'>
            <h1>Nither header nor footer!</h1>
        </div>
    );
};

const handleScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    console.log(scrollTop, scrollHeight, clientHeight);
};

const stories = storiesOf('Data Display|Data Table', module);
stories.addDecorator(withKnobs);

stories
    .add('Basic usage', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <div
                style={{
                    margin: '20px auto',
                    width: '100%',
                    height: '360px',
                }}
            >
                <DataTable className='container' columns={mock_columns} data_source={mock_data} getRowSize={() => 30} />
            </div>
        </Theme>
    ))
    .add('Custom width', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <div
                style={{
                    margin: '20px auto',
                    width: '100%',
                    height: '360px',
                }}
            >
                <DataTable className='container' columns={mock_columns} data_source={mock_data} getRowSize={() => 30} />
            </div>
        </Theme>
    ))
    .add('With getRowAction', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <div
                style={{
                    margin: '20px auto',
                    width: '100%',
                    height: '360px',
                }}
            >
                <DataTable
                    className='container'
                    columns={mock_columns}
                    data_source={mock_data}
                    getRowSize={() => 30}
                    getRowAction={row => handleRowAction(row)}
                />
            </div>
        </Theme>
    ))
    .add('With action columns', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <div
                style={{
                    margin: '20px auto',
                    width: '100%',
                    height: '360px',
                }}
            >
                <DataTable
                    className='container'
                    columns={mock_columns}
                    data_source={mock_data}
                    getRowSize={() => 30}
                    getActionColumns={handleActionColumns}
                />
            </div>
        </Theme>
    ))
    .add('With scroll', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <div
                style={{
                    margin: '20px auto',
                    width: '100%',
                    height: '360px',
                }}
            >
                <DataTable
                    className='container'
                    columns={mock_columns}
                    data_source={mock_data}
                    getRowSize={() => 30}
                    onScroll={handleScroll}
                />
            </div>
        </Theme>
    ))
    .add('With footer', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <div
                style={{
                    margin: '20px auto',
                    width: '100%',
                    height: '360px',
                }}
            >
                <DataTable
                    className='container'
                    columns={mock_columns}
                    data_source={mock_data}
                    getRowSize={() => 30}
                    footer={{
                        name: 'All names here',
                        family: 'All families here',
                    }}
                />
            </div>
        </Theme>
    ));
