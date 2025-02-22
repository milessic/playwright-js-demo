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

// Verify that save functionality works as expected for user without consent
test("User can create new document but can't save without consent", async ( { page } ) =>{
	const docName = "Test Document";
	const docContent = "Lorem Ipsym Dolor poziomki";

	await writer.openWriterJs(page, false);
	await writer.closeCookiesModal(page, "disagree");

	// verify autosave is turned off / not set
	await writer.verifyThatAutosaveIs(page, null, "0")
	// fill document name
	await writer.fillDocumentName(page, docName);

	// fill some text
	await writer.fillDocumentContent(page, docContent);

	// save document
	await writer.saveDocument(page);
	
	// verify that notification 
	await writer.verifyThatNotificationWithTextExists(page, data.notifications.content.content);

	// check if document is not saved in localStorage
	await writer.verifyDocumentDoesntExistsInLocalStorage(page, docName);

})


