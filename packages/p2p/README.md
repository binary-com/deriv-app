<h1 align="center">
  @deriv/p2p
</h1>

**In this document**

-   [Pre-installation](#pre-installation)
-   [Editor helpers](#editor-helpers)
-   [Quick start](#quick-start)

## Pre-installation

-   node
-   npm

## Editor helpers

-   Prettier setup in your editor https://prettier.io/
-   Stylelint setup in your editor https://stylelint.io/
-   Eslint setup in your editor https://eslint.org/

## Quick start

1.  **Install your dependencies:**

    ```sh
    npm ci
    ```

2.  **To build publish file:**

    ```sh
    npm run build
    ```

3.  **Libary usage:**

    ```js
    import P2P from '@deriv/p2p';

    <P2P />;
    ```

4.  **File Structure**

```
src
    ├── components/
    │   ├── ads/
    │   │   ├── ads.js
    │   │   ├── ads.scss
    │   ├── orders/
    │   │   ├── orders.js
    │   │   ├── orders.scss
    │   ├── ...
    │   └── app.jsx
    ├── utils/
    │   ├── timer.js // TODO
    │   ├── ...
    ├── index.js

index.js // publish file
webpack.config.js
package.json
```

5. **Translations**

Update translations in Crowdin and get new translations from Crowdin

Requirements:

-   Crowdin CLI: https://support.crowdin.com/cli-tool/#installation
-   `CROWDIN_API_KEY` environment variables to your `~/.bash_profile`

1. Run the script below

```sh
    sh scripts/update-translations.sh
```

-   Extracts new translations strings and pushes them to Crowdin
-   Fetches new translations strings from Crowdin

2.  Make a PR from the newly created branch `p2p_translations` to dev
