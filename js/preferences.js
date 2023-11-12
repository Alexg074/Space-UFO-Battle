function setPreferences () {
    let time = document.getElementById('time-select').value;
    let ufos = document.getElementById('ufos-select').value;
    
    localStorage.setItem('time', time);
    localStorage.setItem('ufos', ufos);
}

// Execute the function after the button is clicked
window.onload = function() {
    document.getElementById('apply-pref-button').onclick = setPreferences;

}    
