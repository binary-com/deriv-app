const { waitForWSSubset } = require('@root/_utils/websocket');

class Common {
    constructor(page) {
        this.page = page;

        // Call Page methods whenever it is not existed in the Common class
        return new Proxy(this, {
            get(target, field) {
                if (field in target) return target[field];
                if (field in page) return page[field];
                return undefined;
            },
            apply(target, field, argumentList) {
                if (target[field]) return target[field](...argumentList);
                if (page[field]) return page[field](...argumentList);
                return undefined;
            },
        });
    }

    /**
     * Accept cookie banner
     *
     * @returns {Promise<void>}
     */
    async acceptCookies() {
        await this.page.waitForSelector('.cookie-banner__btn-accept');
        await this.page.click('.cookie-banner__btn-accept');
    }

    /**
     * Switch to Virtual Account
     *
     * @returns {Promise<void>}
     */
    async switchVirtualAccount() {
        await this.waitForAccountInfoDropdown();
        await this.clickOnAccountInfoDropdown();
        await this.page.click('#demo_account_tab');
        await this.page.click('.acc-switcher__accounts');
    }

    async waitForAccountInfoDropdown() {
        await this.page.waitForSelector('.acc-info__preloader', { state: 'hidden' });
        await this.page.waitForSelector(
            '.header__menu-items > .header__menu-right > .acc-info__container > .acc-info__wrapper > .acc-info'
        );
    }

    async clickOnAccountInfoDropdown() {
        await this.page.click(
            '.header__menu-items > .header__menu-right > .acc-info__container > .acc-info__wrapper > .acc-info'
        );
    }

    /**
     * Set the Endpoint
     */
    async setEndpoint(url, endpoint_server, app_id) {
        await this.page.goto(`${url}/endpoint`);
        await this.page.fill('[name="server"]', endpoint_server);
        await this.page.fill('[name="app_id"]', app_id);
        await this.page.press('[name="app_id"]', 'Tab');
        await this.page.waitForSelector('text=Submit');
        await this.page.click('text=Submit');
        await this.page.waitForLoadState('load');
        await this.saveState('LOGIN');
    }

    /**
     * Login into the page using credentials
     * @param email
     * @param password
     * @returns {Promise<void>}
     */
    async login(email, password) {
        await this.page.waitForSelector('#dt_login_button');
        await this.page.click('#dt_login_button');
        await this.page.click('[name="email"]');
        await this.page.fill('[name="email"]', email);
        await this.page.fill('[name="password"]', password);
        await this.page.click('.button');
        await this.page.waitForLoadState('domcontentloaded');
        const grant = await this.page.evaluate('document.querySelector("#btnGrant")');

        if (grant) {
            await this.page.click('#btnGrant');
            await this.page.waitForLoadState('domcontentloaded');
        }

        await this.saveState('LOGIN');
    }

    async loadOrLogin(email, password, context, POM) {
        const is_login_done = this.checkIfStateExists('LOGIN');
        if (!is_login_done) {
            await this.login(email, password);
        } else {
            context = await this.setState('LOGIN', context, POM);
            await this.page.navigate();
        }
        return context;
    }

    async saveState(target) {
        const storage = await this.page.context().storageState();
        process.env[target] = JSON.stringify(storage);
    }
    async setState(target, context, POM) {
        const storageState = JSON.parse(process.env[target]);
        const new_context = await context.browser().newContext({ storageState });
        // Try to reuse the same Page Object Model
        if (POM) {
            this.page = new POM(await context.newPage());
        } else {
            this.page = new Common(await context.newPage());
        }
        await this.page.navigate();

        return new_context;
    }

    async isMobile() {
        const { width } = await this.page.viewportSize();

        return width < 400;
    }

    async navigate() {
        await this.blockExternals();
        if (process.env.QA_SETUP === 'true') {
            await this.connectToQA();
        }
        await this.page.goto(process.env.HOME_URL);
    }

    async connectToQA() {
        await this.bypassDuo();
        await this.setEndpoint(process.env.HOME_URL, process.env.QABOX_SERVER, process.env.QABOX_APP_ID);
    }

    async bypassDuo() {
        await this.page.goto(`https://${process.env.QABOX_SERVER}`);
        try {
            await this.page.$eval('text=Welcome to nginx', el => el.textContent);
            return;
        } catch (e) {
            await this.page.waitForSelector('text=We need to verify your identity');
            await this.page.waitForSelector('#user_name');
            await this.page.click('#user_name');
            await this.page.fill('#user_name', process.env.QABOX_DUO_EMAIL);

            await this.page.waitForSelector('#password');
            await this.page.click('#password');
            await this.page.fill('#password', process.env.QABOX_DUO_PASSWORD);

            await this.page.waitForSelector('#duo_code');
            await this.page.click('#duo_code');
            await this.page.fill('#duo_code', process.env.QABOX_DUO_CODE);

            await this.page.waitForSelector('.body > center > .main_widget > .input_form > .login_button');
            await this.page.click('.body > center > .main_widget > .input_form > .login_button');

            await this.page.waitForSelector('text=Welcome to nginx');
        }
    }

