/*
	05/18/2014
	Sources:
	(1) http://codemirror.net
*/

// Code mirror is added in javascript mode
var codeEditor = CodeMirror(document.body, {
	value: "function myScript(){return 100;}\n",
});