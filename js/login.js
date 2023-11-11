
//XMLHttpRequest v2

// NORMAL VERSION
// function dologin(){
  
//   var http_request = new XMLHttpRequest(),     
//   url = "http://wd.etsisi.upm.es:10000/users/login";

//   // create the object
//   // adding the url
//   // creating the parameters
//   // receive JSON token and store it in the local storage

//   // TODO: Check if the user filled in the field
//   let theuser = document.getElementById('username').value;
//   let thepwd = document.getElementById('pwd').value;
//   url += '?username=' + theuser + '&password=' + thepwd;

//   // Open the request
//   // or use methods like "new(URL)" - Mozilla Documentation
//   http_request.open('GET', url, true);
//   http_request.responseType = 'json';
//   // the object that has to execute the response process
//   // not execute it instantly, so give it as a parameter to a function
//   http_request.onload = function () {
//                       responseProcess(http_request);
//   }
//   http_request.send();


// }  


// function responseProcess(http_request) {
//       if (http_request.status == 200) {
//         let information = http_request.response;
//         // We don't need the response
//         console.log(information);
//         // Any token should be coming in the authorization header
//         let jwtToken = http_request.getResponseHeader('Authorization');
//         //We don't need the response
//         document.getElementById('result').innerHTML = jwtToken;

//         // sessionStorage.add(mytoken value)
//       } else {
//         alert("There was an ERROR with the URL");
//       }
// }


// fetch version
function dologin(){ 
	let url = "http://wd.etsisi.upm.es:10000/users/login";
	let theuser = document.getElementById('username').value;
	let thepwd = document.getElementById('pwd').value;
	url += '?username=' + theuser + '&password=' + thepwd;

	let options = {
		method: 'GET'  
	};

	fetch(url, options)
	// we receive first the response object - the whole object (containing the header, the body etc) !!
	// then with the response object => return the response object in a JSON format
	// .then((responseObject)=>{return responseObject.headers.get('Authorization')})

	// AICI TOKEN UL E AFISAT IN CADRANUL ALBASTRU
	.then((responseObject) => {inf = responseObject.headers.get('Authorization')
							// get the header response
							console.log(inf);
							return responseObject.json();
							})
	// 2nd .then: Waits for the first then to be executed
	// 2nd then: Receiving what the 1st get returns !!

	// ! Store the login token in the local storage
	.then ((headerValue) => {localStorage.setItem('token', headerValue)});

	// callback function executed whenever the response gets back - move the console log inside the function
	// .then((responseObject)=>{inf = responseObject.json()} return responseObject.headers.get('Authorization'))
}
  
  
window.onload = function(){
	document.getElementById('login-button').onclick = dologin;
}
  
  
  