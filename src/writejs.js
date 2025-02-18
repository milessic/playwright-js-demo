import { config } from './config.js';
import { expect } from '@playwright/test';
import { data } from './data.js';
import * as locators from './locators.js'
import assert from 'assert';


export async function openWriterJs(page){
	await page.goto(config.url);
}

export async function verifyPageTitle(page, title){
	await expect(page).toHaveTitle(title);
}

export async function verifyModalTitle(page, modalTitle){
		const actualTitle = await page.locator(".modal-header").innerText();
		assert.strictEqual(actualTitle, modalTitle, `Modal title is '${actualTitle}', but expected is '${modalTitle}'`)
}

export async function closeCookiesModal(page, action="agree"){
	/* 
	 * allowed 'actions': ['agree', 'disagree', 'close']
	 */
	// Verify that Modal is opened
	verifyModalTitle(page, data.modals.cookies.title)
	const agreeCountStart = await page.locator(locators.cookieModal.agree).count()
	assert(agreeCountStart === 1, `Cookies Modal: agree button count is not 1, but ${agreeCountStart}`)
	// Agree
	if ( action === 'agree' ){
		page.locator(locators.cookieModal.agree).click();
	
	// Disagree
	} else if ( action === 'disagree' ){
		page.locator(locators.cookieModal.disagree).click();

	// Close
	} else if ( action === 'close' ){
		closeModal(page, data.modals.cookies.title);
	}
	// verify that modal is closed
	try {
		await page.locator(locators.cookieModal.agree).waitFor({ state: "detached" });
	} catch ( err ) {
		throw new Error(`${err}\n\nCookies Modal: Cannot verify that modal is closed`)
	}
}
export async function closeModal(page, modalTitle=""){
	if ( modalTitle ) {
		await verifyModalTitle(page, modalTitle);
	}
	await page.locator(locators.modals.close).click();
}
export async function verifyTopBarElementsAreVisibleForDesktop(page){
	await verifyThatElementsFromScopeAreVisible(page, locators.topBar);
}

export async function verifyThatElementsFromScopeAreVisible(page, scope){
	for ( const [key, value] of Object.entries(scope)){
		await page.isVisible(value);
	}
	
}

export async function fillDocumentName(page, docName){
	await page.locator(locators.topBar.docNameInput).fill(docName);
}

export async function fillDocumentContent(page, content){
	await page.locator(locators.editor.editor).fill(content);
}

export async function saveDocument(page){
	await page.locator(locators.topBar.saveButton).click();
}

export async function verifyDocumentExistsInLocalStorage(page, docName, content){
	const value = await page.evaluate((docName) => localStorage.getItem(`__doc__${docName}`))
	expect(value, content);
}
export async function verifyDocumentDoesntExistsInLocalStorage(page, docName){
	await verifyDocumentExistsInLocalStorage(page, docName, null);
}

export async function verifyThatAutosaveIs(page, ...allowedSettings){
	const value = await page.evaluate(() => localStorage.getItem("__autosave__"))
	expect(allowedSettings).toContain(value)
}

export async function verifyDocumentNameIs(page, docName){
	await expect(page.locator(locators.topBar.docNameInput)).toHaveValue(docName, {timeout: 1000});
}

export async function verifyDocumentContentIs(page, docContent){
	await expect(page.locator(locators.editor.editor)).toHaveText(docContent);
}

// Notifications
export async function getNotificationCount(page, waitForFirst=true){
	if ( waitForFirst ){
		await page.locator(locators.notifications.notificationContainer).first().waitFor({ state: "attached" });
	}
	const count = await page.locator(locators.notifications.notificationContainer).count()
	return count
}

export async function waitForAllNotificationsToBeClosed(page){
	for (let i; i < await getNotificationCount(page); i++){
		try {
			await page.locator(locators.notifications.notificationContainer).waitFor({state: "detached"});
		} catch ( err ) {
			throw new Error(`At least 1 notification is still opened: ${await page.locator(locators.notifications.notificationText).innerText()}`);
		}
	}
}

export async function verifyThatNotificationWithTextExists(page, notificationText, includeNewLine=false){
	// verify that at least 1 notification is visible
	assert(await getNotificationCount(page, true), "No notification detected!");

	// gather elements
	const notificationTexts = await page.locator(locators.notifications.notificationText).all();
	const gatheredTexts = [];

	// perform text check
	for ( let el of notificationTexts ){
		let text = await el.innerText()
		// Thank you webkit for this logic
		if ( !includeNewLine ) {
			text = text.replace(/\n/g, "");
			text = text.replace(/\s\s/g, " ");
			notificationText = notificationText.replace(/\n/g, "");
		}
		if ( text === notificationText ){
			return
		}
		gatheredTexts.push(text)
	}
	throw new Error(`Gathered texts:\n${JSON.stringify(gatheredTexts, null, "\t")}\nDid not find notification with '${notificationText}'`);
}

export async function clickButtonInsideNotification(page, buttonText){
	const buttonLocator = `//div[contains(@class,"notification-container")]//button[text()="${buttonText}"]`
	await page.locator(buttonLocator).click();
}
