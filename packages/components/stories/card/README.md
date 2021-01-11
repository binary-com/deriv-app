# Card Component

General card format component with header and footer to show items.


## Usage

```jsx
import Card from 'deriv-components';

const DummyComponent = props => (
  <Card
        content={'Main content'}
    />
);
```

## Props

| Name           | Type        | Default  | Description                         |
| -------------- | ----------- | -------- | ----------------------------------- |
| className      | {string}    | null     | The classname for the Card wrapper  |
| header         | {node}      | null     | A dom element for header            |
| renderHeader   | {function}  | null     | A function to render header         |
| content        | {node}      | null     | A dom element for content           |
| renderContent  | {function}  | null     | A function to render conten         |
| renderHeader   | {function}  | null     | A function to render header         |
| footer         | {node}      | null     | A dom element for footer            |
| footerContent  | {function}  | null     | A function to render footer         |


# Full example:

```jsx
import Card from 'deriv-components';

const DummyComponent = props => (
  <Card
        renderHeader={props.renderHeader}
        renderContent={props.renderContent}
        renderFooter={props.renderFooter}
        className='my-card__wrapper'
    />
);
```
