const assert = require('assert').strict;
const { waitForWSSubset } = require('@root/_utils/websocket');
const Common = require('./common');

const RECENT_POSITION_DRAWER_SELECTOR = '#dt_positions_toggle';
const MARKET_SELECT = '.cq-symbol-select-btn';
const SIMPLE_DURATION_TOGGLE_SELECTOR = '#dt_simple_duration_toggle';

class Trader extends Common {
    constructor(page) {
        super(page);
        this.page = page;
    }

    async navigateLocal() {
        await this.blockExternals();
        await this.page.goto('https://localhost.binary.sx/');
    }

    async waitForChart() {
        await this.page.waitForSelector('.chart-container__loader', { state: 'hidden', timeout: 600000 });
        await this.page.waitForSelector('.ciq-menu.ciq-enabled', { timeout: 120000 });
    }

    async chooseUnderlying(submarket, name) {
        await this.page.waitForSelector(MARKET_SELECT);
        await this.page.click(MARKET_SELECT);
        await this.page.click(`//div[normalize-space(.)='${submarket}']`);
        await this.page.click(`text="${name}"`);
    }

    async openRecentPositionsDrawer() {
        await this.page.waitForSelector(RECENT_POSITION_DRAWER_SELECTOR);
        await this.page.click(RECENT_POSITION_DRAWER_SELECTOR);
        await this.page.waitForSelector('positions-toggle--has-count', { state: 'hidden' });
    }

    async verifyContractResult() {
        if (await this.isMobile()) {
            await this.assertContractDetails();
        } else {
            await this.page.waitForSelector('.portfolio-empty__wrapper', { state: 'hidden' });
            await this.page.waitForSelector('.dc-result__close-btn');
            await this.page.waitForSelector('.dc-contract-card__wrapper');
        }
    }

    async unsetAllowEquals() {
        if (await this.isMobile()) {
            try {
                const is_allow_equal_selected = await this.page.$eval('.dc-checkbox__box', el =>
                    el.classList.contains('dc-checkbox__box--active')
                );
                const toggleAllowEqual = async () => {
                    await this.page.waitForSelector('.dc-checkbox');

                    await this.page.click('.dc-checkbox');
                };
                if (is_allow_equal_selected) {
                    await toggleAllowEqual();
                }
            } catch (e) {}
        } else {
            try {
                await this.page.waitForSelector('.dc-checkbox__box--active', { timeout: 300 });
                await this.page.click('.dc-checkbox__box--active', { timeout: 300 });
            } catch (e) {
                // No need to take action here. we can continue the pipeline.
            }
        }
    }

    async clearTradeUIArtifacts() {
        if (await this.isMobile()) {
            try {
                await this.page.waitForSelector('.dc-collapsible__button', { timeout: 2000 });
                await this.page.click('.dc-collapsible__button');
                await this.page.waitForSelector('.dc-page-overlay__header-close', { timeout: 2000 });
                await this.page.click('.dc-page-overlay__header-close');
                await this.unsetAllowEquals();
            } catch {
                await this.unsetAllowEquals();
            }
        } else {
            await this.page.waitForSelector('.dc-result__close-btn', { timeout: 300 });
            await this.page.click('.dc-result__close-btn', { timeout: 300 });
            await this.page.click('#dt_positions_toggle');
            await this.unsetAllowEquals();
        }
    }

    async chooseContractType(trade_types, contract) {
        if (await this.isMobile()) {
            await this.page.waitForSelector('#dt_contract_dropdown');
            await this.page.click('#dt_contract_dropdown');
            await this.page.waitForSelector('.dc-mobile-dialog__container');
        } else {
            await this.page.click('.trade-container__fieldset.trade-types');
            await this.page.waitForSelector(
                '.contract-type-dialog.contract-type-dialog--enterDone .contract-type-dialog__wrapper'
            );
        }

        await this.chooseContract(contract);
    }

    async chooseContract(contract) {
        await this.page.waitForSelector(`#dt_contract_${contract}_item`);
        await this.page.click(`#dt_contract_${contract}_item`);
        await this.page.waitForSelector(`span[name=contract_type][value=${contract}]`);
    }

    async setDuration(duration_unit, duration_amount) {
        if (await this.isMobile()) {
            await this.changeDuration(duration_amount);
        } else {
            await this.page.waitForSelector(SIMPLE_DURATION_TOGGLE_SELECTOR);
            if (duration_amount !== 5) {
                await this.page.click(`.range-slider__ticks span:nth-child(${duration_amount - 5})`);
            }
            if (duration_unit === 'Ticks') {
                await this.page.click('#dc_t_toggle_item');
            } else if (duration_unit === 'Minutes') {
                await this.page.click('#dc_m_toggle_item');
            }

            const content = await this.page.textContent('#dt_range_slider_label');
            expect(content).toBe(`${duration_amount} ${duration_unit}`);
        }
    }

