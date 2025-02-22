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

// Check if not-logged user has login/register notification
test("not logged user is notified to login or register", async ( { page } ) => {
	await writer.openWriterJs(page);

	// verify notification
	await writer.verifyThatNotificationWithTextExists(page, data.notifications.loginOrRegister.content);
})

// Check if buttons on login/register notification works as expected
test("not logged user can open login and register from notification", async ( { page } ) => {
	await writer.openWriterJs(page);

	// verify notification is displayed
	await writer.verifyThatNotificationWithTextExists(page, data.notifications.loginOrRegister.content);

	// login scenario
	await writer.clickButtonInsideNotification(page, data.notifications.loginOrRegister.buttonLogin);
	await writer.verifyModalTitle(page, data.modals.login.title)

	// register scenario
	await writer.clickButtonInsideNotification(page, data.notifications.loginOrRegister.buttonRegister);
	await writer.verifyModalTitle(page, data.modals.register.title)
})

