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
	value: "function myScript(){return 100;}\n"
	, path: "codemirror/js/"
	, stylesheet: "css/sqlcolors.css"
});

// numManipulator will move and change depending on the element
var numManipulator = document.createElement("div");
numManipulator.className = "num-manip";
document.body.appendChild(numManipulator);

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

/* (event, bool, element) -> none

Should reveal and hide a number field's manipulation ui
*/
var toggleNumManipulator = function (evt, mouseOn, numInput) {

	if (!mouseOn) {
		numInput.style.background = "lightblue";
		// Add elements - these will be absolutely positioned


		// Add event listener
		mouseOn = true;
	}
	else if (mouseOn && evt.target != numInput) {
		numInput.style.background = "none";
		// remove event listener
		// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.removeEventListener
		// remove elements
		mouseOn = false;
	}
	// For testing
	// else {console.log("That was not a number");}
	return mouseOn;
};

//--- EVENT LISTENERS ---\\
var numInput = null, mouseOn = false;

// document mousemove event listener. I don't know what else to do.
// Things will be dynamically generated.
// !!! HAVE TO FIGURE OUT WHAT HAPPENS WHEN TABBING THROUGH INPUTS OR
// MOVING CURSOR AROUND TEXT !!!
document.addEventListener("mousemove",
	 function(evt) {

	 	// -- Number Manipulation -- \\
	 	// Whenever a number input is moused over, make it the current numInput
		if (hasClass("cm-number", evt.target)) {
			numInput = evt.target;
		}

		// Only run the num input checker if we're on a num input
		if (numInput) {
			mouseOn = toggleNumManipulator(evt, mouseOn, numInput);
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

// DETECT WHEEL EVENT ON NUMBERS (only know it detects trackpad two finger)
// Latest Chrome and Firefox take "wheel" (05/24/14)
document.addEventListener("wheel", function (evt) {
	// Testing
	console.log(evt.deltaX);
});  // end on document wheel

// Browser compatibility
document.addEventListener("mousewheel", function (evt) {
	console.log(evt.deltaX);
});  // end on document mousewheel

