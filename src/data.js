export const data = {
	"baseTitle": "Write.JS",

	"modals":{
		"cookies": {
			title: "Do you agree to cookies and storing data in LocalStorage?",
		},
		"login": {
			title:"Login - Write.JS",
		},
		"register": {
			title:"Register - Write.JS",
		}
	},
	"notifications": {
		"loginOrRegister": {
			content: "Write.JS is much better with account!\n\n\nCreate your own right now! or Login to your existing account",
			buttonRegister: "Create your own right now!",
			buttonLogin: "Login to your existing account",
		},
		"content": {
			content: " For this action, you need to consent to store data! Change Settings",
		},
		register: {
			emailTaken: `There were some problems with register:{\"detail\": [[\"This E-mail address is already taken!\"]]}`,
			usernameTaken: `There were some problems with register:{\"detail\": [[\"Username is already taken! Use other one\"]]}`,
			passwordTooShort: `There were some problems with register:{\"detail\": [\"[\\\"Password is too short! It has to be at least 7 characters long!\\\"]\"]}`,
			passwordTooLong: `There were some problems with register:{\"detail\": [\"[\\\"Password is too long! It has to be maximum 32 characters long!\\\"]\"]}`,
		}
	},
	menuOptions: {
		loggedInUser: ["Create New Document", "Open Document", "Import Document", "Account", "Load Remote notebook", "Export as Markdown", "Copy as Markdown", "Export", "Export as PDF", "Dark Mode", "Toggle Spell Check", "Toggle Formatting", "Toggle Autosave", "Clear localStorage", "Export Notebook"],
		notLoggedInUser: ["Create New Document", "Open Document", "Import Document", "Login / Register", "Export as Markdown", "Copy as Markdown", "Export", "Export as PDF", "Dark Mode", "Toggle Spell Check", "Toggle Formatting", "Toggle Autosave", "Clear localStorage", "Export Notebook"]
		
	},
	users: {
		active: {
			login: 'test123',
			password: 'qweasdzxc123',
			email: 'test123@writer.io'
		}, 
		active2: {
			login: 'test321',
			password: 'qweasdzxc123',
			email: 'test321@writer.io'
		}, 
		notExisting: {
			login: 'test123fasidjasojdsoidjadj',
			password: 'qweasdzxc123asddd'
		},
		forLock: {
			login: 'test009',
			password: 'qweasdzxc123asddd'
		}
	}
}

