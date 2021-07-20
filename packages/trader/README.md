# Deriv App

This repository contains the static HTML, Javascript, CSS, and images content of the [Deriv](http://app.deriv.com) website.

**In this document**

-   [Other documents](#other-documents)
-   [Installation](#installation)
-   [How to work with this project](#how-to-work-with-this-project)
    -   [Deploy to your gh-pages for the first time](#deploy-to-your-gh-pages-for-the-first-time)
    -   [Deploy to the root of the gh-pages](#deploy-to-the-root-of-the-gh-pages)
    -   [Clean root and deploy to it](#clean-root-and-deploy-to-it)
    -   [Deploy to test folder](#deploy-to-test-folder)
    -   [Preview on your local machine](#preview-on-your-local-machine)
-   [Miscellaneous](#Miscellaneous)
-   [Selenium tests](#selenium-tests)
-   [Release](#release)
    -   [Staging](#staging)
    -   [Production](#production)

## Other documents

-   [Modules docs](docs/Modules/README.md) - Contains implementation guides (i.e., scaffolding, code usage)

## Installation

In order to work on your own version of the Deriv Javascript and CSS, please **fork this project**.

You will also need to install the following on your development machine:

-   Node.js (10.14.2 or higher is recommended) and NPM (see <https://nodejs.org/en/download/package-manager/>)
-   Go to project root, then run `npm install`

### Use a custom domain

In order to use your custom domain, please put it in a file named `CNAME` inside `scripts` folder of your local clone of deriv-app.

## How to work with this project

### Deploy to your gh-pages for the first time

1.  Register your application [here](https://developers.binary.com/applications/). This will give you the ability to redirect back to your github pages after login.
    Use `https://YOUR_GITHUB_USERNAME.github.io/deriv-app/` for the Redirect URL and `https://YOUR_GITHUB_USERNAME.github.io/deriv-app/en/redirect` for the Verification URL.

        If you're using a custom domain, replace the github URLs above with your domain and remove the `deriv-app` base path.

2.  In `src/config.js`: Insert the `Application ID` of your registered application in `user_app_id`.

    -   **NOTE:** In order to avoid accidentally committing personal changes to this file, use `git update-index --assume-unchanged src/config.js`

3.  Set `NODE_ENV` to `development` with `export NODE_ENV=development`

4.  Run `npm run deploy:clean`

### Deploy to the root of the gh-pages

This will overwrite modified files and only clear the content of `js` folder before pushing changes. It will leave other folders as they are.

```sh
npm run deploy
```

### Clean root and deploy to it

This removes all files and folders and deploys your `dist` folder to the root.

```sh
npm run deploy:clean
```

### Deploy to test folder

This will add all your changes to the test folder specified.
Please ensure it is prefixed with `br_`.

```sh
npm run deploy:folder "br_my_test_folder"
```

### Preview on your local machine

-   Edit your `/etc/hosts` file to include this domain:

```
127.0.0.1   localhost.binary.sx
```

-   To preview your changes locally for the first time, run `sudo npm start`:
    -   It will run all tests, compile all CSS, and JS/JSX as well as watch for further js/jsx/css changes and rebuild on every change you make.
-   To preview your changes locally without any tests, run `npm run serve`
    -   It will watch for JS/JSX/CSS changes and rebuild on every change you make.
-   To run all tests, run `npm run test`

## Miscellaneous

-   In Webstorm, right-click on `src`, hover over `Mark directory as`, and click `Resource root` to enable import alias resolution.

## Selenium tests

Elements for selenium test purposes should have `id` attributes, with the value of `dt_[element_name]_[unique_name|id]_[element_type]`. (e.g. `dt_settings_dark_button`)

## Release

### Staging

_Ensure you have a remote with the name of `origin` pointing to the [deriv-app](https://github.com/binary-com/deriv-app) repo, and that you are on the `dev` branch._

1. Navigate to the root of the project.
2. Run `./scripts/release-staging.sh`

### Production

_Ensure you have a remote with the name of `origin` pointing to the [deriv-app](https://github.com/binary-com/deriv-app) repository, and `production` pointing to the [deriv-app-production](https://github.com/binary-com/deriv-app-production) repo, and that you are on the `master` branch._

1. Navigate to the root of the project.
2. Run `./scripts/release-prod.sh`
