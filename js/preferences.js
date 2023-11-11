// SET THE LOCAL STORAGE VARIABLES - time and nr of ufos selected by the user in the html select

function setPreferences () {
    let time = document.getElementById('time-select').value;
    let ufos = document.getElementById('ufos-select').value;
    
    localStorage.setItem('time', time);
    localStorage.setItem('ufos', ufos);
}

// execute the function after the button is clicked
window.onload = function() {
    document.getElementById('apply-pref-button').onclick = setPreferences;

}    
