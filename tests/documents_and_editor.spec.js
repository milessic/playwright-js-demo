// @ts-check
import * as generators from '../src/data_generators.js';
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


// Verify that page loads previously opened document
test("verify that previously opened document is opened for returning user", async ( { page } ) => {
	const docName = "Test Document";
	const docContent = "Lorem Ipsym Dolor poziomki";

	await writer.openWriterJs(page);

	// fill document details
	await writer.fillDocumentName(page, docName);
	await writer.fillDocumentContent(page, docContent);

	// save document
	await writer.saveDocument(page);
	
	// reload page
	await page.reload();

	// verify that document is present after reload
	await writer.verifyDocumentNameIs(page, docName);
	await writer.verifyDocumentContentIs(page, docContent);
})

// autosave tests
test("autosave_saves_when_enabled", async ({ page }) =>{
	await writer.openWriterJs(page);

	await writer.loginWithLoginAndPassword(page, data.users.active.login, data.users.active.password)

	await writer.setAutosave(page, "1");

	// verfiy that user is notified regarding autosave 
	await writer.verifyThatMenuContainsTheseOptions(page, ["Toggle Autosave (It's on now)"]);
	
	// verify that autosave works
	const docData = generators.generateDocumentContent();
	await writer.fillDocumentName(page, docData.docName);
	await writer.fillDocumentContent(page, docData.docContent);

	await page.waitForTimeout(500);
	await page.reload();
	await writer.verifyDocumentNameIs(page, docData.docName);
	await writer.verifyDocumentContentIs(page, docData.docContent);


})
