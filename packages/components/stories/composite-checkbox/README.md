# CompositeCheckbox Component

A checkbox with label and description.


## Usage

```jsx
import CompositeCheckbox from 'deriv-components';

const DummyComponent = props => (
  <CompositeCheckbox
        name='field-name'
        label='Label'
        description='Description'
        value={value}
        onChange={props.onChange}
    />
);
```

## Props

| Name                     | Type        | Default  | Description                                         |
| ------------------------ | ----------- | -------- | --------------------------------------------------- |
| name `*required`         | {string}    | null     | The name of the field                               |
| value `*required`        | {boolean}   | null     | Value of the checkbox                               |
| onChange `*required`     | {function}  | null     | A callback function that is called on value change  |
| className                | {string}    | null     | A classname for checkbox's container                |
| label `*required`        | {string}    | null     | Label of the checkbox                               |
| id                       | {string}    | null     | An id for checkobox field                           |
| description `*required`  | {string}    | null     | A description about checkbox field                  |


# Full example:

```jsx
import CompositeCheckbox from 'deriv-components';

const DummyComponent = props => (
  <CompositeCheckbox
        name='field-name'
        label='Label'
        description='Description'
        value={value}
        onChange={props.onChange}
        className='my-class'
        id='my-id'
    />
);
```
