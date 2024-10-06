# Components

Reusable UI components for Deriv.

[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@main/badge/badge-storybook.svg)](@)

**In this document**

-   [Commands](#commands)
-   [Storybook](#storybook)
-   [Usage](#usage)

## Commands

Setup:
The `npm run bootstrap` command should be run in the root of the project, because it does not exist in the components package.js

```sh
npm run bootstrap
```

Build:
The `npm run build` command is used to build the components package. It can be run both in the root directory (to build the entire project) and in the components directory (to build the components package)

```sh
npm run build
```

> The following commands should executed inside of the components directory not in the root of the project.

Serve:
The `npm run serve` command is used to serve the components package

```sh
npm run serve
```

Test:
The `npm run test` command is used to check whether the icon names are valid in the components package

```sh
npm run test
```

Test:
The `npm run test:eslint` command is used to run eslint on the components package

```sh
npm run test:eslint
```

The `eslint .` command is used to run eslint on the components package. It should be used along with `npm run test:eslint`

```sh
eslint .
```

## Storybook

-   [`Storybook`](https://github.com/deriv-com/deriv-app/blob/master/storybook/README.md)

The `npm run storybook` command is used to start storybook within the components package

```shell script
npm run storybook
```

The `npm run storybook:build` command is used to build storybook within the components package

storybook:build:

```sh
npm run storybook:build
```

The `npm run storybook:deploy br_storybook` command is used to deploy storybook within the components package to the specified branch. In this case, br_storybook

storybook:deploy:

```sh
npm run storybook:deploy br_storybook
```

## Usage

You can import individual components with ES6 named imports.

```tsx
import { Button } from '@deriv/components';

const SomeComponent = () => (
    <Button is_disabled primary>
        Hello World
    </Button>
);
```

> NOTE: While developing new components, be mindful that import the direct `.tsx` file, instead of referencing `../component/index.ts`. This will make sure there won't be a style bleed
> When it is imported from other packages.
