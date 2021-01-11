# DataTable component
A component to show data in a table.

#### Supported events:
- onScroll

## Usage
 
```jsx
import { DataTable } from 'deriv-components';

const DummyComponent = (props) => (
    <DataTable
        columns={props.columns} 
        data_source={props.data_source} />
)
```

## Props

| Name          | Type           | Default  | Description                                                                            |
| ------------- | -------------- | -------- | -------------------------------------------------------------------------------------- |
| className     | {string}       | null     | Class name for component's container                                                   |
| children      | {node\|array}  | null     |                                                                                        |
| data_source   | {array}        | null     | Data to show                                                                           |
| footer        | {object}       | null     | Custome footer for table                                                               |
| getRowAction  | {function}     | null     | A function to set an action for clicking on rows. It could be a link or a description  |
| getRowSize    | {function}     | null     | A function to set height of each row                                                   |
| onScroll      | {function}     | null     | A callback function for scroll                                                         |


## Full example:

```jsx
import { DataTable } from 'deriv-components';

const DummyComponent = (props) => (
    <DataTable 
        className='my-class'    
        data_source={props.data_source}   
        footer={<div>Footer</div>}        
        getRowAction={props.getRowAction}  
        getRowSize={() => 75}  
        onScroll={props.onScroll}
    >
        <Loading is_loading={is_loading} />
    </DataTable>
)
```
