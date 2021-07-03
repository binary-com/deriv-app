const logger = require('@root/_utils/logger');
const Trader = require('@root/objects/trader');
const default_context_config = require('@root/_config/context');
const { mobile_viewport } = require('@root/bootstrap');

let p;

describe('Time to chart ready in desktop', () => {
    beforeEach(async () => {
        await jestPlaywright.resetContext({
            ...default_context_config,
        });
        p = new Trader(page);
    });

    afterEach(async () => {
        await p.close();
    });

    test("[performance]-time-to-chart-ready", async () => {
        await p.navigate()
        await p.waitForChart();
        let chart_ready_time = Date.now()
        let performance_timing = JSON.parse(await p.evaluate(() => JSON.stringify(window.performance.toJSON())));
        const prod_load_time = (chart_ready_time - performance_timing.timing.connectStart)/1000;

        await p.navigateLocal()
        await p.waitForChart();
        chart_ready_time = Date.now()
        performance_timing = JSON.parse(await p.evaluate(() => JSON.stringify(window.performance.toJSON())));
        const local_load_time = (chart_ready_time - performance_timing.timing.connectStart)/1000;

        logger.save(expect.getState().testPath, 'Chart ready for desktop:', {
            'connection start:': performance_timing.timing.connectStart,
            'chart ready time:': chart_ready_time,
            'TTCR:': `${prod_load_time} (s)`,
            'production load time:': `${prod_load_time} (s)`,
            'local load time:': `${local_load_time} (s)`,
            'load time improvement:': `${parseFloat(prod_load_time - local_load_time).toFixed(2)} (s)`,
        })
    });
})
