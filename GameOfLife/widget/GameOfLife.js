/* alea non iacta est */

dojo.provide("GameOfLife.widget.GameOfLife");

var MxLife = function() {

	this.templateString   = dojo.cache("GameOfLife.widget","templates/GameOfLife.html");

	this.height           = 20;
	this.width            = 40;
    this.runinterval      = 500;
	this.runnerNode       = null;
	this.gridNode         = null;
	this.countNode        = null;

	var hitch             = dojo.hitch;
	var root, counterNode = null;
	var matrix            = [];
	var matrix2           = [];
	var counter           = 0;
    var interval          = null;

	var builder           = mxui.dom;
	var height, width     = null;

	var running           = false;

	this.postCreate = function() {
		mxui.dom.disableSelection(this.domNode);
		if (mx.isIE) {
			mxui.dom.insertCss("../ui/GameOfLife.css");
		}
		root = builder.pre();
		this.gridNode.appendChild(root);
		counterNode = this.countNode;
		height      = this.height;
		width       = this.width;
        interval    = this.runinterval;

		var txt = null;
		var i,j = 0;
		for (i=0; i<height; i++) {
			matrix.push([]);
			for (j=0; j<width; j++) {
				txt = builder.span('X');
				txt.setAttribute("class", "dead");
				matrix[i].push(txt);
				root.appendChild(txt);
			}
			root.appendChild(builder.br());
		}
		this.connect(root, "onclick", "eventNodeClicked");
		this.loaded();
    };

	var cellStatus = function(x, y) {
		return (matrix2[x] && matrix2[x][y]) ?  matrix2[x][y] : "dead";
    };

	var neighbours = function(x, y) {
		var count = { dead : 0, alive : 0 };
		var i,j;
		for (i = -1; i < 2 ; i++) {
			for (j = -1; j < 2 ; j++) {
				if (!((i === 0 ) && (j === i))) { 
					switch(cellStatus((x+i), (y+j))) {
						case "dead": count.dead++; break;
						case "alive": count.alive++; break;
					}
				}	
			}
		}
		return count;
    };

	var cycle = function() {
		var i,j = 0;
		var locals = {};
		matrix2 = [];
		for (i=0; i<matrix.length; i++) {
			matrix2[matrix2.length] = [];
			for (j=0; j<matrix[i].length; j++) {
				matrix2[i][matrix2[i].length] = matrix[i][j].getAttribute("class");
			}
		}

		for (i=0; i<matrix2.length; i++) {
			for (j=0; j<matrix2[i].length; j++) {
				locals = neighbours(i,j);
				switch(matrix2[i][j]) {
					case "alive":
						if ((locals.alive < 2) || (locals.alive > 3)) {
							matrix[i][j].setAttribute("class", "dead");
						}
					break;
					case "dead":
						if (locals.alive == 3) {
							matrix[i][j].setAttribute("class", "alive");
						}
					break;
				}
			}
		}

		counterNode.innerHTML = counter++;
    };

	this.eventNodeClicked = function(e) {
		var node = e.originalTarget;
		node.setAttribute("class",
			(node.getAttribute("class") == "alive") ?  "dead" : "alive"
		);
    };

	this.eventNext = function(e) {
		var j,i = 0;
		if (e.target.getAttribute("cycle")) {
			i = parseInt(e.target.getAttribute("cycle"), 10);
		}
        for (j=0;j<=i; j++) { cycle(); }
    };

	var runner = function() {
		if (running) {
			cycle();
			setTimeout(arguments.callee, interval);
		}
    };

	this.eventToggleRun = function(e) {
		if (running) {
			running = false;
			this.runnerNode.innerHTML = '[Start running]';
		} else {
			this.runnerNode.innerHTML = '[Stop running]';
			running = true;
			runner();
		}
    };

	this.eventRandomize = function(e) {
        var i,j;
		for (i=0; i<matrix.length; i++) {
			for (j=0; j<matrix[i].length; j++) {
				matrix[i][j].setAttribute("class", 
						(Math.floor((Math.random() * 10)) % 3 === 0) ? "alive" : "dead"
						);
			}
		}
    };

	this.uninitialize = function() {
		running = false;
    };

};


mendix.widget.declare( "GameOfLife.widget.GameOfLife", {
	addons      : [ 
        dijit._Templated,
        dijit._Contained
	],
	inputargs   : { 
        'height'      : 20,
        'width'       : 40,
        'runinterval' : 500
    },
	constructor : MxLife
});

delete window.MxLife;

