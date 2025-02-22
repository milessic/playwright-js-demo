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
//
// menu options for logged-in user
test("menu contains proper options for logged in user", async ( { page } ) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);

	await writer.loginWithLoginAndPassword(page, data.users.active.login, data.users.active.password)
	await writer.verifyThatMenuContainsTheseOptions(page, data.menuOptions.loggedInUser);

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

// create account - login exists 
test("cannot_create_account_with_taken_username",
	{
		annotation: {
			type: 'description',
			description: `Register > Check notification > Click notification > Login > check if Welcome modal is displayed`
		}
	}, 
	async ( { page } ) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);

	await writer.createNewUser(page, data.users.active.login, 'sdjfa@asdasdd.com', data.users.active.password, data.notifications.register.usernameTaken);

})

// create account - email exists 
test("cannot_create_account_with_taken_email",
	{
		annotation: {
			type: 'description',
			description: `Register > Check notification > Click notification > Login > check if Welcome modal is displayed`
		}
	}, 
	async ( { page } ) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);

	await writer.createNewUser(page, 'asdsasgasff3rf3', data.users.active.email, data.users.active.password, data.notifications.register.emailTaken);
	})

// create account - password to short 
test("cannot_create_account_with_too_short_password", 
	async ( { page } ) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);

	const userData = generators.generateValidRegisterData();
	await writer.createNewUser(page, userData.login, userData.email, '123456', data.notifications.register.passwordTooShort);
})

// create account - password to long
test("cannot_create_account_with_too_long_password",
	async ( { page } ) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);

	const userData = generators.generateValidRegisterData();
	await writer.createNewUser(page, userData.login, userData.email, 'x'.repeat(36), data.notifications.register.passwordTooLong);

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

// wrong password
test("cannot_login_with_wrong_password", async ( { page }) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);
	await writer.loginWithLoginAndPassword(page, data.users.active.login, data.users.notExisting.password, true);
	await writer.waitForNotification(page, `Invalid Password for user `);
})

// user doesn't exist
test("cannot_login_with_not_existing_user", async ( { page }) => {
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);
	await writer.loginWithLoginAndPassword(page, data.users.notExisting.login, data.users.notExisting.password, true);
	await writer.waitForNotification(page, "Cannot login with this login! Try again!");
})


// user locked in
test("will_lock_in_after_failed_attempts", async ( { page, browserName }) => {
	test.skip(browserName != "chromium", "This is one-browser test only");
	await writer.openWriterJs(page);
	await writer.closeCookiesModal(page);
	for ( let i=0; i< 4;i++){
		await writer.loginWithLoginAndPassword(page, data.users.forLock.login, data.users.notExisting.password, true);
		await writer.waitForNotification(page, `Invalid Password for user `);
	}
	await writer.loginWithLoginAndPassword(page, data.users.forLock.login, data.users.notExisting.password, true);
	await writer.waitForNotification(page, `Please wait 15 minutes and try again.`);
})
