# TickProgress component
A component to show progress in rows and columns.

## Usage
 
```jsx
import { TickProgress } from 'deriv-components';

const DummyComponent = (props) => (
    <TickProgress 
        value={props.value} 
        rows={2} 
        columns={10} 
        size={20} 
    />
)
```

## Props

| Name       | Type      | Default  | Description                           |
| ---------- | --------- | -------- | ------------------------------------- |
| className  | {string}  | null     | Class name for component's container  |
| columns    | {string}  | null     | Number of columns                     |
| value      | {string}  | null     |                                       |
| rows       | {string}  | null     | Number of rows                        |
| size       | {string}  | null     | Size of progress                      |


## Full example:

```jsx
import { TickProgress } from 'deriv-components';

const DummyComponent = (props) => (
    <TickProgress 
        className='my-class'
        value={props.value} 
        rows={2} 
        columns={10} 
        size={20} 
    />
)
```
