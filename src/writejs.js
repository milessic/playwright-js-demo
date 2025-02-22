import { config } from './config.js';
import { expect } from '@playwright/test';
import { data } from './data.js';
import * as locators from './locators.js'
import assert from 'assert';


export async function openWriterJs(page, autoConfirmCookiesModal=true){
	await page.goto(config.url);
	if ( autoConfirmCookiesModal) { await closeCookiesModal(page) }
}

export async function verifyPageTitle(page, title){
	await expect(page).toHaveTitle(title);
}

export async function verifyModalTitle(page, modalTitle, waitFor=false){
	let actualTitle;
	if ( waitFor ){
		try{
			actualTitle = await page.locator(`//*[contains(@class,".modal-header") and text()="${modalTitle}"]`);
			return
		} catch(err){}
	}
	actualTitle = await page.locator(".modal-header").innerText();
	assert.strictEqual(actualTitle, modalTitle, `Modal title is '${actualTitle}', but expected is '${modalTitle}'`)
}

export async function closeCookiesModal(page, action="agree"){
	/* 
	 * allowed 'actions': ['agree', 'disagree', 'close']
	 */
	// Verify that Modal is opened
	await verifyModalTitle(page, data.modals.cookies.title)
	const agreeCountStart = await page.locator(locators.cookieModal.agree).count()
	assert(agreeCountStart === 1, `Cookies Modal: agree button count is not 1, but ${agreeCountStart}`)
	// Agree
	if ( action === 'agree' ){
		await page.locator(locators.cookieModal.agree).click();
	
	// Disagree
	} else if ( action === 'disagree' ){
		await page.locator(locators.cookieModal.disagree).click();

	// Close
	} else if ( action === 'close' ){
		await closeModal(page, data.modals.cookies.title);
	}
	// verify that modal is closed
	try {
		await page.locator(locators.cookieModal.agree).waitFor({ state: "detached" });
	} catch ( err ) {
		throw new Error(`${err}\n\nCookies Modal: Cannot verify that modal is closed`)
	}
}
export async function closeModal(page, modalTitle="", closeAll=true){
	if (page.isClosed()) {
    console.warn("Page is closed, cannot close modal.");
    return;
	}
	if ( modalTitle ) {
		await verifyModalTitle(page, modalTitle);
		await page.locator(locators.modals.close).click();
	} else {
		await page.waitForFunction(() => typeof closeAllModals === 'function');
		await page.waitForTimeout(1000);
		await page.evaluate(() => {
			closeAllModals()
		}
		)
	}
	const allModals = await page.locator(locators.modals.close).all();

	const reversedModals = [];
	for (const m of allModals){
		reversedModals.push(allModals.pop());
	}

	if ( !allModals.length){return}
	for (const l of reversedModals){
		await l.click();
	}
	if ( closeAll ) { await closeModal(page, modalTitle, closeAll);}
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
	await page.locator(locators.editor.editor).click(content);
	await page.keyboard.type(content);
	await page.keyboard.type(" ");
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

export async function setAutosave(page, autosaveState){
	/*
	 * set "1" or "0"
	 */
	if ( autosaveState === "1"){
		await page.evaluate(() => localStorage.setItem("__autosave__", "1"));
	} else if ( autosaveState === "0") {
		await page.evaluate(() => localStorage.setItem("__autosave__", "0"))
	} else {
		throw new Error("autosave has to be 1 or 0 and type of str")
	}
	await page.reload();
	await closeModal(page);
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


export async function waitForNotification(page, notificationText){
	const locator = `//div[contains(@class, "notification-container") and descendant-or-self::text()[contains(.,"${notificationText}")]]`;
	await page.locator(locator).waitFor();
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

// top bar
export async function openFromMenu(page, option){
	await page.locator(locators.topBar.hamburger).waitFor();
	const ls = [locators.topBar.hamburger, `//*[@id="menu"]/button[text()="${option}"]`];
	ls.forEach( async (l) =>{
		await page.locator(l).click();
	}
	);
}

export async function verifyThatMenuContainsTheseOptions(page, options){
	await page.locator(locators.topBar.hamburger).waitFor();
	await page.locator(locators.topBar.hamburger).click();
	// wait for first option to be visible
	await page.locator("#menu button:nth-child(2)").waitFor();

	const allElements = await page.locator("#menu button").all();
	const optionsFromPage = []
	for ( const el of allElements){
		const text = await el.innerText();
		optionsFromPage.push(text)
	}
	options.forEach((o) => {
		if ( o.startsWith("Toggle") ){ 
			let status = false
			for ( const ofp of optionsFromPage ){
				if ( ofp.startsWith(o) ) { status = true;break }
			}
			if ( !status ){
				assert(false,`Options from page:\n${optionsFromPage}\n\noptions expected:\n${options}\n\nOptions check failed on ${o}!`);
			}
		} else {
			assert(optionsFromPage.includes(o),`Options from page:\n${optionsFromPage}\n\noptions expected:\n${options}\n\nOptions check failed on ${o}!`);
		}
	})
}

// accounts
export async function createNewUser(page, login, email, password, expectedNotification){
	// FIXME this tc is flaky
	// open modal
	await openFromMenu(page, "Login / Register");
	await page.locator(locators.modals.login.register).click();
	await verifyModalTitle(page, "Register - Write.JS", true);
	await page.waitForTimeout(100)

	// fill form
	await page.locator(locators.modals.register.login).fill(login);
	await page.locator(locators.modals.register.email).fill(email);
	await page.locator(locators.modals.register.password).fill(password);

	// submit form
	await page.locator(locators.modals.register.submit).click();
	await page.waitForTimeout(1200)

	// verify notification
	await verifyThatNotificationWithTextExists(page, expectedNotification, false);

}


export async function loginWithLoginAndPassword(page, login, password, skipLoginCheck=false){
	await openFromMenu(page, "Login / Register");
	// fill login and click ok
	await page.locator(locators.modals.login.login).fill(login);
	await page.locator(locators.modals.login.password).fill(password);
	await page.waitForTimeout(300); // this is page design
	await page.locator(locators.modals.login.submit).click();

	// login check
	if ( skipLoginCheck ) { return }
	await page.locator(locators.notifications.notificationLogin).waitFor();
	await page.waitForTimeout(2500); // this is page design
	await closeModal(page);

}

export async function changePassword(page, oldPassword, newPassword){
	await openFromMenu(page, "Account");
	await page.locator(locators.modals.account.oldPassword).fill(oldPassword);
	await page.locator(locators.modals.account.newPassword).fill(newPassword);
	await page.locator(locators.modals.account.updatePasswordBtn).click();
	await waitForNotification(page, "Password changed succesfully");
}

export async function verifyInputValue(page, locator, value){
	const actualValue = await page.locator(locator).inputValue();
	assert(actualValue === value, `Input's '${locator}' value is '${actualValue}' not '${value}'`);
}


export async function logOut(page){
	await openFromMenu(page, "Account");
	await page.locator(locators.modals.account.logout).click();
	await waitForNotification(page, "You have been logged out.");
}

export async function deleteAccount(page, password){
	await openFromMenu(page, "Account");
	await page.locator(locators.modals.account.currentPassword).fill(password);
	await page.locator(locators.modals.account.areYouSure).click();
	page.on('dialog', dialog => dialog.accept());

	await page.locator(locators.modals.account.deleteBtn).click();
	await waitForNotification(page, "Your account is deleted.");
}

export async function verifyUserDataSection(page, userData){
	await openFromMenu(page, "Account");
	await page.waitForTimeout(100);
	const userDataText = await page.locator(locators.modals.account.userInfo).innerText()
	const expectedUserDataText = `${userData.login}\n${userData.email}`
	assert(userDataText == expectedUserDataText, `userText is ${userDataText}\ninstead of desired\n${expectedUserDataText}`)
}


