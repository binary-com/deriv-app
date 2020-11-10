const qawolf = require('qawolf');
const path = require('path');
const fs = require('fs');

const LOGIN_STATE_PATH = '../tests/states/login.json';

class Common {
    constructor(page) {
        this.page = page;

        // Call Page methods whenever it is not existed in the Common class
        return new Proxy(this, {
            get (target, field) {
                if (field in target) return target[field];
                if (field in page) return page[field];
                return undefined;
            },
            apply (target, field, argumentList) {
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
        await this.page.waitForSelector('.acc-info', {
            timeout: 120000,
        });
        await this.page.click('.acc-info');
        const account_switcher_virtual = "div.acc-switcher__wrapper.acc-switcher__wrapper--enter-done > div > div.dc-tabs.dc-tabs.dc-tabs--acc-switcher__list-tabs > ul > li:nth-child(2)";
        await this.page.click(account_switcher_virtual);
        await this.page.click('.acc-switcher__id');
    }

    /**
     * Set the Endpoint
     */
    async setEndpoint(url, endpoint_server, app_id) {
        await this.page.goto(`${url}endpoint`);
        await this.page.fill('[name="server"]', endpoint_server);
        await this.page.fill('[name="app_id"]', app_id);
        await this.page.click("text=Submit");
        await this.page.waitForLoadState('domcontentloaded');
        await qawolf.saveState(this.page, './.qawolf/state/admin.json');
    }

    /**
     * Login into the page using credentials
     * @param email
     * @param password
     * @returns {Promise<void>}
     */
    async login( email, password) {
        await this.page.click("#dt_login_button");
        await this.page.click('[name="email"]');
        await this.page.fill('[name="email"]', email);
        await this.page.fill('[name="password"]', password);
        await this.page.click(".button");
        await this.page.waitForChart();
        await qawolf.saveState(this.page, LOGIN_STATE_PATH);
    }

    async loadOrLogin(email, password) {
        const is_login_done = await this.checkIfStateExists();
        if (!is_login_done) {
            await this.login(email, password);
        } else {
            await qawolf.setState(this.page, LOGIN_STATE_PATH);
            await this.page.reload();
        }
    }

    async checkIfStateExists() {
        try {
            return fs.existsSync(path.resolve(LOGIN_STATE_PATH));
        } catch (e) {
            return false;
        }
    }
}

module.exports = Common;