    async allowEquals(should) {
        if (await this.isMobile()) {
            const is_allow_equal_selected = await this.page.$eval('.dc-checkbox__box', el =>
                el.classList.contains('dc-checkbox__box--active')
            );
            const toggleAllowEqual = async () => {
                if (!is_allow_equal_selected) {
                    await this.page.waitForSelector('.dc-checkbox');
                    await this.page.click('.dc-checkbox');
                }
            };

            if (should) {
                try {
                    await this.page.$eval('.dc-collapsible__icon--is-open', el => !!el);
                } catch (e) {
                    await this.page.click('.dc-collapsible__icon');
                }
                await this.page.click('.dc-collapsible__icon--is-open');
                await toggleAllowEqual();
            }
        } else if (should) {
            await this.page.waitForSelector('.allow-equals__label');
            await this.page.click('.allow-equals__label');
        }
    }

    async buyContract(
        tradeTypes,
        contract,
        duration_unit,
        duration_amount,
        purchase_type = 'call',
        allow_equal = false
    ) {
        this.contract = contract;
        this.purchase_type = purchase_type;
        this.should_set_allow_equal = ['rise_fall', 'rise_fall_equal'].includes(contract);
        await this.chooseContractType(tradeTypes, contract, allow_equal);
        await this.setDuration(duration_unit, duration_amount);
        if (this.should_set_allow_equal) {
            await this.allowEquals(allow_equal);
        }
        await this.waitForPurchaseBtnEnabled(purchase_type, allow_equal);
        await this.clickOnPurchaseButton(purchase_type, allow_equal);
        await this.verifyContractResult();
    }

    async waitForPurchaseBtnEnabled(purchase_type, allow_equal = false) {
        const allow_equal_suffix = this.should_set_allow_equal && allow_equal ? 'e' : '';
        await this.page.waitForSelector(`#dt_purchase_${purchase_type}${allow_equal_suffix}_button:enabled`, {
            timeout: 120000,
        });
    }

    async clickOnPurchaseButton(type, allow_equal = false) {
        const is_equal = this.should_set_allow_equal && allow_equal ? 'e' : '';
        const button = type + is_equal;
        await this.page.click(`#dt_purchase_${button}_button`);
    }

    async assertPurchase(duration, amount, purchase_type) {
        this.duration = duration;

        const expected_response = {
            echo_req: {
                amount,
                basis: 'stake',
                contract_type: purchase_type.toUpperCase(),
                currency: 'USD',
                duration,
                duration_unit: 't',
                proposal: 1,
            },
        };
        const message = await waitForWSSubset(this.page, expected_response);
        assert.ok(message, 'No proper proposal was found');
        assert.ok(
            message?.echo_req?.duration === duration,
            `Duration was not set properly, expected ${duration}, received: ${message.echo_req.duration}`
        );
        const buy_response = await waitForWSSubset(this.page, {
            echo_req: {
                price: '10.00',
            },
        });
        assert.equal(buy_response.buy.buy_price, amount, 'Buy price does not match proposal.');
    }

    async changeDuration(target) {
        if (await this.isMobile()) {
            const increment = async () => {
                // eslint-disable-next-line no-await-in-loop
                await this.page.waitForSelector(
                    '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(3)'
                );
                await this.page.click(
                    '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(3)'
                );
            };
            const decrement = async () => {
                // eslint-disable-next-line no-await-in-loop
                await this.page.waitForSelector(
                    '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(1)'
                );
                await this.page.click(
                    '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(1)'
                );
            };

            const reachTarget = async (t, current) => {
                if (+current === +target) {
                    return Promise.resolve(current);
                }

                if (current < t) {
                    await increment();
                }
                if (current > t) {
                    await decrement();
                }
                const updated_duration = await this.page.$eval('.dc-tick-picker__holder > span:nth-child(1)', el =>
                    Number(el.textContent)
                );
                return await reachTarget(t, updated_duration);
            };

            await this.page.waitForSelector('.mobile-widget__amount');
            await this.page.click('.mobile-widget__amount');
            const current_duration = await this.page.$eval('.dc-tick-picker__holder > span:nth-child(1)', el =>
                Number(el.textContent)
            );
            await reachTarget(target, current_duration);

            await this.page.waitForSelector(
                '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn'
            );
            await this.page.click(
                '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn'
            );
        } else {
            await this.page.waitForSelector('.trade-container__input range-slider__track');
            await this.page.waitForSelector(`[data-value=${target}]`);
            await this.page.click(`[data-value=${target}]`);
        }
    }

