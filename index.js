/*
	05/18/2014

	Sources:
	(1) http://codemirror.net
	(2) http://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
	(3) http://james.padolsey.com/jquery/#v=1.5.0&fn=jQuery.fn.hasClass

	Notes:
	(1) The class I'm looking for in Code Mirror is cm-number
*/

//--- SETUP ---\\
// Code mirror is added in javascript mode
var codeEditor = CodeMirror(document.body, {
	value: "function myScript(){return 10;}\n"
	, path: "codemirror/js/"
	, stylesheet: "css/sqlcolors.css"
});

// numManipulator will move and change depending on the element
var numManipulator = document.createElement("div");
numManipulator.className = "code-widget num-manip";
// !!! APPEND TO CODE MIRROR INSTEAD?
document.body.appendChild(numManipulator);
// Add a left and right arrow for navigation
var manipLeft = document.createElement("div");
manipLeft.className = "code-button manip-arrow manip-left";
var manipRight = document.createElement("div");
manipRight.className = "code-button manip-arrow manip-right";
numManipulator.appendChild(manipLeft);
numManipulator.appendChild(manipRight);

//--- FUNCTIONS ---\\ (has to come before calling the functions)
/* (string, element) -> bool

Replicating jQuery's hasClass, I think (Sources (3)) to check if
a javascript element has a class. Not quite the same, as you
can see from the link - we're only examining one element here
*/
var hasClass = function (selector, element) {
	var rclass = /[\n\t\r]/g;
	var className = " " + selector + " ";
	// I don't know what this is doing
	if ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1) {
		return true;
	} // Otherwise
	return false;
};


/*

*/

var placeElems = function (originElem) {

};

/* element -> bool

Checks whether parentToSearch is within 5 or fewer ancestors
of elem (or if elem is parentToSearch).
*/
var isWithin5Ancestors = function (elem, parentToSearch) {
	var ancestors = [];
	// This will soon be an ancestor of this elem
	// Need to keep elem the same to check against later
	var ancestor = elem;
	ancestors.push(elem);
	for (var indx = 0; indx < 5; indx++) {
		if (ancestor.parentNode) {
			ancestors.push(ancestor.parentNode);
			ancestor = ancestor.parentNode;
		}
	}
	return (ancestors.indexOf(parentToSearch) != -1);
}

/* (event, bool, element) -> bool

Should reveal and hide a number's manipulator ui using the
position of numInput, testing if the mouse is on or off this
number
*/
var toggleNumManipulator = function (evt, mouseOn, numInput) {

	// For a really long number it will be incredibly annoying
	// to go to the center of the number to get to manipulate it :P
	// That should be rare though
	var numPosL = numInput.getBoundingClientRect().left
	, numPosT = numInput.getBoundingClientRect().top
	, numPosB = numInput.getBoundingClientRect().bottom
	, numPosHzCenter = numInput.getBoundingClientRect().width/2
	, numPosHeight = numInput.getBoundingClientRect().height

	// When a child of numInput, it's not at the center of every number,
	// it's at some weird offset (despite that with no math it ends up at the
	// very left of the screen)
	, manipL = numPosL + numPosHzCenter - numManipulator.getBoundingClientRect().width/2

	if (!mouseOn) {
		// Position element in the right place
		numManipulator.style.left = manipL + "px";
		numManipulator.style.top = (numPosB - 1) + "px"; //"0px";
		// Make it appear
		numManipulator.style.visibility = "visible";

		// Don't reset numInput
		mouseOn = true;
	}

	// Basically, only reset stuff if neither numInput nor
	// numManipulator has the mouse on it
	else if ( mouseOn && evt.target != numInput
		&& !isWithin5Ancestors(evt.target, numManipulator) ) {
		// Hide element
		numManipulator.style.visibility = "hidden";

		// Do reset numInput
		mouseOn = false;
	}

	return mouseOn;
};

/* (event, element, num) -> null or String

Adds or subtracts integers to a number in the codemirror editing
element. If it's an event, it uses input's deltas to do so,
otherwise it adds num to the number.
*/
var changeNum = function (evt, numElem, num) {
	// We're having some trouble here for some reason. Scrolling down
	// sometimes turns the whole line or the next one into NaN
	// (not just the number). Seems to happen when scrolling down
	// slowly. Scrolling down quickly works fine. Lowest I got going
	// slowly was "2", when scrolling faster got to 0 and below.
	if (evt.type == "wheel") {
		// Mouse direction and speed, vertical sign change
		var changeX = evt.deltaX, changeY = evt.deltaY * -1, changeZ = evt.deltaZ;
		// Combine the number, decrease it, then truncate it
		var changeCombo = (changeX + changeY + changeZ)/2
		// I don't completely understand this, it's apparently the most reliable way
		, comboSign = changeCombo < 0 ? -1:1
		, comboAbs = Math.abs(changeCombo)
		, changeComboInt = comboSign * (comboAbs - (comboAbs % 1))
		;

		// This doesn't have the balance I want, but further change
		// would be much more complex

		// Add the amount it needs to change to the old number
		var newNum = (parseFloat(numElem.textContent)
			+ changeComboInt);
		// When the mouse doesn't move, but the number gets smaller and
		// and the mouse is no longer over it, it goes out of bounds,
		// but this funciton is still called. Stop that from ruining stuff.
		if (!isNaN(newNum)){
			numElem.textContent = newNum.toString();
			return "same";
		}
		// If it is out of bounds, we want to change the numElem
		// !!! DO I NEED THIS?
		else {return null;}
	}
	// If the number was an int instead
	else if ((typeof num) == "number") {
		var newNum = (parseFloat(numElem.textContent) + num);
		numElem.textContent = newNum.toString();
		return "same";
	}
	// Otherwise, express an error
	else {console.log("You didn't give the right input to changeNum.");}
};

