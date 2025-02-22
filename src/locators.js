export const topBar = {
	'docNameInput': "#doc-name",
	'saveButton': '#save-btn',
	'exportButton': '#export-btn',
	'hamburger': '#hamburger-button'
}
export const menu = {
	'newDocument': '#new-doc-btn',
}

export const editor = {
	'editor': '#editor'
}


export const modals = {
	"close": "#modal  .close-button",
	register: {
		login: "#account-register-username",
		password: "#account-register-password",
		email: "#account-register-email",
		submit: `//button[text()="Register"]`
	},
	login: {
		login: "#login",
		password: "#password",
		register: `//button[text()="Create account!"]`,
		submit: 'button[type="submit"]'
	},
	account: {
		logout: `//button[text()="Logout"]`,
		oldPassword: "#old_password",
		newPassword: "#new_password",
		updatePasswordBtn: `//button[text()="Update password"]`,
		currentPassword: "#password",
		areYouSure: "#are_you_sure",
		deleteBtn: '#form-delete-account button[type="submit"]',
		userInfo: "#user-info pre",
	}
}

export const cookieModal = {
	"agree": `//div[@class="modal-bottom"]//button[text()="Yes"]`,
	"disagree": `//div[@class="modal-bottom"]//button[text()="No"]`,
	login: {
		login: "#login",
		password: "#password"
	}
}

export const notifications = {
	"notificationContainer": ".notification-container",
	"notificationText": ".notification-text",
	"notificationLogin":  `//div[contains(@class, "notification-container") and descendant-or-self::text()[contains(.,"You logged in.")]]`
	
}

