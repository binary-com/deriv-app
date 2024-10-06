# `@deriv/translations`

-   Extract new string translations to Crowdin.
-   Staging/dev branch is the source of truth for strings that should be translated.
-   React i18next configuration and translation components.

<br />

Push and pull Crowdin translations actions will automatically extract strings from the Deriv.app repo and upload them to Crowdin. It will also check whether Crowdin has new translations available, and if so, it will automatically download these translations and create a PR to Deriv.app's `master` branch to merge them in. For more information you can check [here](https://github.com/deriv-com/deriv-app/blob/master/.github/workflows/push_and_pull_crowdin_translations.yml)

<br />

**In this document**

-   [Requirements](#requirements)
-   [Extracting translations](#extracting-translations)
    -   [Setup](#setup)
    -   [Translate](#translate)
-   [Project translations](#project-translations)
    -   [Setup](#setup)
    -   [Usage](#usage)
-   [FAQ](#faq)

## Requirements:

-   Crowdin CLI: download here: https://support.crowdin.com/cli-tool/#installation
-   `CROWDIN_API_KEY` environment variables to your `~/.bash_profile`
-   remote `origin` should be your fork
-   remote `upstream` should be the source repository (e.g. `git@github.com:deriv-com/deriv-app.git`)

## Extracting translations

### Setup

Add the Crowdin API key to your ~/.bash_profile

```sh
   $ echo "export CROWDIN_API_KEY='apikeyhere'" >> ~/.bash_profile
   $ source ~/.bash_profile
```

### Translate

To update strings to be translated in Crowdin

```sh
   $ npm run translate
```

## Project translations

-   This project uses [react-i18next](https://react.i18next.com)

### Setup

-   initialize translations in root app.jsx by importing and calling initializeTranslations
-   in `app.jsx`:

```jsx
    import { initializeTranslations } from '@deriv/translations';
    ...
    initializeTranslations()
```

### Usage

-   For strings use either `localize(...)` or `<Localize />`
-   [`<Localize />`](https://react.i18next.com/latest/trans-component) example:

```jsx
import { Localize } from '@deriv/translations';

<Localize
    i18n_default_text='You cannot use your real money account with {{website_name}} at this time.'
    values={{ website_name }}
/>;
```

-   localize example:

```jsx
import { localize } from '@deriv/translations';

<h4 className='drawer__notifications-header'>{localize('all notifications')}</h4>;
```

>

## FAQ:

-   This package includes all Crowdin configuration
-   Crowdin source translation file --> crowdin/messages.json
-   Source for the translated strings in the project --> src/translations/fr|en|id....json
