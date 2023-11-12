function print(data){
    // Create the table + headers + body
    var currentDate = new Date();
    let table = "<table>";
    table += "<thead><tr><th> No. </th> <th> User </th><th> Score </th><th> UFOs </th><th> Seconds </th><th> Date </th></tr></thead>";
    table += "<tbody>";

    // - Iterate through the JSON data array and add each field into each table header (column)
    // - Using `` for strings that contain variables
    for (i = 0; i < data.length; i++) {
        var recordDate = new Date(data[i].recordDate);
        var currDate = recordDate.getDate();
        var currMonth = recordDate.getMonth();
        var currYear = recordDate.getFullYear();
        var currRecordDate = currDate + "-" + currMonth + "-" + currYear;
        table += `<tr><td> ${i + 1} </td><td> ${data[i].username} </td><td> ${data[i].punctuation} </td><td> ${data[i].ufos} </td><td> ${data[i].disposedTime} </td><td> ${currRecordDate} </td></tr>`;
    }

    table += "</tbody></table>";
    document.getElementById('results-table').innerHTML = table;
}
  
function responseProcess(http_request) {
	// Check if the request was successful (status 'OK')
      if (http_request.status == 200) {
        console.log(http_request.response);
        print(http_request.response);
  
      } else {
        alert ("Something went wrong with the URL");
      }
} 
  
function userRequest(){
	// GLOBAL ROUTINE for AJAX - XML
	let http_request = new XMLHttpRequest(),
		url = "http://wd.etsisi.upm.es:10000/records"
	// Initialize and send the XMLHttpRequest object
	http_request.open('GET', url, true);
	// Mark the response type as JSON
	http_request.responseType = 'json';
	// Which function I want to be executed whenever I have the information
	http_request.onload = function() {
							// Not calling the function until the information is loaded
							responseProcess(http_request);
						}
	http_request.send();
}

window.onload = function(){
	userRequest();
}
