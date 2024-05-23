import { mockGeneral, mockLoggedIn, setupMocks } from '@deriv/integration';
import { expect, test } from '@playwright/test';
import { mockBalance } from './mocks/mockBalance';
import { mockCryptoConfig } from './mocks/mockCryptoConfig';
import { mockCryptoWithdraw } from './mocks/mockCryptoWithdraw';
import { mockGetAccountTypes } from './mocks/mockGetAccountTypes';
import { mockProposalOpenContract } from './mocks/mockProposalOpenContract';
import mockWalletsAuthorize, { DEFAULT_WALLET_ACCOUNTS } from './mocks/mockWalletsAuthorize';

test.describe('Wallets - Crypto withdrawal', () => {
    test.beforeEach(async ({ baseURL, page }) => {
        await setupMocks({
            baseURL,
            mocks: [
                mockCryptoWithdraw,
                mockGeneral,
                mockLoggedIn,
                mockWalletsAuthorize,
                mockGetAccountTypes,
                mockCryptoConfig,
                mockProposalOpenContract,
                mockBalance,
            ],
            page,
            state: {
                accounts: DEFAULT_WALLET_ACCOUNTS,
                currentToken: 'a1-x0000000000000000000000000001',
            },
        });

        await page.goto(`${baseURL}/wallets`);

        await page.click('.wallets-textfield__field--listcard');
        await page.click('#downshift-0-item-1');
    });

    test('render withdrawal form with all elements', async ({ baseURL, page }) => {
        await page.goto(`${baseURL}/wallets/cashier/withdraw?verification=XXXX`);

        // #cryptoAddress
        await expect(page.locator('#cryptoAddress')).toBeVisible();
        // .wallets-percentage-selector
        await expect(page.locator('.wallets-percentage-selector')).toBeVisible();

        // check that we have 4 blocks .wallets-percentage-selector-block
        const percentageBlocks = await page.locator('.wallets-percentage-selector');
        await expect(percentageBlocks).toBeVisible();

        // #cryptoAmount
        await expect(page.locator('#cryptoAmount')).toBeVisible();

        // #fiatAmount
        await expect(page.locator('#fiatAmount')).toBeVisible();

        // button of type "submit" with text "Withdraw" and with class .wallets-button
        const submitButton = await page.locator('button.wallets-button[type="submit"]');
        await expect(submitButton).toBeVisible();
        await expect(submitButton).toHaveText('Withdraw');
    });

    test('displays validation messages for address field', async ({ baseURL, page }) => {
        await page.goto(`${baseURL}/wallets/cashier/withdraw?verification=XXXX`);

        // given initial state, no validation message should be visible
        let validationMessage = await page.locator('text=This field is required.');
        await expect(validationMessage).toHaveCount(0);

        // given short address, validation message should be visible
        await page.fill('#cryptoAddress', 'short-address');
        validationMessage = await page.locator('text=Your wallet address should have 25 to 64 characters.');
        await expect(validationMessage).toBeVisible();

        // given long address, validation message should be visible
        await page.fill(
            '#cryptoAddress',
            'looooong-address-123456789012345678901234567890123456789012345678901234567890'
        );
        validationMessage = await page.locator('text=Your wallet address should have 25 to 64 characters.');
        await expect(validationMessage).toBeVisible();

        // given valid address, no validation message should be visible
        await page.fill('#cryptoAddress', 'valid-address-12345678901234567890123456789012345678901234567890');
        validationMessage = await page.locator('text=Your wallet address should have 25 to 64 characters.');
        await expect(validationMessage).toHaveCount(0);
    });

    test('balance meter is empty initially', async ({ baseURL, page }) => {
        await page.goto(`${baseURL}/wallets/cashier/withdraw?verification=XXXX`);

        // percentage selector, visible
        await expect(page.locator('.wallets-percentage-selector')).toBeVisible();

        // given initial state, all 4 blocks should have width style set to 0
        const blockFill1 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(1) .wallets-percentage-selector-block__fill'
        );
        const blockFill2 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(2) .wallets-percentage-selector-block__fill'
        );
        const blockFill3 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(3) .wallets-percentage-selector-block__fill'
        );
        const blockFill4 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(4) .wallets-percentage-selector-block__fill'
        );

        const block1Width = await blockFill1.evaluate(node => node.style.width);
        const block2Width = await blockFill2.evaluate(node => node.style.width);
        const block3Width = await blockFill3.evaluate(node => node.style.width);
        const block4Width = await blockFill4.evaluate(node => node.style.width);

        await expect(block1Width).toBe('0%');
        await expect(block2Width).toBe('0%');
        await expect(block3Width).toBe('0%');
        await expect(block4Width).toBe('0%');
    });

    test('balance meter correctly visualises balance when withdrawing part of available money', async ({
        baseURL,
        page,
    }) => {
        await page.goto(`${baseURL}/wallets/cashier/withdraw?verification=XXXX`);

        // percentage selector, visible
        await expect(page.locator('.wallets-percentage-selector')).toBeVisible();

        // 3.75 BTC, equivalent to 37.5% of bar, so 1st block should be full, second block half full, rest empty
        await page.fill('#cryptoAmount', '3.75');

        // given initial state, all 4 blocks should have width style set to 0
        const blockFill1 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(1) .wallets-percentage-selector-block__fill'
        );
        const blockFill2 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(2) .wallets-percentage-selector-block__fill'
        );
        const blockFill3 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(3) .wallets-percentage-selector-block__fill'
        );
        const blockFill4 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(4) .wallets-percentage-selector-block__fill'
        );

        const block1Width = await blockFill1.evaluate(node => node.style.width);
        const block2Width = await blockFill2.evaluate(node => node.style.width);
        const block3Width = await blockFill3.evaluate(node => node.style.width);
        const block4Width = await blockFill4.evaluate(node => node.style.width);
        //
        await expect(block1Width).toBe('100%');
        await expect(block2Width).toBe('50%');
        await expect(block3Width).toBe('0%');
        await expect(block4Width).toBe('0%');
    });

    test('balance meter correctly visualises balance when withdrawing 100% of available money', async ({
        baseURL,
        page,
    }) => {
        await page.goto(`${baseURL}/wallets/cashier/withdraw?verification=XXXX`);

        // percentage selector, visible
        await expect(page.locator('.wallets-percentage-selector')).toBeVisible();

        // 3.75 BTC, equivalent to 37.5% of bar, so 1st block should be full, second block half full, rest empty
        await page.fill('#cryptoAmount', '10');

        // given initial state, all 4 blocks should have width style set to 0
        const blockFill1 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(1) .wallets-percentage-selector-block__fill'
        );
        const blockFill2 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(2) .wallets-percentage-selector-block__fill'
        );
        const blockFill3 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(3) .wallets-percentage-selector-block__fill'
        );
        const blockFill4 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(4) .wallets-percentage-selector-block__fill'
        );

        const block1Width = await blockFill1.evaluate(node => node.style.width);
        const block2Width = await blockFill2.evaluate(node => node.style.width);
        const block3Width = await blockFill3.evaluate(node => node.style.width);
        const block4Width = await blockFill4.evaluate(node => node.style.width);
        //
        await expect(block1Width).toBe('100%');
        await expect(block2Width).toBe('100%');
        await expect(block3Width).toBe('100%');
        await expect(block4Width).toBe('100%');
    });

    test('balance meter displays still displays 100% when amount exceeds balance', async ({ baseURL, page }) => {
        await page.goto(`${baseURL}/wallets/cashier/withdraw?verification=XXXX`);

        // percentage selector, visible
        await expect(page.locator('.wallets-percentage-selector')).toBeVisible();

        // 3.75 BTC, equivalent to 37.5% of bar, so 1st block should be full, second block half full, rest empty
        await page.fill('#cryptoAmount', '200');

        // given initial state, all 4 blocks should have width style set to 0
        const blockFill1 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(1) .wallets-percentage-selector-block__fill'
        );
        const blockFill2 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(2) .wallets-percentage-selector-block__fill'
        );
        const blockFill3 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(3) .wallets-percentage-selector-block__fill'
        );
        const blockFill4 = await page.locator(
            '.wallets-percentage-selector-block-container:nth-child(4) .wallets-percentage-selector-block__fill'
        );

        const block1Width = await blockFill1.evaluate(node => node.style.width);
        const block2Width = await blockFill2.evaluate(node => node.style.width);
        const block3Width = await blockFill3.evaluate(node => node.style.width);
        const block4Width = await blockFill4.evaluate(node => node.style.width);
        //
        await expect(block1Width).toBe('0%');
        await expect(block2Width).toBe('0%');
        await expect(block3Width).toBe('0%');
        await expect(block4Width).toBe('0%');
    });

    test('validates crypto input against current balance and minimum withdrawal amount', async ({ baseURL, page }) => {
        await page.goto(`${baseURL}/wallets/cashier/withdraw?verification=XXXX`);

        // given initial state, no validation message should be shown
        await expect(
            page.locator('.wallets-withdrawal-crypto-amount-converter .wallets-textfield:first-child')
        ).not.toHaveClass('wallets-textfield--error');
        await expect(
            page.locator(
                '.wallets-withdrawal-crypto-amount-converter .wallets-textfield:first-child .wallets-textfield__message-container--msg'
            )
        ).not.toBeVisible();

        // given very low amount, display appropriate error message
        await page.fill('#cryptoAmount', '0.0001');

        await expect(
            page.locator('.wallets-withdrawal-crypto-amount-converter .wallets-textfield:first-child')
        ).toHaveClass('wallets-textfield  wallets-textfield--error');
        await expect(
            page.locator(
                '.wallets-withdrawal-crypto-amount-converter .wallets-textfield:first-child .wallets-textfield__message-container--msg'
            )
        ).toBeVisible();
        await expect(
            page.locator(
                '.wallets-withdrawal-crypto-amount-converter .wallets-textfield:first-child .wallets-textfield__message-container--msg'
            )
        ).toHaveText('The current allowed withdraw amount is 0.00027139 to 10.00000000 BTC.');

        // given amount above balance, display appropriate error message
        await page.fill('#cryptoAmount', '1000');

        await expect(
            page.locator('.wallets-withdrawal-crypto-amount-converter .wallets-textfield:first-child')
        ).toHaveClass('wallets-textfield  wallets-textfield--error');
        await expect(
            page.locator(
                '.wallets-withdrawal-crypto-amount-converter .wallets-textfield:first-child .wallets-textfield__message-container--msg'
            )
        ).toBeVisible();
        await expect(
            page.locator(
                '.wallets-withdrawal-crypto-amount-converter .wallets-textfield:first-child .wallets-textfield__message-container--msg'
            )
        ).toHaveText('Insufficient funds');

        // given valid amount, no error message should be visible
        await page.fill('#cryptoAmount', '1');
        await expect(
            page.locator('.wallets-withdrawal-crypto-amount-converter .wallets-textfield:first-child')
        ).not.toHaveClass('wallets-textfield--error');
        await expect(
            page.locator(
                '.wallets-withdrawal-crypto-amount-converter .wallets-textfield:first-child .wallets-textfield__message-container--msg'
            )
        ).not.toBeVisible();
    });

    test('converts fiat to crypto and vice versa', async ({ baseURL, page }) => {
        await page.goto(`${baseURL}/wallets/cashier/withdraw?verification=XXXX`);

        // given some amount of crypto being put to input, convert it to fiat
        await page.fill('#cryptoAmount', '10');
        await expect(page.locator('#fiatAmount')).toHaveValue('293054.50');

        // given some amount of crypto being put to input, convert it to crypto
        await page.fill('#fiatAmount', '42000');
        await expect(page.locator('#cryptoAmount')).toHaveValue('1.43318052');
    });

    test('submit button validity', async ({ baseURL, page }) => {
        await page.goto(`${baseURL}/wallets/cashier/withdraw?verification=XXXX`);

        // given initial state, submit button should be disabled
        await expect(page.locator('.wallets-withdrawal-crypto-form__submit button[type="submit"]')).toBeDisabled();

        // given valid address, and valid amount, submit button should be enabled
        await page.fill('#cryptoAmount', '10');
        await page.fill('#cryptoAddress', '123456789012345678901234567890123456789012345678901234567890');

        await expect(page.locator('.wallets-withdrawal-crypto-form__submit button[type="submit"]')).toBeEnabled();

        // given invalid address, submit button should be disabled
        await page.fill('#cryptoAddress', 'incorrect-address');
        await expect(page.locator('.wallets-withdrawal-crypto-form__submit button[type="submit"]')).toBeDisabled();

        // given invalid amount, submit button should be disabled
        await page.fill('#cryptoAddress', '123456789012345678901234567890123456789012345678901234567890');
        await page.fill('#cryptoAmount', '0');

        await expect(page.locator('.wallets-withdrawal-crypto-form__submit button[type="submit"]')).toBeDisabled();
    });

    test('spinner while submitting', async ({ baseURL, page }) => {
        await page.goto(`${baseURL}/wallets/cashier/withdraw?verification=XXXX`);

        // given initial state, submit button should be disabled
        await expect(page.locator('.wallets-withdrawal-crypto-form__submit button[type="submit"]')).toBeDisabled();

        // given valid address, and valid amount, submit button should be enabled
        await page.fill('#cryptoAmount', '3');
        await page.fill('#cryptoAddress', '123456789012345678901234567890123456789012345678901234567890');

        // given submit button clicked, spinner should be visible
        await page.click('.wallets-withdrawal-crypto-form__submit button[type="submit"]');
        await expect(page.locator('.wallets-withdrawal-crypto-form__submit button[type="submit"]')).toBeDisabled();
    });
});
