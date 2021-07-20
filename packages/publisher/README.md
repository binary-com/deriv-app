# Description

**A tool that will help publish hybrid Deriv packages to the NPM registry.**

A hybrid package is a package that is both built as part of the Deriv App, but can also be published to the NPM registry by itself.

**In this document**

-   [How it works](#how-it-works)
-   [Example](#example)
-   [Install](#install)

## How it works

The `@deriv/publisher` package exposes two things:

-   An executable script that can be wrapped around your package's publish commands.
-   A couple of Webpack utilities that will help set the correct `alias` and `externals` in the Webpack config.

The executable script (exposed as `deriv-publisher`) takes a single argument (either `prepublish` or `postpublish`).

-   `prepublish`: The script will remove any local `@deriv` packages from the `package.json` so they will not be added as `dependencies` when pushed to the NPM registry. This won't break the code granted the Webpack utilities are set up in the Webpack config.
-   `postpublish`: The script will restore any local `@deriv` packages to the `package.json`.

The Webpack utilities help Webpack resolve imports to any local `@deriv` dependencies:

-   `getLocalDerivPackageAliases`: returns an object of aliases when creating a build for publishing, i.e. it will tell Webpack to ignore the `node_modules` and tells it where to look instead.
-   `getLocalDerivPackageExternals`: returns an object of externals when creating a build that won't be published, i.e. it will tell Webpack to not bundle these packages as they will be included by the consumer of this package.

## Example

Below is a simple example that could easily be extended.

-   Please note the `;` after `npm publish`. This `;` ensures that the `postpublish` logic is called regardless of the outcome of `npm publish`, this is required to restore the original `package.json`.

```JSON
{
  "scripts": {
    "publish_package": "deriv-publisher prepublish && npm publish; deriv-publisher postpublish"
  }
}
```

## Install

```
lerna exec --scope=@deriv/package -- npm i @deriv/publisher@^v0.0.1-beta4 --save-dev
```
