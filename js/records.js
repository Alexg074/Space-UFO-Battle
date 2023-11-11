// data = JSON array with fields about the users and their scores
function print(data){
    // let alldata = "", 
    //     scores = data.results;
  
    // // display the users from the data array in the HTML page    
    // for (let i = 0; i < data.length; i++) {
    //   alldata += i + " User: " + data[i].username;
    //   alldata += " ===> ";
    //   alldata += "Score: " + data[i].punctuation;
    //   alldata += "<br /> <br />";
    // }
    // // compose string alldata here    
    // document.getElementById('results-table').innerHTML = alldata;

    // First: Create the table + headers + body

    var currentDate = new Date();
    let table = "<table>";
    table += "<thead><tr><th> No. </th> <th> User </th><th> Score </th><th> UFOs </th><th> Seconds </th><th> Date </th></tr></thead>";
    table += "<tbody>";

    // Iterate through the JSON data array and add each field into each table header (column)
    // `` for strings that contain variables
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
      // send the response to print if ok
      // 
      if (http_request.status == 200) {
        // testing
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
    // Tell the object which kind of response type it s going to receive
    http_request.responseType = 'json';
    // Which function I want to be executed whenever I have the information
    http_request.onload = function() {
                          // it won't call the function until the information is loaded
                          responseProcess(http_request);
                        }
    // Send it - asking for top 10 scores
    http_request.send();
}
  
  
  window.onload = function(){
    //   document.getElementById('mybtn').onclick = userRequest;
    userRequest();
  }
  

    
//   function userRequest(){
//     //use here fetch instead of XMLHttprequest Object
//     let options = {
//       method: 'GET'
//       };
//     let url = "http://wd.etsisi.upm.es:10000/records";
    
//     fetch(url, options)
//     // whenever i get the responseObject, the then funciton i gonna be executed
//     // convert the responseObject to a JSON object
//     .then((responseObject) => {return responseObject.json()})
//     // print data
//     .then((data) => {console.log(data); print(data)});
//   }
  
  // USE EITHER FETCH OR THE TRADIITONAL WAY