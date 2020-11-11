const qawolf = require('qawolf');
const path = require('path');
const fs = require('fs');

const LOGIN_STATE_PATH = './tests/states/login.json';

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
        await this.page.waitForSelector(".cookie-banner__btn-accept");
        await this.page.click(".cookie-banner__btn-accept");
    }

    /**
     * Switch to Virtual Account
     *
     * @returns {Promise<void>}
     */
    async switchVirtualAccount() {
        await this.page.waitForSelector('.acc-info');
        await this.page.click('.acc-info');
        const element = await this.page.evaluate(`document.querySelector('.dc-content-expander')`)
        if (element && !element.classList.contains('dc-content-expander--expanded')) {
            await this.page.click('.dc-content-expander');
        }
        const account_switcher_virtual = "div.acc-switcher__wrapper.acc-switcher__wrapper--enter-done > div > div.dc-tabs.dc-tabs.dc-tabs--acc-switcher__list-tabs > ul > li:nth-child(2)";
        await this.page.click(account_switcher_virtual);
        await this.page.click('.acc-switcher__id');
    }

    /**
     * Set the Endpoint
     */
    async setEndpoint(url, endpoint_server, app_id) {
        await this.page.goto(`${url}/endpoint`);
        await this.page.fill('[name="server"]', endpoint_server);
        await this.page.fill('[name="app_id"]', app_id);
        await this.page.press('[name="app_id"]', 'Tab');
        await this.page.click("text=Submit");
        await this.page.waitForTimeout(300);
        await this.page.waitForLoadState('domcontentloaded');
        await qawolf.saveState(this.page, LOGIN_STATE_PATH);
    }

    /**
     * Login into the page using credentials
     * @param email
     * @param password
     * @returns {Promise<void>}
     */
    async login(email, password) {
        await this.page.waitForSelector('#dt_login_button');
        await this.page.click("#dt_login_button");
        await this.page.click('[name="email"]');
        await this.page.fill('[name="email"]', email);
        await this.page.fill('[name="password"]', password);
        await this.page.click(".button");
        await this.page.waitForLoadState('domcontentloaded');
        const grant = await this.page.evaluate('document.querySelector("#btnGrant")');

        if (grant) {
            await this.page.click('#btnGrant');
            await this.page.waitForLoadState('domcontentloaded');
        }

        await qawolf.saveState(this.page, LOGIN_STATE_PATH);
    }

    async loadOrLogin(email, password) {
        const is_login_done = this.checkIfStateExists();
        if (!is_login_done) {
            await this.login(email, password);
        } else {
            await qawolf.setState(this.page, LOGIN_STATE_PATH);
            await this.page.reload();
        }
    }

    checkIfStateExists() {
        try {
            const state_path = path.resolve(LOGIN_STATE_PATH);
            const result = fs.existsSync(state_path);
            if (result) {
                const content = JSON.parse(fs.readFileSync(path.resolve(LOGIN_STATE_PATH), 'utf-8'));
                if (
                    !content.localStorage['client.accounts'] || (
                        content.localStorage['config.server_url'] &&
                        content.localStorage['config.server_url'] !== process.env.QABOX_SERVER
                    )
                ) {
                   // remove the file and allow redirection
                    fs.unlinkSync(state_path);
                    return false;
                }
            }
            return result;
        } catch (e) {
            return false;
        }
    }

    async isMobile() {
        const {width} = await this.page.viewportSize()

        return width < 400;
    }

    removeLoginState() {
        fs.unlinkSync(path.resolve(LOGIN_STATE_PATH));
    }

    async navigate() {
        if (process.env.QA_SETUP === 'true') {
            await this.setEndpoint(process.env.HOME_URL, process.env.QABOX_SERVER, process.env.QABOX_APP_ID);
        }
        await this.page.goto(`${process.env.HOME_URL}`, {waitUntil: 'domcontentloaded'});
    }
}

module.exports = Common;
