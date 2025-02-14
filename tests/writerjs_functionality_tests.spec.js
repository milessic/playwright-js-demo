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


// Check if not-logged user has login/register notification
test("not logged user is notified to login or register", async ( { page } ) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);

	// verify notification
	await writer.verifyThatNotificationWithTextExists(page, data.notifications.loginOrRegister.content);
})

// Check if buttons on login/register notification works as expected
test("not logged user can open login and register from notification", async ( { page } ) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);

	// verify notification is displayed
	await writer.verifyThatNotificationWithTextExists(page, data.notifications.loginOrRegister.content);

	// login scenario
	await writer.clickButtonInsideNotification(page, data.notifications.loginOrRegister.buttonLogin);
	await writer.verifyModalTitle(page, data.modals.login.title)

	// register scenario
	await writer.clickButtonInsideNotification(page, data.notifications.loginOrRegister.buttonRegister);
	await writer.verifyModalTitle(page, data.modals.register.title)
})

// Check if page contains all needed elements
test("top bar has all needed elements", async ( { page } ) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);

	// verify topBar
	await writer.verifyTopBarElementsAreVisibleForDesktop(page);

	// TODO verify hamburger
	// TODO verify toolbox
});


// Verify that save functionality works as expected for user without consent
test("User can create new document but can't save without consent", async ( { page } ) =>{
	const docName = "Test Document";
	const docContent = "Lorem Ipsym Dolor poziomki";

	await writer.openWriterJs(page);
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
	await writer.closeCookiesModal(page);

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

