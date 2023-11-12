var pid, score = 0,
    themissile, theufo,
    ufos = [],
    firedMissile = false;

var navbarHeight, missileHeight, screenHeight, screenWidth, freeScreenHeight;

// Get the game preferences from the local storage
// No time selected => default 60 seconds
var time = parseInt(localStorage.getItem('time')) || 60;
var ufos_count = parseInt(localStorage.getItem('ufos'));

// Function that creates multiple UFOs based on user preferences
function createUFOs(ufos_count) {
    for (var i = 0; i < ufos_count; i++) {
        var ufo = document.createElement('img');
        ufo.src = '../imgs/ufo.png';
        ufo.id = 'ufo';

		// Assign random positions
        ufo.style.left = Math.random() * (screenWidth - 60) + 'px';
        ufo.style.bottom = navbarHeight + Math.random() * (freeScreenHeight - 60) + 'px';

        // Make each UFO move random horizontally (left or right)
		if (Math.random() < 0.5) {
            ufo.hstep = -10;
        } else {
            ufo.hstep = 10;
        }

		// Append the new ufo to the body of the document, after the HTML is fully loaded
        document.body.appendChild(ufo);
        ufos.push(ufo);
    }
}

// Function to start UFO movement
function UFOlaunch(time) {
	if (time) {
		ufos.forEach(function(ufo) {
			ufo.interval = setInterval(function() {
				MoveUFO(ufo);
			}, 25);
		});
	} else {
		ufos.forEach(function(ufo) {
			ufo.interval = clearInterval(ufo.interval);
		});
	}
}

// Function to move each UFO
function MoveUFO(ufo) {
    var Rlimit = window.innerWidth - ufo.offsetWidth;
    var hpos_ufo = parseInt(ufo.style.left);
    var nextPos = hpos_ufo + ufo.hstep;

    // Bounce back in case the UFO passes the left or right margin of the width 
    if (nextPos > Rlimit || nextPos < 0) {
        ufo.hstep *= -1;
    }

	// Update the left position of the UFO with the new step
	hpos_ufo += ufo.hstep;
    ufo.style.left = hpos_ufo + 'px';

}

// Function which checks if there is a collision between missile and UFOs
function checkforaHit() {
    var hitUFO = null;
	// DOMRect object to return the position/size attributes of the missile
    var missileBounds = themissile.getBoundingClientRect();
	// console.log(missileBounds);

    for (var i = 0; i < ufos.length; i++) {
        var ufo = ufos[i];
        var ufoBounds = ufo.getBoundingClientRect();

        // Simple AABB collision detection
        if (missileBounds.left < ufoBounds.right &&
            missileBounds.right > ufoBounds.left &&
            missileBounds.top < ufoBounds.bottom &&
            missileBounds.bottom > ufoBounds.top) {
            hitUFO = ufo;
            break;
        }
    }
    return hitUFO; 
}

// Launch the missile
function launch() {
    var uLimit = window.innerHeight,
        vpos_m = parseInt(themissile.style.bottom),
        vstep = 6;
        // Missile speed (vertical step)

    // If the misile gets to the top of the screen => reset the vertical position to 0
    if (vpos_m >= uLimit) {
		resetMissile();    
    } else {
		var hitUFO = checkforaHit();
		if (hitUFO) {
			handleHit(hitUFO);
		} else {
			// No collision detected => keep moving the missile up
			// Assignt the value to the object property
			vpos_m += vstep;
			themissile.style.bottom = vpos_m + 'px';

		}
	}
}

// Reset the position of the missile in case it goes over the screen height
function resetMissile() {
	clearInterval(pid);
	themissile.style.bottom = '0px';
	firedMissile = false;
	score -= 25;
	document.getElementById('points').innerHTML = score;
}

function pullTrigger() {
    if (!firedMissile) {
        pid = setInterval(launch, 10);
        firedMissile = true;
    }    
}

function handleHit(ufo) {
	// Step 1: Stop the missile
	clearInterval(pid);
	themissile.style.bottom = '0px';
	firedMissile = false;
	// Step 2: Update the global score variable
	score += 100;
	// Step 3: Update score in the panel
	document.getElementById('points').innerHTML = score;
	// Step 4: Show the explosion image for the hit (colission)
	// Step 5: Bring the UFO back after the explosion effect (after 1 sec)
	ufo.src = '../imgs/explosion.gif';
	setTimeout(function(){
		ufo.src = '../imgs/ufo.png';
	}, 1000)
}

function moveMissileRight() {
    var rLimit = window.innerWidth,
        hpos_m, misWidth, hstep = 20;

    // Get the actual values of the missile's attributes 
    hpos_m = parseInt(themissile.style.left);

	console.log(hpos_m);
    misWidth = parseInt(themissile.style.width);
    
    // Check if moving the missile to the left would keep it within the screen
    if (hpos_m + misWidth + 8 < rLimit) {
        hpos_m += hstep;
        themissile.style.left = hpos_m + 'px';  
    }
}

function moveMissileLeft() {
    var hpos_m, hstep = 20;
    hpos_m = parseInt(themissile.style.left);

    if (hpos_m > 0) {
        hpos_m -= hstep;
        themissile.style.left = hpos_m + 'px';
    }
}

// Keyboard controller to move and launch the missile
function keyboardController(theEvent) {
    let key = theEvent.key;
    if (!firedMissile) {
        switch (key) {
            case 'ArrowRight':
                moveMissileRight();
                break;
            case 'ArrowLeft':
                moveMissileLeft();
                break;
            case ' ':
                pullTrigger();
                break;
        }
    }
}

// Start the game once the DOM is fully loaded
window.onload = function() {
    themissile = document.getElementById('missile');
    navbarHeight = document.getElementById('navbar').offsetHeight;
    missileHeight = themissile.offsetHeight;
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;
    freeScreenHeight = screenHeight - navbarHeight - missileHeight;
    
	// Create the desired nr of UFOs
    createUFOs(ufos_count);
    UFOlaunch(time);
    createTimer(time);

    document.onkeydown = keyboardController;
}

// Function to create game timer
function createTimer(time) {
	let selectedTime = time;
    var timer = setInterval (function() {
		// Decrement the time each time the interval function runs (every second) + update timer
        document.getElementById('timer').innerHTML = --time;
        if (time == 0) {
            clearInterval(timer);
            // Block the user for resuming playing - lock the ufo and missile
            UFOlaunch(time);
            document.removeEventListener('click', keyboardController, false);
            document.onkeydown = null;
            
            // Alert the score when the time is up
            setTimeout(function() {
                    let finalScore = getFinalScore(score, selectedTime, ufos_count);
                    console.log(finalScore);
                    alert("Congrats! Your final score is: " + finalScore);
            }, 100);

            // - Slight delay to make sure the last hit is processed before the final score is calculated,
            // in case an ufo is hit last sec
        }
    }, 1000);
}

// Function to compute final score
function getFinalScore(score, time, ufos_count) {
	if (time == 120) {
        score /= 2;
    } else if (time == 180) {
        score /= 3;
    }

    if (ufos_count > 1) {
        score -= (ufos_count - 1) * 50;
    }

    document.getElementById('points').innerHTML = score;

    return score;
}

