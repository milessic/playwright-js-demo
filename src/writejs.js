import { config } from './config.js';
import { expect } from '@playwright/test';
import * as locators from './locators.js'


export async function openWriterJs(page){
	await page.goto(config.url);
}

export async function verifyPageTitle(page){
	await expect(page).toHaveTitle(/dev - Write.js/);
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
