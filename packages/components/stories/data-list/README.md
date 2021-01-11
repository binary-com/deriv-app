# DataList component
A component to show data in a list on mobile.

#### Supported events:
- onScroll
- onRowsRendered

## Usage
 
```jsx
import { DataList } from 'deriv-components';

const DummyComponent = (props) => (
    <DataList
        data_source={props.data_source}
        rowRenderer={props.rowRenderer} 
    />
)
```

## Props

| Name            | Type        | Default  | Description                                                                            |
| --------------- | ----------- | -------- | -------------------------------------------------------------------------------------- |
| className       | {string}    | null     | Class name for component's container                                                   |
| data_source     | {array}     | null     | Data to show                                                                           |
| footer          | {object}    | null     | Custome footer for table                                                               |
| getRowAction    | {function}  | null     | A function to set an action for clicking on rows. It could be a link or a description  |
| getRowSize      | {function}  | null     | A function to set height of each row                                                   |
| keyMapper       | {function}  | null     | A function to set a key for each row                                                   |
| onScroll        | {function}  | null     | A callback function for scroll                                                         |
| row_gap         | {number}    | null     | Margin between rows                                                                    |
| rowRenderer     | {function}  | null     | A function to render each row                                                          |
| setListRef      | {function}  | null     | A function to set ref to the list                                                      |
| onRowsRendered  | {function}  | null     | A prop from `react-virtualized/dist/es/List` plugin                                    |


## Full example:

```jsx
import { DataList } from 'deriv-components';

const DummyComponent = (props) => (
    <DataList 
        className='my-class'    
        data_source={props.data_source}   
        footer={<div>Footer</div>}        
        getRowAction={props.getRowAction}  
        getRowSize={() => 75}    
        keyMapper={props.keyMapper}     
        onScroll={props.onScroll}      
        row_gap={20}       
        rowRenderer={props.rowRenderer}   
        setListRef={props.setListRef}    
        onRowsRendered={props.onRowsRendered}
    />
)
```
