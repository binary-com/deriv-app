# End to end testing

[Prerequisite](https://img.shields.io/badge/node-%3E%3D14.15.4-blue.svg)

**In this document:**

-   [Quick start](#quick-start)
-   [Usage](#usage)
    -   [Create a browser](#create-a-browser)
    -   [Creating a page](#creating-a-page)

## 🚀 Quick start

1.  **Install your dependencies:**

    ```sh
    npm run bootstrap
    ```

2.  **Configure `.env` file:**

        - Create a `.env` file in the root folder
        - Copy the contents from `.env.example` to it
        - Fill the essential values

    <br/>

3.  **Run tests:**

    ```sh
    npm run test:qa
    ```

    ```sh
    npm run test:performance
    ```

4.  **Create new test:**

    ```sh
    cd e2e_tests && npm run create_test {category_name} {test_name}
    ```

5.  **File Structure**

    ```
    src
        ├── __tests__/
        │   ├── [category_name]/
        |       ├── [test_name].test.js
        ├── _config/
        ├── _utils/
        ├── objects/
        ├── bootstrap.js
    ```

6.  **Playwright documents:**
    We use [playwright](https://playwright.dev/) to run our tests so it's very useful to take a look at [this](https://playwright.dev/docs/intro) documentation.

---

## Usage:

### Create a browser

    You can setup a browser with mobile or desktop viewport before runing each test starts and tear down the browser after runing each test like this:

    ```JS
    const { setUp, tearDown, desktop_viewport, mobile_viewport } = require('@root/bootstrap');

    beforeEach(async () => {
        const out = await setUp(mobile_viewport); // for mobile viewport
        const out = await setUp(desktop_viewport); // for desktop viewport
    });

    afterEach(async () => {
        await tearDown(browser);
    });

    test('It shouls pass', () => {
        // your test logic
    });

    ```

### Creating a page

    You can create a page and navigate to `Home_Page` like this:

    ```JS
    const { browser, context } = await setUp(mobile_viewport);
    await context.addInitScript(replaceWebsocket);
    const page = new Common(await context.newPage());
    await page.navigate(); // navigate to HOME_URL (process.env.HOME_URL)

    ```

    Now, you can use all helper functions in `@root/objects/common.js` to perform actions to the created page. Also, read [this](https://playwright.dev/docs/api/class-page) documentation to see more provided methods.
