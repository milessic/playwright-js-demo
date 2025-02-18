function generateRandomStr(length){
	let str = "";
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

	for ( let i=0;i<=length;i++){
		let index 
		try{
			index = parseInt(Math.random() * characters.length);
		} catch(err){
			index = 0
		}
		str += characters[index];
	}

	return str
}

export function generateValidRegisterData(){
	const baseStr = generateRandomStr(10);
	return {
		login: baseStr,
		email: baseStr + "@writejs.io",
		password: baseStr
	}
}
