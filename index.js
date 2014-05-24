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

	// var numManip

	if (!mouseOn) {
		// Test ()
		numInput.style.background = "lightblue";
		// Not test sometime in future
		// Position element in the right place
		// Make it appear
		numManipulator.style.display = "inline";

		mouseOn = true;
	}
	else if (mouseOn && evt.target != numInput) {
		// Test
		numInput.style.background = "none";
		// Not test sometime in future
		// Hide element
		numManipulator.style.display = "none";

		mouseOn = false;
	}
	// For testing
	// else {console.log("That was not a number");}
	return mouseOn;
};

/* (event, num) -> None

Adds or subtracts integers to a number in the codemirror editing
element. If it's an event, it uses input's deltas to do so,
otherwise it treats input as a number value.
*/
var changeNum = function (input) {
	// We're having some trouble here for some reason. Scrolling down
	// sometimes turns the whole line into NaN (not just the number).
	// Seems to happen when scrolling down slowly. Scrolling down quickly
	// works fine. Lowest I got going slowly was "2", when scrolling faster
	// got to 0 and below.
	if (input.type == "wheel") {
		var changeX = input.deltaX, changeY = input.deltaY * -1, changeZ = input.deltaZ;
		// Combine the number, decrease it, then truncate it
		var changeCombo = (changeX + changeY + changeZ)/5
		, comboAbs = Math.abs(changeCombo)
		, comboSign = changeCombo/comboAbs || 1
		, changeComboInt = comboSign * (comboAbs - (comboAbs % 1));

		var newNum = (parseFloat(input.target.textContent)
			+ changeComboInt);
		// When the mouse doesn't move, but the number gets smaller and
		// and the mouse is no longer over it, it goes out of bounds,
		// but this funciton is still called. Stop that from ruining stuff.
		if (!isNaN(newNum)){
			input.target.textContent = newNum.toString();
			return "same";
		}
		// If it is out of bounds, we want to change the numInput
		// DO I NEED THIS?
		else {return null;}
	}

	else {return "function not done yet";}
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
// Latest Chrome and Firefox take "wheel", neither works in
// Safari (05/24/14)
document.addEventListener("wheel", function (evt) {
	if (numInput) {
		// Should I change numInput when NaN?
		changeNum(evt);
	}
});  // end on document wheel

// Browser compatibility?
document.addEventListener("mousewheel", function (evt) {
	if (numInput) {
		// Should I change numInput when NaN?
		changeNum(evt);
	}
});  // end on document mousewheel

