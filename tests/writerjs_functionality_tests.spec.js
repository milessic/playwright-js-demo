// @ts-check
import * as writer from '../src/writejs.js';
import { test } from '@playwright/test';




// Title test
test('has title', async ( { page } ) => {
	await writer.openWriterJs(page);

	// check the title
	await writer.verifyPageTitle(page);
});


// Check if page contains all needed elements
test("has all needed elements", async ( { page } ) => {
	await writer.openWriterJs(page);

	// verify topBar
	await writer.verifyTopBarElementsAreVisibleForDesktop(page);

	// TODO verify hamburger
	// TODO verify toolbox
});


// Verify that save functionality works as expected
test("User can create new document and save document in localStorage", async ( { page } ) =>{
	const docName = "Test Document";
	const docContent = "Lorem Ipsym Dolor poziomki";

	await writer.openWriterJs(page);
	// verify autosave is turned off / not set
	await writer.verifyThatAutosaveIs(page, null, "0")
	// fill document name
	await writer.fillDocumentName(page, docName);

	// fill some text
	await writer.fillDocumentContent(page, docContent);

	// save document
	await writer.saveDocument(page);
	
	// check if document is saved in localStorage
	await writer.verifyDocumentExistsInLocalStorage(page, docName, docContent);

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