    async loopOver(range, func) {
        const steps = [...Array(Math.abs(range)).keys()];

        // eslint-disable-next-line no-restricted-syntax,no-unused-vars
        for (const step of steps) {
            // eslint-disable-next-line no-await-in-loop
            await func();
            // eslint-disable-next-line no-await-in-loop
            await this.waitForTimeout(150);
        }
    }

    async prepareAuditDetails() {
        if (await this.isMobile()) {
            await this.page.waitForSelector('#dt_positions_toggle');
            await this.page.click('#dt_positions_toggle');
            const buy_response = await waitForWSSubset(this.page, {
                echo_req: {
                    price: '10.00',
                },
            });

            await this.waitForSelector('.dc-tick-progress', { state: 'hidden' });
            const contract_id = buy_response.buy.contract_id;
            await this.page.waitForSelector(`#dt_drawer_card_${contract_id}`);
            await this.page.click(`#dt_drawer_card_${contract_id}`);
            await this.page.waitForSelector('.dc-collapsible__button');
            await this.page.click('.dc-collapsible__button');
        } else {
            const buy_response = await waitForWSSubset(this.page, {
                echo_req: {
                    price: '10.00',
                },
            });
            const contract_id = buy_response.buy.contract_id;
            await this.page.waitForSelector(`#dc_contract_card_${contract_id}_result`, { timeout: 6000 });
            await this.page.hover(`#dc_contract_card_${contract_id}_result`);
            await this.page.click(`#dc_contract_card_${contract_id}_result`);
        }
    }

    async assertContractDetails() {
        await this.prepareAuditDetails();
        const last_proposal_open_contract_message = await waitForWSSubset(this.page, {
            echo_req: {
                proposal_open_contract: 1,
            },
        });

        if (!['over_under', 'even_odd', 'match_diff'].includes(this.contract)) {
            // Entry Spot check
            const entry_spot_tick = last_proposal_open_contract_message.proposal_open_contract.audit_details.all_ticks.find(
                t => t.name === 'Entry Spot'
            );
            const entry_spot_displayed = await this.page.$eval(
                '#dt_entry_spot_label > div.contract-audit__item > div > span.contract-audit__value',
                el => parseFloat(el.textContent.replace(/,/, ''))
            );
            assert.equal(entry_spot_displayed, entry_spot_tick.tick);
        }

        // Start time check
        const start_time_displayed = await this.page.$eval(
            '#dt_start_time_label > div.contract-audit__item > div > span',
            el => el.textContent
        );

        const start_time_tick = last_proposal_open_contract_message.proposal_open_contract.audit_details.all_ticks.find(
            t => t.name === 'Start Time'
        );
        const d = new Date(start_time_tick.epoch * 1000);
        assert.equal(
            start_time_displayed,
            `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1)
                .toString()
                .padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')} ${d
                .getUTCHours()
                .toString()
                .padStart(2, '0')}:${d
                .getUTCMinutes()
                .toString()
                .padStart(2, '0')}:${d.getUTCSeconds().toString().padStart(2, '0')} GMT`
        );

        // Exit spot check
        const exit_spot_tick = last_proposal_open_contract_message.proposal_open_contract.audit_details.all_ticks.find(
            t => t.name === 'End Time and Exit Spot'
        );
        const exit_spot_displayed = await this.page.$eval(
            '#dt_exit_spot_label > div.contract-audit__item > div > span.contract-audit__value',
            el => parseFloat(el.textContent.replace(/,/, ''))
        );
        assert.equal(exit_spot_displayed, exit_spot_tick.tick);

        // End time check
        const exit_time_displayed = await this.page.$eval(
            '#dt_exit_time_label > div.contract-audit__item > div > span',
            el => el.textContent
        );
        const end_time = new Date(exit_spot_tick.epoch * 1000);
        assert.equal(
            exit_time_displayed,
            `${end_time.getUTCFullYear()}-${(end_time.getUTCMonth() + 1)
                .toString()
                .padStart(2, '0')}-${end_time
                .getUTCDate()
                .toString()
                .padStart(2, '0')} ${end_time
                .getUTCHours()
                .toString()
                .padStart(2, '0')}:${end_time
                .getUTCMinutes()
                .toString()
                .padStart(2, '0')}:${end_time.getUTCSeconds().toString().padStart(2, '0')} GMT`
        );

        // Assert profit/loss
        await this.page.waitForSelector('text=Profit/Loss:');
        const profit = await this.page.$eval('text=Profit/Loss:', el =>
            Math.abs(parseFloat(el.nextSibling.textContent.trim()))
        );

        assert.equal(profit, Math.abs(last_proposal_open_contract_message.proposal_open_contract.profit));
    }
}

module.exports = Trader;
