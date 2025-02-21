// @ts-check
import * as writer from '../src/writejs.js';
import * as generators from '../src/data_generators.js';
import { data } from '../src/data.js';
import { test } from '@playwright/test';
import { log } from 'node:util';



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

// menu options for non-logged user
test("menu contains proper options for not logged in user", async ( { page } ) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);

	await writer.verifyThatMenuContainsTheseOptions(page, data.menuOptions.notLoggedInUser);

})

// create account - OK
test("user can register and login with success",
	{
		annotation: {
			type: 'description',
			description: `Register > Check notification > Click notification > Login > check if Welcome modal is displayed`
		}
	}, 
	async ( { page } ) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);

	const userData = generators.generateValidRegisterData();
	await writer.createNewUser(page, userData.login, userData.email, userData.password, `You can login as ${userData.login}!Login now!`);

	// click on the login
	await page.locator(`//button[text()="Login now!"]`).click()
	await writer.verifyModalTitle(page, "Login - Write.JS");

	// verify that usernme is populated
	await writer.verifyInputValue(page, "#login", userData.login);

	// verify that user can be logged in
	await page.locator("#password").fill(userData.password);
	await page.locator(`button[type="submit"]`).click();


	// verify Welcome modal
	await writer.verifyModalTitle(page, "welcome", true);

})

// update password, delete account
test("can_update_password_login_with_it_and_delete_account", async ( { page }) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);
	const userData = generators.generateValidRegisterData();
	// create new user
	await writer.createNewUser(page, userData.login, userData.email, userData.password, `You can login as ${userData.login}!Login now!`);
	// login
	await writer.loginWithLoginAndPassword(page, userData.login, userData.password);
	// verify Welcome modal

	// set new password
	const newPassword = "trololo"
	await writer.changePassword(page, userData.password, newPassword);
	userData.password = newPassword

	// log out
	await writer.closeModal(page);
	await writer.logOut(page);

	// login with new password
	await writer.loginWithLoginAndPassword(page, userData.login, userData.password);

	await writer.deleteAccount(page, userData.password);

	// verify that user cannot be logged in
	await writer.loginWithLoginAndPassword(page, userData.login, userData.password, true);
	await writer.waitForNotification(page, "Cannot login with this login! Try again!");
	
})

