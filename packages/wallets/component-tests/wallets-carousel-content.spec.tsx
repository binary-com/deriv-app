import { mockGeneral, setupMocks } from '@deriv/integration';
import { devices, expect, Page, test } from '@playwright/test';
import { mockCryptoConfig } from './mocks/mockCryptoConfig';
import { mockGetAccountTypes } from './mocks/mockGetAccountTypes';
import { mockProposalOpenContract } from './mocks/mockProposalOpenContract';
import mockWalletsAuthorize, { DEFAULT_WALLET_ACCOUNTS } from './mocks/mockWalletsAuthorize';
import mockWalletsLoggedIn from './mocks/mockWalletsLoggedIn';

const CAROUSEL_SELECTOR = '.wallets-carousel-content__cards .wallets-card:nth-child(1)';

// swipe function
async function swipeLeft(mobilePage: Page) {
    // Get the bounding box of the carousel
    const boundingBox = await mobilePage.locator(CAROUSEL_SELECTOR).boundingBox();

    if (boundingBox) {
        // Coordinates for start and end points of the swipe gesture
        const startX = boundingBox.x + boundingBox.width - 10; // start from the right edge
        const endX = startX - 150; // boundingBox.x + 10; // end towards the left edge
        const y = boundingBox.y + boundingBox.height / 2; // vertical center

        await mobilePage.mouse.move(startX, y);
        await mobilePage.mouse.down();
        await mobilePage.mouse.move(endX, y, { steps: 50 });
        await mobilePage.mouse.up();
    }
}
test.describe('Wallets - Mobile carousel', () => {
    // mobile page
    let mobilePage: Page;

    test.beforeEach(async ({ baseURL, browser }) => {
        const iPhone11 = devices['iPhone 11'];

        const context = await browser.newContext({
            ...iPhone11,
        });

        mobilePage = await context.newPage();

        await setupMocks({
            baseURL,
            mocks: [
                mockGeneral,
                mockWalletsLoggedIn,
                mockWalletsAuthorize,
                mockGetAccountTypes,
                mockCryptoConfig,
                mockProposalOpenContract,
            ],
            page: mobilePage,
            state: {
                accounts: DEFAULT_WALLET_ACCOUNTS,
                currentToken: 'a1-x0000000000000000000000000004',
            },
        });
    });

    test('renders cards for all wallets', async ({ baseURL }) => {
        await mobilePage.goto(`${baseURL}/wallets`);

        // Ensure the carousel is loaded and visible
        await mobilePage.waitForSelector(CAROUSEL_SELECTOR);

        const card1text = await mobilePage
            .locator(
                '.wallets-carousel-content__cards .wallets-card:nth-child(1) .wallets-card__details-bottom span:last-child'
            )
            .innerText();
        const card2text = await mobilePage
            .locator(
                '.wallets-carousel-content__cards .wallets-card:nth-child(2) .wallets-card__details-bottom span:last-child'
            )
            .innerText();
        const card3text = await mobilePage
            .locator(
                '.wallets-carousel-content__cards .wallets-card:nth-child(3) .wallets-card__details-bottom span:last-child'
            )
            .innerText();
        const card4text = await mobilePage
            .locator(
                '.wallets-carousel-content__cards .wallets-card:nth-child(4) .wallets-card__details-bottom span:last-child'
            )
            .innerText();

        expect(card1text).toBe('0.00 USD');
        expect(card2text).toBe('0.00000000 BTC');
        expect(card3text).toBe('0.00000000 ETH');
        expect(card4text).toBe('0.00 USD');
    });

    test('renders progress bar with active item and updates it when swiping', async ({ baseURL }) => {
        await mobilePage.goto(`${baseURL}/wallets`);
        const activeProgressBarItem = mobilePage.locator('.wallets-progress-bar div:nth-child(1)');
        const progressBarItemClass = await activeProgressBarItem.getAttribute('class');

        expect(progressBarItemClass).toContain('wallets-progress-bar-active');

        // swipe left
        await swipeLeft(mobilePage);

        const activeProgressBarItem2 = mobilePage.locator('.wallets-progress-bar div:nth-child(2)');
        const progressBarItemClass2 = await activeProgressBarItem2.getAttribute('class');

        expect(progressBarItemClass2).toContain('wallets-progress-bar-active');

        // timeout to wait for previous swiping animation
        await mobilePage.waitForTimeout(1000);

        await swipeLeft(mobilePage);

        const activeProgressBarItem3 = mobilePage.locator('.wallets-progress-bar div:nth-child(3)');
        const progressBarItemClass3 = await activeProgressBarItem3.getAttribute('class');

        expect(progressBarItemClass3).toContain('wallets-progress-bar-active');
    });

    test('switches account when clicking on progress bar', async ({ baseURL }) => {
        // given
        await mobilePage.goto(`${baseURL}/wallets`);

        const progressBarItem = mobilePage.locator('.wallets-progress-bar div:nth-child(3)');

        // when
        await progressBarItem.click();

        // then
        const activeProgressBarItem2 = mobilePage.locator('.wallets-progress-bar div:nth-child(3)');
        const progressBarItemClass2 = await activeProgressBarItem2.getAttribute('class');

        expect(progressBarItemClass2).toContain('wallets-progress-bar-active');
    });
});