    async waitForAccountDropdown() {
        await this.page.waitForSelector('.acc-info__container');
    }

    async setResidenceAndPassword(signup_url, country = 'Indonesia', password) {
        await this.page.goto(signup_url);
        if (await this.isMobile()) {
            await this.page.waitForSelector(
                '.account-signup__residence-selection > .dc-select-native > .dc-select-native__wrapper > .dc-input > .dc-select-native__picker'
            );
            await this.page.click(
                '.account-signup__residence-selection > .dc-select-native > .dc-select-native__wrapper > .dc-input > .dc-select-native__picker'
            );

            await this.page.selectOption(
                '.account-signup__residence-selection > .dc-select-native > .dc-select-native__wrapper > .dc-input > .dc-select-native__picker',
                country
            );

            await this.page.waitForSelector(
                '.account-signup__residence-selection > .dc-select-native > .dc-select-native__wrapper > .dc-input > .dc-select-native__picker'
            );
            await this.page.click(
                '.account-signup__residence-selection > .dc-select-native > .dc-select-native__wrapper > .dc-input > .dc-select-native__picker'
            );

            await this.page.waitForSelector('text=Next');
            await this.page.click('text=Next');

            await this.page.waitForSelector(
                '.account-signup__password-selection > .dc-password-meter__container > .dc-password-input > .dc-input > .dc-input__field'
            );
            await this.page.click(
                '.account-signup__password-selection > .dc-password-meter__container > .dc-password-input > .dc-input > .dc-input__field'
            );
            await this.page.fill(
                '.account-signup__password-selection > .dc-password-meter__container > .dc-password-input > .dc-input > .dc-input__field',
                password
            );

            await this.page.waitForSelector('text=Start trading');
            await this.page.click('text=Start trading');
            await this.waitForAccountDropdown();
        } else {
            await this.page.waitForSelector(
                '#deriv_app > div.dc-dialog__wrapper.dc-dialog__wrapper--enter-done > div > div.dc-dialog__content.dc-dialog__content--centered > div > form > div > div > div > div > input'
            );
            await this.page.fill(
                '#deriv_app > div.dc-dialog__wrapper.dc-dialog__wrapper--enter-done > div > div.dc-dialog__content.dc-dialog__content--centered > div > form > div > div > div > div > input',
                country
            );
            await this.page.press(
                '#deriv_app > div.dc-dialog__wrapper.dc-dialog__wrapper--enter-done > div > div.dc-dialog__content.dc-dialog__content--centered > div > form > div > div > div > div > input',
                'Enter'
            );
            await this.page.click('text=Next');

            await this.page.waitForSelector('input[type=password]');
            await this.page.click('input[type=password]');
            await this.page.fill('input[type=password]', password);

            await this.page.waitForSelector(
                '.dc-dialog__content > .account-signup > form > .account-signup__password-selection > .dc-btn'
            );
            await this.page.click(
                '.dc-dialog__content > .account-signup > form > .account-signup__password-selection > .dc-btn'
            );
        }
        await waitForWSSubset(this.page, {
            authorize: {},
        });
        await this.saveState('VIRTUAL')
    }

    async realAccountSignup(options) {
        if (await this.isMobile()) {
            await this.page.waitForSelector('#modal_root');
            await this.page.waitForSelector(
                '#modal_root > div > div > div > div.welcome__body > div > div > nav.dc-carousel__nav.dc-carousel__nav--lower > ul > li:nth-child(2)'
            );
            await this.page.mouse.move(180, 220);
            await this.page.mouse.down();
            await this.page.mouse.move(320, 220);
            await this.page.mouse.up();
            await this.page.click('text=Start here');
        } else {
            await this.page.waitForSelector(
                '.dc-themed-scrollbars > .welcome__body > .welcome-column--right > .welcome-column__footer > .dc-btn'
            );
            await this.page.click(
                '.dc-themed-scrollbars > .welcome__body > .welcome-column--right > .welcome-column__footer > .dc-btn'
            );
        }

        await this.page.waitForSelector(
            '.header__menu-items > .header__menu-right > .acc-info__container > .acc-info__wrapper > .acc-info'
        );
        await this.page.click(
            '.header__menu-items > .header__menu-right > .acc-info__container > .acc-info__wrapper > .acc-info'
        );

        await this.page.waitForSelector('#real_account_tab');
        await this.page.click('#real_account_tab');

        await this.page.waitForSelector(
            '.acc-switcher__list-wrapper > .dc-content-expander__wrapper:nth-child(1) > .dc-content-expander__content > .acc-switcher__new-account > .dc-btn'
        );
        await this.page.click(
            '.acc-switcher__list-wrapper > .dc-content-expander__wrapper:nth-child(1) > .dc-content-expander__content > .acc-switcher__new-account > .dc-btn'
        );
        await this.page.waitForSelector(`text=${options.currency}`);
        await this.page.click(`text=${options.currency}`);
        await this.page.waitForSelector('text=Next');
        await this.page.click('text=Next');

        await this.fillPersonalDetails();
        await this.fillAddressDetails();
        await this.fillTermsAndConditions();
        await this.waitForAccountDropdown();
        await this.removeLoginState('VIRTUAL');
        await this.saveState('REAL');
    }

