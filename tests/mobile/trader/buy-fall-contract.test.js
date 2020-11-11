const assert = require('assert').strict;
const {replaceWebsocket, waitForWSSubset} = require('../../_utils/websocket');
const {setUp, tearDown} = require('../../bootstrap');
const Trader = require('../../objects/trader');

let browser, context, page;

beforeEach(async () => {
    const out = await setUp({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            'width': 375,
            'height': 667,
        },
        deviceScaleFactor: 2,
        hasTouch: true,
        defaultBrowserType: 'webkit',
    });
    browser = out.browser;
    context = out.context;
    await context.addInitScript(replaceWebsocket);
    page = new Trader(await context.newPage());
    await preBuy();
});

afterEach(async () => {
    await tearDown(browser);
});

test('[mobile] trader/buy-fall-contract', async () => {
    await page.waitForSelector('#dt_purchase_put_price');
    await page.click('#dt_purchase_put_price');
    const message = await waitForWSSubset(page, {
        echo_req: {
            amount: 10,
            basis: "stake",
            contract_type: "PUT",
            currency: "USD",
            duration: 5,
            duration_unit: "t",
            proposal: 1,
        },
    });
    assert.ok(message, 'No proper proposal was found');
    assert.ok(message.echo_req.duration === 5, `Duration was not set properly, expected 5, received: ${  message.echo_req.duration}`);
    await page.click('#dt_purchase_put_price');
    const buy_response = await waitForWSSubset(page, {
        echo_req: {
            price: "10.00",
        },
    });
    assert.equal(buy_response.buy.buy_price, 10, 'Buy price does not match proposal.');
});
test('[mobile] trader/buy-fall-contract-min-duration', async () => {
    await page.waitForSelector('[data-qa=duration_amount_selector]')
    await page.click('[data-qa=duration_amount_selector]')

    const REDUCE_DURATION_BUTTON_SELECTOR = '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(1)';

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn')
    await page.click('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn');

    await page.waitForSelector('#dt_purchase_put_price')
    const message = await waitForWSSubset(page, {
        echo_req: {
            amount: 10,
            basis: "stake",
            contract_type: "PUT",
            currency: "USD",
            duration: 1,
            duration_unit: "t",
            proposal: 1,
        },
    });
    assert.ok(message, 'No proper proposal was found');
    assert.ok(message.echo_req.duration === 1, `Duration was not set properly, expected 1, received: ${  message.echo_req.duration}`);
    await page.click('#dt_purchase_put_price');
    const buy_response = await waitForWSSubset(page, {
        echo_req: {
            price: "10.00",
        },
    });
    assert.equal(buy_response.buy.buy_price, 10, 'Buy price does not match proposal.');
});
test('[mobile] trader/buy-fall-contract-max-duration', async () => {
    await page.waitForSelector('.mobile-wrapper > .dc-collapsible > .dc-collapsible__content > .mobile-widget__wrapper > .mobile-widget')
    await page.click('.mobile-wrapper > .dc-collapsible > .dc-collapsible__content > .mobile-widget__wrapper > .mobile-widget')

    const INCREASE_DURATION_BUTTON_SELECTOR = '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(3)';

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn')
    await page.click('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn');

    await page.waitForSelector('#dt_purchase_put_price')
    const message = await waitForWSSubset(page, {
        echo_req: {
            amount: 10,
            basis: "stake",
            contract_type: "PUT",
            currency: "USD",
            duration: 10,
            duration_unit: "t",
            proposal: 1,
        },
    });
    assert.ok(message, 'No proper proposal was found');
    assert.ok(message.echo_req.duration === 10, `Duration was not set properly, expected 10, received: ${  message.echo_req.duration}`);
    await page.click('#dt_purchase_put_price');
    const buy_response = await waitForWSSubset(page, {
        echo_req: {
            price: "10.00",
        },
    });
    assert.equal(buy_response.buy.buy_price, 10, 'Buy price does not match proposal.');
});

async function preBuy() {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD)
    await page.waitForChart();
    await page.click('.acc-info__wrapper .acc-info');
    await page.click('.dc-tabs__item:nth-child(2)');
    await page.click(".acc-switcher__accounts >> text=Demo");
    await page.click('.top-widgets-portal .cq-menu-btn');
    await page.click(".data-hj-whitelist");
    await page.fill(".data-hj-whitelist", "Volatility");
    await page.click('text="Volatility 10 (1s) Index"');
    await page.click(".contract-type-widget__display");
    await page.waitForChart();
    await page.click("#dt_contract_rise_fall_item");
    await page.waitForChart();
    await page.waitForPurchaseBtnEnabled();
}

