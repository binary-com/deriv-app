# Numpad Component

A component to have a virtual numpad for mobile.

## Usage

```jsx
import Numpad from 'deriv-components';

const DummyComponent = props => (
  <Numpad
    value={value}
    onValidate={ num => num < 120 && num > 110}
  />
);
```

## Props

| Name                    | Type              | Default  | Description                                                                        |
| ----------------------- | ----------------- | -------- | ---------------------------------------------------------------------------------- |
| currency                | {string}          | null     | Type of the `currency`                                                             |
| format                  | {function}        | null     | A function to format the output                                                    |
| is\_currency            | {boolean}         | null     | Set to `true` if the value is a currency and you need to support decimals          |
| is\_regular             | {boolean}         | null     | Enables default value                                                              |
| is\_submit\_disabled    | {boolean}         | null     | Disables submit button                                                             |
| reset\_press\_interval  | {number}          | null     | Time between two press of backspace button in milliseconds, that resets the value  |
| max                     | {number}          | null     | The maximum value that user can enter                                              |
| min                     | {number}          | null     | The minimum value that user can enter                                              |
| onSubmit                | {function}        | null     |                                                                                    |
| onValidate              | {function}        | null     | You can check the value using a function and return `false` if value is not valid  |
| pip\_size               | {number}          | null     | This is required when you use currency type                                        |
| render                  | {function}        | null     | Renders the given dom inside the input field                                       |
| reset\_value            | {string\|number}  | null     | The default value when value is reset                                              |
| submit\_label           | {string}          | OK       | Submit button's text                                                               |
| value                   | {number}          | null     | The value of the field                                                             |


# Full example:

```jsx
import Numpad from 'deriv-components';

const DummyComponent = props => (
  <Numpad
    currency={props.currency}            
    format={props.format}              
    is_currency         
    is_regular        
    is_submit_disabled 
    reset_press_interval={200}
    max={1000}                 
    min={100}                 
    onSubmit={props.onSubmit}            
    onValidate={props.onValidate}          
    pip_size={2}            
    render={<div className='my-class'>{props.value}</div>}              
    reset_value={100}         
    submit_label='OK'        
    value={props.value}               
  />
);
```
