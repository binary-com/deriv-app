# Toast Component

Toasts are lightweight notifications to show an error or information to visitors.

## Usage

```jsx
import Toast from 'deriv-components';

const DummyComponent = props => (
    <Theme>
        <Toast>Message to be shown!</Toast>
    </Theme>
);
```

## Props

| Name      | Type       | Default | Description                                |
| --------- | ---------- | ------- | ------------------------------------------ |
| className | {string}   | null    | The classname for the Toast                |
| is_open   | {boolean}  | true    | Define whether the toast is visible or not |
| onClick   | {function} | null    | A function to visible toast                |
| onClose   | {function} | null    | A function to hide toast                   |
| type      | {string}   | 'info'  | Type of the message, one Of 'error' or info'|
| timeout   | {number}   | 0       | Timeout in milliseconds                    |

# Full example:

```jsx
import Toast from 'deriv-components';

const DummyComponent = props => (
    <Toast is_open={boolean('is open?', true)} timeout={number('Timeout', 3000)} onClose={console.log('Closed')}>
        Message
    </Toast>
);
```
