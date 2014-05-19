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

/* (event) -> none

Should reveal and hide a number field's manipulation ui
*/
var numManipulator = function (evt) {
	if (hasClass("cm-number", evt.target)) {
		evt.target.style.background = "red";
		// return true;
	}
	// For testing
	// else {console.log("That was not a number");}
};

//--- EVENT LISTENERS ---\\
// document mousemove event listener. I don't know what else to do.
// Multiple code editors might be created or we might put the class
// onto other number fields as well, and they'll be dynamically
// generated.
// Sources (2)
document.addEventListener("mousemove",
	 function(evt) {
		numManipulator(evt);
	});
