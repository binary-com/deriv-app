# Components

Reusable UI components for Deriv.

[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@main/badge/badge-storybook.svg)](@)

**In this document**

-   [Other documents](#other-documents)
-   [Commands](#commands)
-   [Storybook](#storybook)
-   [Usage](#usage)

## Other documents

-   [General](docs/README.md) - Contains general philosophy and overview of this package
-   [Modules docs](docs/Modules/README.md) - Contains implementation guides (i.e., scaffolding, code usage)

## Commands

Setup:

```sh
lerna bootstrap
```

Serve:

```sh
npm run serve
```

Build:

```sh
npm run build
```

Test:

```sh
npm run test
```

## Storybook

-   [`Storybook`](https://github.com/binary-com/deriv-app/blob/master/storybook/README.md)

```shell script
npm run storybook
```

storybook:build:

```sh
npm run storybook:build
```

storybook:deploy:

```sh
npm run storybook:deploy br_storybook
```

## Usage

You can import individual components with ES6 named imports.

```jsx
import { Button } from '@deriv/components';

const SomeComponent = () => (
    <Button is_disabled primary>
        Hello World
    </Button>
);
```

> NOTE: While developing new components, be mindful that import the direct `.jsx` file, instead of referencing `../component/index.js`. This will make sure there won't be a style bleed
> When it is imported from other packages.
