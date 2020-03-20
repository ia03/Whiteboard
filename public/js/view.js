// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyBQBrUuoXwcJ57seJWAutL0UWe0uORkHew",
authDomain: "whiteboard-614a1.firebaseapp.com",
databaseURL: "https://whiteboard-614a1.firebaseio.com",
projectId: "whiteboard-614a1",
storageBucket: "whiteboard-614a1.appspot.com",
messagingSenderId: "406493687295",
appId: "1:406493687295:web:04df7d791a518c34274bca",
measurementId: "G-DR05FYEYP7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();
var url = new URL(window.location.href);
var whiteboard = url.searchParams.get('whiteboard');
var canvasRef = database.ref('users/' + whiteboard + '/canvas');
var textRef = database.ref('users/' + whiteboard + '/text');

canvasRef.on('value', function(snapshot) {
	var base64String = snapshot.val();
	document.getElementById('testimg').setAttribute('src', base64String);
});



firebase.auth().onAuthStateChanged(function(user) {
	if (!user) {
		return firebase.auth().signInAnonymously();
	}
	ref = database.ref('users/' + user.uid);
});

(function () {
    var QUEUE = MathJax.Hub.queue;  // shorthand for the queue
    var math = null, box = null;    // the element jax for the math output, and the box it's in

    //
    //  Hide and show the box (so it doesn't flicker as much)
    //
    var HIDEBOX = function () {box.style.visibility = "hidden"}
    var SHOWBOX = function () {box.style.visibility = "visible"}
	

    //
    //  Get the element jax when MathJax has produced it.
    //
	QUEUE.Push(function () {
		math = MathJax.Hub.getAllJax("MathOutput")[0];
		box = document.getElementById("box");
		SHOWBOX(); // box is initially hidden so the braces don't show
	});

    //
    //  The onchange event handler that typesets the math entered
    //  by the user.  Hide the box, then typeset, then show it again
    //  so we don't see a flash as the math is cleared and replaced.
    //
	window.UpdateMath = function (TeX) {
		QUEUE.Push(
			HIDEBOX,
			["resetEquationNumbers",MathJax.InputJax.TeX],
			["Text",math,"\\displaystyle{"+TeX+"}"],
			SHOWBOX
		);
	}
})();


textRef.on('value', function(snapshot) {
	let text = snapshot.val();
	UpdateMath(text);
});