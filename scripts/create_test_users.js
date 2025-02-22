const host = "http://localhost:8000";
const register = host + "/api/auth/register";

const users = [
	{
		username: 'test123',
		email: 'test123@writer.io',
		password: 'qweasdzxc123',
	},
	{
		username: 'test321',
		email: 'test321@writer.io',
		password: 'qweasdzxc123',
	},
	{
		username: 'test009',
		email: 'test009@writer.io',
		password: 'qweasdzxc123',
	},
]

console.log(register)
for ( const u of users){
	const resp = await fetch(register,
		{
			method: "POST",
			body: JSON.stringify(u),
			headers: {"Content-Type": "application/json"}
		}
	)
	if ( resp.ok ) { continue }
	const t = await resp.json();
	console.error(t);
	throw new Error(`user ${JSON.stringify(u)}\ncannot be created!`)
}
console.log("ok!");
