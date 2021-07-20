# `@deriv/shared`

> Responsible for the shared utilities and styles for all packages.

**In this document**

-   [Commands](#commands)
-   [Usage](#Usage)
    -   [Base styles](base-styles)
        -   [Resources loader](#resources-loader)
        -   [Browser css reset](#browser-css-reset)
        -   [Google fonts](#google-fonts)
    -   [ Utility functions](#utility-functions)

## Commands

Setup:

```sh
lerna bootstrap
```

Serve:

```sh
npm run serve
```

Build :

```sh
npm run build
```

Test:

```sh
npm run test
```

## Usage

### Base styles

#### Resources loader

For Fonts, Constants, Mixins, Themes, Devices:

1. Run `npm i sass-resources-loader --save-dev`
2. Add the following in your webpack css loader

```js {
    loader: 'sass-resources-loader',
    options: {
        resources: require('@deriv/shared/src/styles/index.js'),
    }
}
```

#### Browser css reset

```scss
@import @deriv / shared/utils/styles/reset.scss;
```

#### Google fonts

```scss
@import @deriv / shared/utils/styles/google-fonts.scss;
```

### Utility functions

```js
import { toMoment } '@deriv/shared'
```
