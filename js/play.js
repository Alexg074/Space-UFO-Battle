var pid, score = 0,
    themissile, theufo,
    ufo_hstep = 10,
    firedMissile = false;

    // Get the preferences from the local storage and apply them to the Play Page
var time = parseInt(localStorage.getItem('time'));
var ufos_count = parseInt(localStorage.getItem('ufos'));
// var gameOver = false;

// var ufos_array = new Array(5);
// enable as many UFOs as the value of "ufos" variable



// ------- TODO: TIMER CODE -----------------------------


// ------- REST OF MY CODE - INTACT -----------------------------

var ufoMovementInterval;

function UFOlaunch() {
    // each 25milisec the MoveUFO function will be called
    // and the UFO will be moved 5px
    ufoMovementInterval = setInterval(MoveUFO, 25);

}

function MoveUFO() {
    // each 25 milisec the width of the window is recalculated
    var Rlimit = window.innerWidth;
    // Get just the left position of the UDO and its width
    var hpos_ufo = parseInt(theufo.style.left),
        width_ufo = parseInt(theufo.style.width);

    // REBOUNDING of the UFO  
    if ((hpos_ufo + width_ufo + 8 > Rlimit) || (hpos_ufo < 0)) {
        ufo_hstep = (-1) * ufo_hstep;
    }
    hpos_ufo += ufo_hstep;
    theufo.style.left = hpos_ufo + 'px';


}

function pullTrigger() {
    if (!firedMissile) {
        pid = setInterval(launch, 10);
        firedMissile = true;
    }    
}

function checkforaHit() {
    var hpos_ufo = parseInt(theufo.style.left),
        vpos_ufo = parseInt(theufo.style.bottom),
        width_ufo = parseInt(theufo.style.width),
        height_ufo = parseInt(theufo.style.height),
        vpos_m = parseInt(themissile.style.bottom),
        hpos_m = parseInt(themissile.style.left),
        width_m = parseInt(themissile.style.width),
        height_m = parseInt(themissile.style.height),
        hit = false;

    // Detect if the missile hits an UFO:
    // - 1st condition => vertical condition + avoid counting as a hit when the missile is still
    // on screen but passed the UFO height and didn t hit it
    // - 2nd + 3rd condition => count as a hit only when the missile is between the left and right
    // margins of the UFO
    // - 4th condition => make the hit more accurate when the missile is very close ot the 
    // left or right margin of the UFO
    if (((vpos_m + height_m >= vpos_ufo) && (vpos_m + height_m < window.innerHeight)) &&
        ((hpos_m + width_m / 2 > hpos_ufo) &&
        (hpos_m + width_m / 2 < hpos_ufo + width_ufo)) &&
        (vpos_m < vpos_ufo + width_ufo)
    ) {
        hit = true;
    }

    return hit;
}

function launch() {
    var uLimit = window.innerHeight,
        vpos_m = parseInt(themissile.style.bottom),
        vstep = 6;
        // Missile speed (vertical step)

    // if (!gameOver)
    // If the misile gets to the top of the screen, reset the vertical position to 0
    if (vpos_m >= uLimit) {
        clearInterval(pid);
        vpos_m = 0 + 'px';
        firedMissile = false;
        score -= 25;
        document.getElementById('points').innerHTML = score;
    
    } else if (checkforaHit()) {
        // Step 1: Stop the missile
        clearInterval(pid);
        vpos_m = 0 + 'px';
        firedMissile = false;
        // Step 2: Update the global score variable
        score += 100;
        // Step 3: Update score in the panel
        document.getElementById('points').innerHTML = score;
        // Step 4: Show the explosion image for the hit (colission)
        document.getElementById('ufo').src = '../imgs/explosion.gif';
        // Step 5: Bring the UFO back after the explosion effect
        // setTimeout executes this function in 1 second => the UFO is back !
        setTimeout(function(){
            document.getElementById('ufo').src = '../imgs/ufo.png';
        }, 1000)
        
        // TODO !!
        // create an array, and use a for loop to do all the checkings for each UFO
        // with CSS you can hide elements (the UFOs) - display / vecidility: 

        // MEDIATOR Pattern for storing all the time the updated positions of the missile / UFOs

    } else {
        // keep moving the missile up if everything is in order
        vpos_m += vstep;
        vpos_m = vpos_m + 'px';
    }
    // then assigning it to the object property
    themissile.style.bottom = vpos_m;
}

function moveMissileRight() {
    var rLimit = window.innerWidth,
        hpos_m, misWidth, hstep = 20;
    // Get the actual values of the size attributes 
    hpos_m = parseInt(themissile.style.left);
    misWidth = parseInt(themissile.style.width);
    
    // Check if moving the missile to the left would keep it within the screen
    if (hpos_m + misWidth + 8 < rLimit) {
        hpos_m += hstep;
        themissile.style.left = hpos_m + 'px';    
    }
}

function moveMissileLeft() {
    var hpos_m, hstep = 20;
    // Get the actual values of the size attributes 
    hpos_m = parseInt(themissile.style.left);

    if (hpos_m > 0) {
        hpos_m -= hstep;
        themissile.style.left = hpos_m + 'px';    
    }
}

function keyboardController(theEvent) {
    let interval = 15;
    let code = theEvent.key;
    if (!firedMissile) {
        switch (code) {
            case 'ArrowRight':
                moveMissileRight();
                break;
            case 'ArrowLeft':
                moveMissileLeft();
                break;
            case ' ':
                // launch missile here
                pullTrigger();
                break;
        }
    }
}

window.onload = function() {
    themissile = document.getElementById('missile');
    theufo = document.getElementById('ufo');

    document.onkeydown = keyboardController;
    document.addEventListener('click', keyboardController, false);

    // Prepare keyboardController to be executed when a key is hited on the document
    UFOlaunch();

    // If no time preference is set, the default time is 60 seconds
    createTimer(time || 60);
}


// Implement the gameplay timer
function createTimer(time) {
    let selectedTime = time;
    var timer = setInterval (function() {
        // time--;
        document.getElementById('timer').innerHTML = --time;
        if (time == 0) {
            // gameOver = true;
            clearInterval(timer);
            // Block the user for resuming playing - lock the ufo and missile
            clearInterval(ufoMovementInterval);
            document.removeEventListener('click', keyboardController, false);
            document.onkeydown = null;
            
            // Alert the score when the time is up
            // - If there are any pending updates to the score from a hit that occurred right as the
            // timer reached zero => processed the updates before the final score calculation and alert
            setTimeout(function() {
                    let finalScore = getFinalScore(score, selectedTime, ufos_count);
                    console.log(finalScore);
                    alert("Congrats! Your final score is: " + finalScore);
            }, 100);

            // - Slight delay to make sure the last hit is processed before the final score is calculated,
            // in case an ufo is hit last minute

            
        }
    }, 1000);
    // decrement the time every 1 second
}

// Compute the final score based on the requirements
function getFinalScore(score, time, ufos_count) {
    if (time == 120) {
        score /= 2;
    } else if (time == 180) {
        score /= 3;
    }

    if (ufos_count > 1) {
        score -= ufos_count * 50;
    }

    document.getElementById('points').innerHTML = score;

    return score;
}