    async fillTermsAndConditions() {
        await this.page.waitForSelector('text=Terms of use');
        const elementHandle = await this.page.$('text=I agree');
        await elementHandle.scrollIntoViewIfNeeded();
        await this.page.waitForSelector('text=I am not a PEP, and I have not been a PEP in the last 12 months.');
        await this.page.click('text=I am not a PEP, and I have not been a PEP in the last 12 months.');
        if (await this.isMobile()) {
            await this.page.click('//html/body/div[2]/div/div/div[2]/div/div/div[2]/form/div[1]/div[5]/label/span[1]');
        } else {
            await this.page.click('//html/body/div[2]/div/div/div[2]/div[2]/form/div[1]/div/div[5]/label/span[1]');
        }

        await this.page.waitForSelector('text=Add Account');
        await this.page.click('text=Add Account');
    }

    async fillAddressDetails() {
        await this.page.waitForSelector('text=Complete your address details');
        await this.invalidInput('address_line_1', 'alphanum');
        await this.invalidInput('address_city', 'alphanum');
        await this.page.fill('input[name=address_line_1]', 'Wolf St, QA WOLF');
        await this.page.fill('input[name=address_city]', 'Wolftown');
        await this.page.waitForSelector('text=Next');
        await this.page.click('text=Next');
    }

    async fillPersonalDetails() {
        await this.page.waitForSelector('text=Complete your personal details');
        // Invalid data assertions
        await this.invalidInput('first_name');
        await this.invalidInput('last_name');
        await this.invalidInput('phone', 'phone');
        await this.invalidInput('date_of_birth', 'date');

        // Valid data assertions
        await this.page.fill('input[name=first_name]', 'John');
        await this.page.fill('input[name=last_name]', 'Doe');
        await this.page.fill('input[name=phone]', '+62 335 000000');
        if (await this.isMobile()) {
            await this.page.fill('input[name=date_of_birth]', '2000-01-01');
        } else {
            await this.page.waitForSelector('input[name="date_of_birth"]');
            await this.page.click('input[name="date_of_birth"]');
            await this.page.waitForSelector('.dc-calendar');
            await this.page.click('[data-year="2001"]');
            await this.page.waitForSelector('[data-month=Feb]');
            await this.page.click('[data-month=Feb]');
            await this.page.waitForSelector('[data-date="2001-02-01"]');
            await this.page.click('[data-date="2001-02-01"]');
        }

        await this.page.waitForSelector('text=Next');
        await this.page.click('text=Next');
    }

    async invalidInput(selector, type = 'general') {
        await this.page.waitForSelector(`input[name=${selector}]`);
        // Invalid data assertions
        switch (type) {
            case 'alphanum':
                await this.page.waitForSelector(`input[name=${selector}]`);
                await this.page.click(`input[name=${selector}]`);
                await this.page.press(`input[name=${selector}]`, 'Tab');
                await this.page.waitForSelector('text=is required');
                return Promise.resolve();
            case 'general':
                await this.page.waitForSelector(`input[name=${selector}]`);
                await this.page.click(`input[name=${selector}]`);
                await this.page.press(`input[name=${selector}]`, 'Tab');
                await this.page.waitForSelector('text=is required');
                await this.page.fill(`input[name=${selector}]`, '123456789012345');
                await this.page.press(`input[name=${selector}]`, 'Tab');
                await this.page.waitForSelector('text=Only letters');
                return Promise.resolve();
            case 'phone':
                await this.page.waitForSelector(`input[name=${selector}]`);
                await this.page.fill(`input[name=${selector}]`, 'asdfghjkl');
                await this.page.click(`#modal_root`);
                await this.page.waitForSelector('text=is not in a proper format');
                return Promise.resolve();
            case 'date':
                if (await this.isMobile()) {
                    await this.page.waitForSelector(`input[name=${selector}]`);
                    await this.page.click(`input[name=${selector}]`);
                    await this.page.click(`#modal_root`);
                    await this.page.waitForSelector('text=is not in a proper format');
                    return Promise.resolve();
                }
            default:
                return Promise.resolve();
        }
    }

    async hasState() {
        return this.checkIfStateExists('VIRTUAL');
    }

    async loadStateVRTC() {
        const storageState = JSON.parse(process.env.VIRTUAL);
        const context = await this.page.browser().newContext({ storageState });
        this.page = context.newPage();
    }

    async blockExternals() {
        await this.page.route('**/*', route => {
            return /(livechatinc|datadog|smarttrader)/.test(route.request().url()) ? route.abort() : route.continue();
        });
    }

    checkIfStateExists = target => {
        if (process.env[target]) {
            return true;
        }
        return false;
    };

    removeLoginState = (target ) => {
        delete process.env[target];
    };
}

module.exports = Common;
