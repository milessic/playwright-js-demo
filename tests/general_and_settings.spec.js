// @ts-check
import * as writer from '../src/writejs.js';
import { data } from '../src/data.js';
import { test } from '@playwright/test';



// Setup screenshot hook
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    // Get a unique place for the screenshot.
    const screenshotPath = testInfo.outputPath(`failure.png`);
    // Add it to the report.
    testInfo.attachments.push({ name: 'screenshot', path: screenshotPath, contentType: 'image/png' });
    // Take the screenshot itself.
    await page.screenshot({ path: screenshotPath, timeout: 5000 });
  }
});

// Title test
test('has title', async ( { page } ) => {
	await writer.openWriterJs(page);

	// check the title
	await writer.verifyPageTitle(page, data.baseTitle);
});



// Check if page contains all needed elements
test("top bar has all needed elements", async ( { page } ) => {
	await writer.openWriterJs(page);

	// verify topBar
	await writer.verifyTopBarElementsAreVisibleForDesktop(page);

	// TODO verify hamburger
	// TODO verify toolbox
});



