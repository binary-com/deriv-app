import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';
import DataList from 'Components/data-list';
import 'Components/data-list/data-list.scss';
import notes from './README.md';
import Theme from '../shared/theme';

const mock_data = [];
for (let i = 1; i < 30; i++)
    mock_data.push({
        id: i,
        name: 'Test name ' + i,
        family: 'Test family ' + i,
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

const columns_map = mock_columns.reduce((map, item) => {
    map[item.col_index] = item;
    return map;
}, {});

const rowRenderer = ({ row }) => {
    return (
        <>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.id} />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.name} />
                <DataList.Cell row={row} column={columns_map.family} />
            </div>
        </>
    );
};
const handleRowAction = row_obj => console.log(row_obj);

const handleScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    console.log(scrollTop, scrollHeight, clientHeight);
};

const stories = storiesOf('Data List', module);
stories.addDecorator(withKnobs);
stories.addParameters({ viewport: { defaultViewport: 'mobile2' } });

stories
    .add(
        'Basic usage',
        () => (
            <Theme is_dark={boolean('Theme', false)}>
                <div
                    style={{
                        margin: '20px auto',
                        width: '100%',
                        height: '100vh',
                    }}
                >
                    <DataList
                        className='container'
                        data_source={mock_data}
                        getRowSize={() => 72}
                        rowRenderer={rowRenderer}
                    />
                </div>
            </Theme>
        ),
        { notes }
    )
    .add(
        'Custom width',
        () => (
            <Theme is_dark={boolean('Theme', false)}>
                <div
                    style={{
                        margin: '20px auto',
                        width: '100%',
                        height: '100vh',
                    }}
                >
                    <DataList
                        className='container'
                        data_source={mock_data}
                        getRowSize={() => 72}
                        rowRenderer={rowRenderer}
                    />
                </div>
            </Theme>
        ),
        { notes }
    )
    .add(
        'With getRowAction',
        () => (
            <Theme is_dark={boolean('Theme', false)}>
                <div
                    style={{
                        margin: '20px auto',
                        width: '100%',
                        height: '100vh',
                    }}
                >
                    <DataList
                        className='container'
                        data_source={mock_data}
                        getRowSize={() => 72}
                        rowRenderer={rowRenderer}
                        getRowAction={handleRowAction}
                    />
                </div>
            </Theme>
        ),
        { notes }
    )
    .add(
        'With scroll',
        () => (
            <Theme is_dark={boolean('Theme', false)}>
                <div
                    style={{
                        margin: '20px auto',
                        width: '100%',
                        height: '100vh',
                    }}
                >
                    <DataList
                        className='container'
                        data_source={mock_data}
                        getRowSize={() => 72}
                        rowRenderer={rowRenderer}
                        onScroll={handleScroll}
                    />
                </div>
            </Theme>
        ),
        { notes }
    )
    .add(
        'With footer',
        () => (
            <Theme is_dark={boolean('Theme', false)}>
                <div
                    style={{
                        margin: '20px auto',
                        width: '100%',
                        height: '100vh',
                    }}
                >
                    <DataList
                        className='container'
                        data_source={mock_data}
                        getRowSize={() => 72}
                        rowRenderer={rowRenderer}
                        footer={{
                            name: 'All names here',
                            family: 'All families here',
                        }}
                    />
                </div>
            </Theme>
        ),
        { notes }
    );
