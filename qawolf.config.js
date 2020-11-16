require('dotenv').config();

module.exports = {
  config: "node_modules/qawolf/js-jest.config.json",
  rootDir: "tests",
  testTimeout: 60000,
  useTypeScript: false,
  createTemplate: ({ name }) => {
    return `
const assert = require('assert').strict;
const qawolf = require('qawolf');
const {replaceWebsocket} = require('./_utils/websocket'); // TODO: Fix the path
const {setUp, tearDown} = require('./bootstrap'); // TODO: Fix the path
const Common = require('./objects/common'); // TODO: Fix the path

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
        browser: 'firefox',
    });
    browser = out.browser;
    context = out.context;
    await context.addInitScript(replaceWebsocket);
    page = new Common(await context.newPage());
});

afterEach(async () => {
    await tearDown(browser);
});

test("${name}", async () => {
      await page.navigate(); 
      await qawolf.create();
});
`;
  },
}
