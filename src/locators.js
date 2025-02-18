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
		register: `//button[text()="Create account!"]`
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
	"notificationText": ".notification-text"
}

