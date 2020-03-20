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
var ref = undefined;

let drawer = new DrawerJs.Drawer(null, {
	texts: customLocalization,
	plugins: drawerPlugins,
	contentConfig: {
	  saveInHtml: false,
	  saveAfterInactiveSec: 0,
	  imagesContainer: '#drawer-canvas-images-container'
	},
	defaultActivePlugin : { name : 'Pencil', mode : 'lastUsed'},
}, 600, 600);


$('#canvas-editor').append(drawer.getHtml());
drawer.onInsert();
$('#drawer-canvas-images-container').bind("DOMSubtreeModified", function () {
	let imageJSON = JSON.parse($('#drawer-canvas-images-container').text());
	let base64String = imageJSON[Object.keys(imageJSON)[0]];
	let updates = {};
	updates['canvas'] = base64String;
	ref.update(updates);
});

firebase.auth().onAuthStateChanged(function(user) {
	if (!user) {
		return firebase.auth().signInAnonymously();
	}
	document.getElementById('whiteboardlink').setAttribute('href', 'view.html?whiteboard=' + user.uid);
	ref = database.ref('users/' + user.uid);
	let updates = {};
	updates['canvas'] = '';
	updates['text'] = '';
	ref.update(updates);
});

MathJax.Hub.Config({
  TeX: {equationNumbers: {autoNumber: "AMS"}},
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
		let updates = {};
		updates['text'] = TeX;
		ref.update(updates);
	}
})();

$('#mathbox').keyup(function () {
	UpdateMath(document.getElementById('mathbox').value);
});