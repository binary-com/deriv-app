# StaticUrl component

Use this component to generate a link to 'deriv.com'.

#### Supported events:

All events supported for an '\<a>' tag.

## Usage

```jsx
import { StaticUrl } from 'deriv-components';

const DummyComponent = props => <StaticUrl href={'about'}>Static Url link.</StaticUrl>;
```

## Props

| Name        | Type      | Default | Description                                            |
| ----------- | --------- | ------- | ------------------------------------------------------ |
| href        | {string}  | null    | Name of the static page on 'deriv.com'                 |
| is_document | {boolean} | null    | Set it to 'true' to get a normalized path for the link |

## Full example:

```jsx
import { SwipeableWrapper } from 'deriv-components';

const DummyComponent = props => (
    <StaticUrl href={'about'} is_document>
        Static Url link to a document.
    </StaticUrl>
);
```
