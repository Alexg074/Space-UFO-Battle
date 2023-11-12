function dologin(){ 
	let url = "http://wd.etsisi.upm.es:10000/users/login";
	let theuser = document.getElementById('username').value;
	let thepwd = document.getElementById('pwd').value;
	url += '?username=' + theuser + '&password=' + thepwd;

	let options = {
		method: 'GET'  
	};

	fetch(url, options)
	.then((responseObject) => {inf = responseObject.headers.get('Authorization')
							// get the header response
							console.log(inf);
							return responseObject.json();
							})

	// Store the login token from the header into the local storage
	// after the 1st ".then" has been executed
	.then ((headerValue) => {localStorage.setItem('token', headerValue)});
}

// When pressing the "Login" button, perform the actual login action
window.onload = function(){
	document.getElementById('login-button').onclick = dologin;
}
  
  
  