//--- EVENT LISTENERS ---\\
var numInput = null, mouseOn = false, inputLock = false;
var oldMousePos = null, newMousePos = null;

// -- num-manip Event Listeners -- \\
// document mousemove event listener. I don't know what else to do.
// Things will be dynamically generated.
// !!! HAVE TO FIGURE OUT WHAT HAPPENS WHEN TABBING THROUGH INPUTS OR
// MOVING CURSOR AROUND TEXT !!!
document.addEventListener("mousemove", function (evt) {
 	// -- Number Manipulation -- \\
 	// Capturing the number element
 	// Whenever a number input is moused over, make it the current numInput
	if (hasClass("cm-number", evt.target)) {
		numInput = evt.target;
	}

	// Only run the num input checker if we're on a num input
	if (numInput) {
		// - Handle dragging - \\ (maybe needs its own function)
		// If the arrows are being dragged, change the number
		if (inputLock) {
			// Getting values for drag
			newMousePos = [evt.clientX, evt.clientY];
			// Get number change
			mouseDiffX = -(oldMousePos[0] - newMousePos[0]);
			mouseDiffY = oldMousePos[1] - newMousePos[1];
			// Combine horizontal and vertical change
			var num = mouseDiffX + mouseDiffY;
			// Change the value in the number elem
			var newNum = (parseFloat(numInput.textContent) + num);
			numInput.textContent = newNum.toString();
			// Prepare stuff for math to work next time too
			oldMousePos = newMousePos;
		}

		// - Releasig the number element - \\
		// Keep all this inputLock/mouseOn business in the family
		if (!inputLock) {
			mouseOn = toggleNumManipulator(evt, mouseOn, numInput);
		}
		else {mouseOn = true;}

		// If the mouse is no longer on numInput
		if (!mouseOn && numInput) {
			// Reset numInput so this isn't run again
			numInput = null;
		}
	}
});  // end on document mousemove

// FOR TABBING THROUGH INPUTS? (test implementation later)
// Possibly change focus with mousemove, but that sounds like it could get annoying
// document.addEventListener("focus",
// 	 function(evt) {

// 	 	// -- Number Manipulation -- \\
// 	 	// Whenever a number input is moused over, make it the current numInput
// 		if (hasClass("cm-number", evt.target)) {
// 			numInput = evt.target;
// 		}

// 		// Only run the num input checker if we're on a num input
// 		if (numInput) {
// 			mouseOn = toggleNumManipulator(evt, mouseOn, numInput);
// 			if (!mouseOn && numInput) {
// 				// Reset numInput so this isn't run again
// 				numInput = null;
// 			}
// 		}
// });  // end on document focus

// -- num-manip Wheel/Scrolling Event Listeners -- \\
// DETECT WHEEL EVENT ON NUMBERS (only know it detects trackpad two finger)
// Latest Chrome and Firefox take "wheel", neither works in
// Safari (05/24/14)
document.addEventListener("wheel", function (evt) {
	if (numInput) {
		// Should I change numInput when NaN?
		changeNum(evt, numInput);
	}
});  // end on document wheel

// Browser compatibility?
document.addEventListener("mousewheel", function (evt) {
	if (numInput) {
		// Should I change numInput when NaN?
		changeNum(evt, numInput);
	}
});  // end on document mousewheel

// -- manip-arrow Event Listeners -- \\
document.addEventListener("click", function (evt) {
	// Decrease number when left arrow is clicked
	if (hasClass("manip-left", evt.target)) {
		if (numInput) {changeNum(evt, numInput, -1);}
	}

	// Increase number when right arrow is clicked
	if (hasClass("manip-right", evt.target)) {
			if (numInput) {changeNum(evt, numInput, 1);}
	}
});

document.addEventListener("mousedown", function (evt) {
	if (hasClass("manip-arrow", evt.target)) {
		inputLock = true;
		// Get initial mouse position
		oldMousePos = [evt.clientX, evt.clientY];
	}
	// So that other things don't get selected:
	evt.preventDefault();

	// changeNum = Difference between old mouse pos and new mouse pos
	// divided by something
	// Add that to the num
	// evt.clientY
	// evt.clientX
});

document.addEventListener("mouseup", function (evt) {
	inputLock = false;
});

document.addEventListener("mouseleave", function (evt) {
	inputLock = false;
});

// --- TESTS --- \\
var TESTING = false;

if (TESTING) {
	console.log("Testing isWithin5Ancestors()\nExpected:\ntrue\nfalse\nActual:");
	// should return true
	console.log(isWithin5Ancestors(document.getElementsByClassName("manip-right")[0],
		document.getElementsByClassName("num-manip")[0]));
	// should return false
	console.log(isWithin5Ancestors(document.getElementsByClassName("CodeMirror")[0],
		document.getElementsByClassName("num-manip")[0]));
}
