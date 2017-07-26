"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('Sketch-it/app', ['exports', 'ember', 'Sketch-it/resolver', 'ember-load-initializers', 'Sketch-it/config/environment'], function (exports, _ember, _SketchItResolver, _emberLoadInitializers, _SketchItConfigEnvironment) {

	var App = undefined;

	_ember['default'].MODEL_FACTORY_INJECTIONS = true;

	App = _ember['default'].Application.extend({
		modulePrefix: _SketchItConfigEnvironment['default'].modulePrefix,
		podModulePrefix: _SketchItConfigEnvironment['default'].podModulePrefix,
		Resolver: _SketchItResolver['default']
	});

	(0, _emberLoadInitializers['default'])(App, _SketchItConfigEnvironment['default'].modulePrefix);

	exports['default'] = App;
});
define('Sketch-it/components/animations/fade-slide', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({
		classNames: ['fadeClass'],

		didInsertElement: function didInsertElement() {
			this.$(".fadeBody").fadeOut(0);
			this.$(".fadeBody").fadeIn(1000);
		}
	});
});
define('Sketch-it/components/charts/radial-chart', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({

		classNames: ['radialChart']

	});
});
define('Sketch-it/components/chat-controller', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({

		classNames: ['chatController'],

		message: '',

		messages: [],

		didInsertElement: function didInsertElement() {
			_ember['default'].run.scheduleOnce('afterRender', this, function () {
				// - On render (initialize) scroll down
				this.send('scrollDown');
			});
		},

		messagesChanged: _ember['default'].observer('messages.[]', function () {
			// - On message scroll down
			this.send('scrollDown');
		}),

		actions: {

			scrollDown: function scrollDown() {
				var height = 0;

				// - Get all message height
				$('.chatContent li').each(function (i, value) {
					height += parseInt($(this).height());
				});

				var ScrollableArea = this.$(".chatContent");

				// - Scroll to bottom
				ScrollableArea.animate({ scrollTop: height }, "0");
			},

			sendMessage: function sendMessage() {
				this.sendAction('action', this.get('message'));
				this.set('message', '');
			}

		}

	});
});
define('Sketch-it/components/click-outside', ['exports', 'ember-click-outside/components/click-outside'], function (exports, _emberClickOutsideComponentsClickOutside) {
  exports['default'] = _emberClickOutsideComponentsClickOutside['default'];
});
define('Sketch-it/components/draw-area', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({
		brushEnabled: _ember['default'].computed('currentTool', function () {
			return this.get('currentTool') == 'brush';
		}),
		penEnabled: _ember['default'].computed('currentTool', function () {
			return this.get('currentTool') == 'pen';
		}),
		eraserEnabled: _ember['default'].computed('currentTool', function () {
			return this.get('currentTool') == 'eraser';
		}),
		rectangleEnabled: _ember['default'].computed('currentTool', function () {
			return this.get('currentTool') == 'rectangle';
		}),
		circleEnabled: _ember['default'].computed('currentTool', function () {
			return this.get('currentTool') == 'circle';
		}),
		fillEnabled: _ember['default'].computed('currentTool', function () {
			return this.get('currentTool') == 'fill';
		}),

		currentMousePos: { X: 0, Y: 0 },
		initialMousePos: { X: 0, Y: 0 },
		currentTool: 'brush',
		brushColor: '#000',
		brushSize: 10,
		enabled: false,

		states: [],
		pendingStates: [],

		externalImage: "",

		// - Context
		canvas: null,
		context: null,

		externalImageChange: (function () {
			var canvas = this.get("canvas");
			var img = this.get("externalImage");

			if (img == "") {
				var context = this.get('context');

				context.clearRect(0, 0, canvas.width, canvas.height);
			}

			var that = this;

			var image = new Image();
			image.onload = function () {
				var context = that.get('context');

				context.drawImage(image, 0, 0);
			};

			image.src = img;
		}).observes("externalImage"),

		didInsertElement: function didInsertElement() {
			var that = this;

			var cv = document.getElementById('paper');
			var ctx = null;

			if (cv && cv.getContext) {
				ctx = cv.getContext("2d");
			}

			this.set('canvas', cv);
			this.set('context', ctx);

			var firstClick = false;

			var saveState = function saveState() {
				var states = that.get('states');

				states = states.concat(that.get('pendingStates'));

				that.set('states', states);

				that.set('pendingStates', []);
			};

			var addState = function addState(tool, params) {
				var pendingStates = that.get('pendingStates');

				pendingStates.push({
					tool: tool,
					params: params,
					drawed: false
				});

				that.set('pendingStates', pendingStates);
			};

			var clearCurrentState = function clearCurrentState() {
				that.set('pendingStates', []);
			};

			var undo = function undo() {
				var states = that.get('states');

				if (states.length <= 0) {
					return;
				}

				while (!states[states.length - 1].params.first) {
					states.pop();
				}

				states.pop();

				that.set('states', states);

				clearCurrentState();

				that.send('ResetDrawing');
				that.send('DrawState');
			};

			var mouseMove = function mouseMove(mouse) {
				var currentMousePos = { X: 0, Y: 0 };
				var initialMousePos = that.get('initialMousePos');
				var lastMousePos = that.get('currentMousePos');

				// - Get current position
				currentMousePos.X = mouse.offsetX ? mouse.offsetX : mouse.pageX - mouse.target.offsetLeft;
				currentMousePos.Y = mouse.offsetY ? mouse.offsetY : mouse.pageY - mouse.target.offsetTop;

				// - Set the new position
				that.set('currentMousePos', currentMousePos);

				// - Draw using current tool
				var currentTool = that.get('currentTool');

				if (currentTool === 'brush') {
					addState(currentTool, {
						start: lastMousePos,
						end: currentMousePos,
						brushSize: that.get('brushSize') / 5,
						color: that.get('brushColor'),
						first: firstClick
					});
				}

				if (currentTool === 'pen') {
					addState('brush', {
						start: lastMousePos,
						end: currentMousePos,
						brushSize: 1,
						color: that.get('brushColor'),
						first: firstClick
					});
				}

				if (currentTool === 'eraser') {
					addState('brush', {
						start: lastMousePos,
						end: currentMousePos,
						brushSize: that.get('brushSize') / 5,
						color: "#FFF",
						first: firstClick
					});
				}

				if (currentTool === 'rectangle') {
					var width = currentMousePos.X - initialMousePos.X;
					var height = currentMousePos.Y - initialMousePos.Y;

					that.set('pendingStates', []);
					that.send('ResetDrawing');

					// - Draw a rectangle
					addState(currentTool, {
						start: initialMousePos,
						size: { width: width, height: height },
						brushSize: that.get('brushSize') / 5,
						color: that.get('brushColor'),
						first: true
					});
				}

				if (currentTool === 'circle') {
					that.set('pendingStates', []);
					that.send('ResetDrawing');

					// - Draw a rectangle
					addState(currentTool, {
						start: initialMousePos,
						size: currentMousePos,
						brushSize: that.get('brushSize') / 5,
						color: that.get('brushColor'),
						first: true
					});
				}

				that.send('DrawState');

				firstClick = false;
			};

			var mouseDownActions = function mouseDownActions(mouse) {
				// - Draw using current tool
				var currentTool = that.get('currentTool');

				var initialMousePos = that.get('initialMousePos');

				if (currentTool === 'fill') {
					that.set('pendingStates', []);
					that.send('ResetDrawing');

					// - Draw a rectangle
					addState(currentTool, {
						start: initialMousePos,
						color: that.get('brushColor'),
						first: true
					});

					that.send('DrawState');
				}
			};

			var mouseUp = function mouseUp(mouse) {
				var context = that.get('context');
				var canvas = that.get('canvas');

				saveState();

				//if mouse is not being pressed then don't draw anything
				canvas.removeEventListener('mousemove', mouseMove, false);
				canvas.removeEventListener('mouseup', mouseUp, false);

				that.send('DrawState');
			};

			var mouseDown = function mouseDown(mouse) {
				if (!that.get('enabled')) {
					// - Canvas disabled
					return;
				}

				// - If left button pressed
				if (mouse.which != 3 && mouse.which != 2) {
					var canvas = that.get('canvas');

					var currentMousePos = { X: 0, Y: 0 };

					// - Save start position
					currentMousePos.X = mouse.offsetX ? mouse.offsetX : mouse.pageX - mouse.target.offsetLeft;
					currentMousePos.Y = mouse.offsetY ? mouse.offsetY : mouse.pageY - mouse.target.offsetTop;

					that.set('initialMousePos', currentMousePos);
					that.set('currentMousePos', currentMousePos);

					firstClick = true;

					// - Add listener for mouse move and key up
					canvas.addEventListener('mousemove', mouseMove, false);
					canvas.addEventListener('mouseup', mouseUp, false);

					mouseDownActions(mouse);
				}

				if (mouse.which == 3) {
					clearCurrentState();

					that.send('DrawState');
				}
			};

			function KeyPress(e) {
				var evtobj = window.event ? event : e;

				if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
					undo();
				}
			}

			cv.onmousedown = mouseDown;
			document.onkeydown = KeyPress;

			// - Update cycle
			function refreshCycle() {
				that.send('DrawState');
				setTimeout(refreshCycle, 1000);
			}

			this.send('ResetDrawing');

			refreshCycle();
		},

		actions: {

			setTool: function setTool(tool) {

				if (tool === 'clear') {
					this.set('states', []);
					this.set('pendingStates', []);
					this.send('ResetDrawing');
					this.send('DrawState');
				} else this.set('currentTool', tool);
			},

			ResetDrawing: function ResetDrawing() {
				var states = this.get('states');

				for (var i = states.length - 1; i >= 0; i--) {
					states[i].drawed = false;
				}

				this.set('states', states);

				states = this.get('pendingStates');

				for (var i = states.length - 1; i >= 0; i--) {
					states[i].drawed = false;
				}

				this.set('pendingStates', states);

				var context = this.get('context');
				var canvas = this.get('canvas');

				context.clearRect(0, 0, canvas.width, canvas.height);

				context.fillStyle = "#FFF";
				context.fillRect(0, 0, canvas.width, canvas.height);
			},

			DrawState: function DrawState() {
				var context = this.get('context');
				var canvas = this.get('canvas');

				var states = this.get('states');
				var pendingStates = this.get('pendingStates');

				var colorTreshold = 0.9;

				states = states.concat(pendingStates);

				for (var i = 0; i < states.length; i++) {
					var state = states[i];

					if (state.drawed) continue;

					state.drawed = true;

					if (state.tool === 'brush') {

						context.lineWidth = state.params.brushSize;
						context.strokeStyle = state.params.color;
						context.lineCap = "round";
						context.lineJoin = "round";

						// - Start a new path
						context.beginPath();

						// - Move to x and y coordinates where mouse was pressed
						context.moveTo(state.params.start.X, state.params.start.Y);

						// - Draw a line
						context.lineTo(state.params.end.X, state.params.end.Y);

						// - Give a stroke/fill to our line
						context.stroke();

						// - Close the path/'stop drawing'
						context.closePath();
					}

					if (state.tool === 'rectangle') {

						context.lineWidth = state.params.brushSize;
						context.strokeStyle = state.params.color;
						context.lineCap = "round";
						context.lineJoin = "round";

						// - Draw the rectangle
						context.strokeRect(state.params.start.X, state.params.start.Y, state.params.size.width, state.params.size.height);
					}

					if (state.tool === 'circle') {

						context.lineWidth = state.params.brushSize;
						context.strokeStyle = state.params.color;
						context.lineCap = "round";
						context.lineJoin = "round";

						context.beginPath();

						var RX = state.params.size.X - state.params.start.X;
						var RY = state.params.size.Y - state.params.start.Y;
						var R = RX > RY ? RX : RY;

						// - Draw the circle
						context.arc(state.params.start.X, state.params.start.Y, R, 0, 2 * Math.PI);

						context.stroke();
					}

					if (state.tool === 'fill') {
						var fillColor;
						var colorLayerData;
						var outlineLayerData;
						var startX;
						var startY;
						var pixelPos;
						var r;
						var g;
						var b;
						var a;

						var _ret = (function () {
							var hexToRgb = function hexToRgb(hex) {
								var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

								hex = hex.replace(shorthandRegex, function (m, r, g, b) {
									return r + r + g + g + b + b;
								});

								var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

								return result ? {
									r: parseInt(result[1], 16),
									g: parseInt(result[2], 16),
									b: parseInt(result[3], 16)
								} : null;
							}

							// - Get fill color
							;

							var matchOutlineColor = function matchOutlineColor(r, g, b, a) {
								return r + g + b < 100 && a === 255;
							};

							var matchStartColor = function matchStartColor(pixelPos, startR, startG, startB, startA) {
								var r = outlineLayerData.data[pixelPos];
								var g = outlineLayerData.data[pixelPos + 1];
								var b = outlineLayerData.data[pixelPos + 2];
								var a = outlineLayerData.data[pixelPos + 3];

								// - If current pixel of the outline image is black
								if (matchOutlineColor(r, g, b, a)) {
									return false;
								}

								r = colorLayerData.data[pixelPos];
								g = colorLayerData.data[pixelPos + 1];
								b = colorLayerData.data[pixelPos + 2];
								a = colorLayerData.data[pixelPos + 3];

								// - If current pixel matches the new color
								if (r === fillColor.r && g === fillColor.g && b === fillColor.b) {
									return 0;
								}

								// - Xalculate differences between reds, greens and blues
								var rd = 255 - Math.abs(r - startR);
								var gd = 255 - Math.abs(g - startG);
								var bd = 255 - Math.abs(b - startB);

								// - Limit differences between 0 and 1
								rd /= 255;
								gd /= 255;
								bd /= 255;

								// - 0 means opposit colors, 1 means same colors
								var similar = (rd + gd + bd) / 3;

								if (a === startA) {
									return similar;
								}
							};

							var colorPixel = function colorPixel(pixelPos, r, g, b, a, treshold) {
								var or = colorLayerData.data[pixelPos];
								var og = colorLayerData.data[pixelPos + 1];
								var ob = colorLayerData.data[pixelPos + 2];
								var oa = colorLayerData.data[pixelPos + 3];

								colorLayerData.data[pixelPos] = r * treshold + or * (1 - treshold);
								colorLayerData.data[pixelPos + 1] = g * treshold + og * (1 - treshold);
								colorLayerData.data[pixelPos + 2] = b * treshold + ob * (1 - treshold);
								colorLayerData.data[pixelPos + 3] = a * treshold + oa * (1 - treshold);
							};

							var floodFill = function floodFill(startX, startY, startR, startG, startB, startA) {
								var newPos, x, y;
								var pixelPos, reachLeft, reachRight;
								var drawingBoundLeft = 0;
								var drawingBoundTop = 0;
								var drawingBoundRight = 0 + canvas.width - 1;
								var drawingBoundBottom = 0 + canvas.height - 1;
								var pixelStack = [[startX, startY]];

								while (pixelStack.length) {
									newPos = pixelStack.pop();
									x = newPos[0];
									y = newPos[1];

									// - Get current pixel position
									pixelPos = (y * canvas.width + x) * 4;

									// - Go up as long as the color matches and are inside the canvas
									while (y >= drawingBoundTop && matchStartColor(pixelPos, startR, startG, startB, startA) > colorTreshold) {
										y -= 1;
										pixelPos -= canvas.width * 4;
									}

									pixelPos += canvas.width * 4;
									y += 1;
									reachLeft = false;
									reachRight = false;

									// - Go down as long as the color matches and in inside the canvas
									while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB, startA) > colorTreshold) {
										y += 1;

										colorPixel(pixelPos, fillColor.r, fillColor.g, fillColor.b, 255, matchStartColor(pixelPos, startR, startG, startB, startA));

										if (x > drawingBoundLeft) {
											if (matchStartColor(pixelPos - 4, startR, startG, startB, startA) > colorTreshold) {
												if (!reachLeft) {
													// - Add pixel to stack
													pixelStack.push([x - 1, y]);
													reachLeft = true;
												}
											} else if (reachLeft) {
												reachLeft = false;
											}
										}

										if (x < drawingBoundRight) {
											if (matchStartColor(pixelPos + 4, startR, startG, startB, startA) > colorTreshold) {
												if (!reachRight) {
													// - Add pixel to stack
													pixelStack.push([x + 1, y]);
													reachRight = true;
												}
											} else if (reachRight) {
												reachRight = false;
											}
										}

										pixelPos += canvas.width * 4;
									}
								}
							};

							fillColor = hexToRgb(state.params.color);

							// - Get pixel layers
							colorLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
							outlineLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
							;

							;

							;

							;

							startX = state.params.start.X;
							startY = state.params.start.Y;
							pixelPos = (startY * canvas.width + startX) * 4;
							r = colorLayerData.data[pixelPos];
							g = colorLayerData.data[pixelPos + 1];
							b = colorLayerData.data[pixelPos + 2];
							a = colorLayerData.data[pixelPos + 3];

							if (r === fillColor.r && g === fillColor.g && b === fillColor.b && a != 0) {
								// - Return because trying to fill with the same color
								return {
									v: undefined
								};
							}

							if (matchOutlineColor(r, g, b, a)) {
								// - Return because clicked outline
								return {
									v: undefined
								};
							}

							floodFill(startX, startY, r, g, b, a);

							// - Draw the current state of the color layer to the canvas
							context.putImageData(colorLayerData, 0, 0);
						})();

						if (typeof _ret === 'object') return _ret.v;
					}
				}

				states = this.get('states');

				for (var i = 0; i < states.length; i++) {
					states[i].drawed = true;
				}

				this.set('states', states);

				this.sendAction('changed', canvas.toDataURL("image/jpg"));
			}

		}
	});
});
define('Sketch-it/components/friend-block', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({});
});
define('Sketch-it/components/game-result', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({
		classNames: ['gameEndPopup'],

		users: [{ name: 'Username', score: 120 }, { name: 'Beatrice', score: 90 }, { name: 'Maria', score: 68 }],

		drawings: [{
			file: "assets/images/penna.png",
			author: "Username",
			word: "Pen",
			round: 15,

			scoreboard: [{ name: "Maria", found: true, time: 20 }, { name: "Beatrice", found: true, time: 32 }]
		}, {
			file: "assets/images/joypad.png",
			author: "Mario",
			word: "Joypad",
			round: 3,

			scoreboard: [{ name: "Giorgio", found: true, time: 13 }, { name: "Maario", found: true, time: 27 }, { name: "Frumento", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }]
		}, {
			file: "assets/images/alba.png",
			author: "Mario",
			word: "Cane",
			round: 3,

			scoreboard: [{ name: "Giorgio", found: true, time: 13 }, { name: "Maario", found: true, time: 27 }, { name: "Frumento", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }]
		}, {
			file: "assets/images/bussola.png",
			author: "Mario",
			word: "Cane",
			round: 3,

			scoreboard: [{ name: "Giorgio", found: true, time: 13 }, { name: "Maario", found: true, time: 27 }, { name: "Frumento", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }]
		}, {
			file: "assets/images/star.png",
			author: "Vivaldi",
			word: "Stela",
			round: 7,

			scoreboard: [{ name: "Giorgio", found: true, time: 13 }, { name: "Maario", found: true, time: 27 }, { name: "Frumento", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }]
		}, {
			file: "assets/images/dog.jpg",
			author: "Fanciullo",
			word: "Motocarro a vapore",
			round: 10,

			scoreboard: [{ name: "Giorgio", found: true, time: 13 }, { name: "Maario", found: true, time: 27 }, { name: "Frumento", found: false, time: 0 }, { name: "Vermentino", found: false, time: 0 }]
		}],

		selected: null,

		visible: false,

		init: function init() {
			this._super(arguments);
		},

		didInsertElement: function didInsertElement() {
			var that = this;

			this.$(".overlay").hide();

			this.send('selectImage', this.get('drawings.0'));
		},

		valueObserver: _ember['default'].observer('visible', function (sender, key, value, rev) {
			value = this.get('visible');

			if (value) {
				this.$(".overlay").fadeIn(500);
			} else {
				this.$(".overlay").fadeOut(500);
			}
		}),

		actions: {
			selectImage: function selectImage(img) {
				this.set('selected', img);
			},

			exit: function exit() {
				this.set('visible', false);
			},

			newGame: function newGame() {
				this.set('visible', false);
			}
		}
	});
});
define('Sketch-it/components/inputs/default-button', ['exports', 'ember'], function (exports, _ember) {

	var DefaultButtonComponent = _ember['default'].Component.extend({

		tagName: 'default-button',

		actions: {
			click: function click() {

				this.sendAction();
			}
		}

	});

	exports['default'] = DefaultButtonComponent;
});
define('Sketch-it/components/inputs/default-checkbox', ['exports', 'ember'], function (exports, _ember) {

	var DefaultCheckboxComponent = _ember['default'].Component.extend({

		tagName: 'checkbox'

	});

	exports['default'] = DefaultCheckboxComponent;
});
define("Sketch-it/components/inputs/default-color", ["exports", "ember"], function (exports, _ember) {
	exports["default"] = _ember["default"].Component.extend({
		tagName: "defaultcolor"
	});
});
define('Sketch-it/components/inputs/default-confirm-button', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({
		tagName: 'confirmButton',

		open: false,

		click: function click(e) {
			if (this.get("disabled")) {
				return;
			}

			if (this.get("open")) {
				this.sendAction();
			}

			if (!this.get("open")) {
				this.$("button").attr('class', 'open');

				this.set("open", true);
			}

			e.stopPropagation();
		},

		actions: {
			outClick: function outClick() {
				if (this.get("open")) {
					this.$("button").attr('class', '');

					this.set("open", false);
				}
			}
		}

	});
});
define('Sketch-it/components/inputs/default-numberbox', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({
		tagName: 'numberbox'

	});
});
define('Sketch-it/components/inputs/default-radiobutton', ['exports', 'ember'], function (exports, _ember) {

	var DefaultRadiobuttonComponent = _ember['default'].Component.extend({

		tagName: 'radiobutton',

		getId: _ember['default'].computed('name', 'value', function () {

			return this.get('name') + '/' + this.get('value');
		})

	});

	exports['default'] = DefaultRadiobuttonComponent;
});
define('Sketch-it/components/inputs/default-select', ['exports', 'ember'], function (exports, _ember) {

	var InputsDefaultSelectComponent = _ember['default'].Component.extend({

		tagName: 'selectQuery',

		// - Options
		menuOpened: false,
		search: true,

		// - Data
		data: [],
		searchValue: "",

		currentSelected: _ember['default'].computed('data.@each.selected', function () {
			var items = this.get('data');

			return items.find(function (elem) {
				return elem.selected;
			});
		}),

		// - Filtered data
		items: _ember['default'].computed('data', 'searchValue', function () {
			var that = this;

			return this.get('data').filter(function (val) {

				var currName = val.name.toLowerCase();
				var searchQuery = that.get('searchValue').toLowerCase();

				return currName.includes(searchQuery);
			});
		}),

		init: function init() {

			this._super();
		},

		actions: {

			outClick: function outClick() {

				if (this.get('menuOpened')) {
					this.send('toggleMenu');
				}
			},

			selected: function selected(elem) {

				var items = this.get('data');

				for (var i = 0; i < items.length; ++i) {
					this.set('data.' + i + '.selected', items[i] === elem);
				}

				this.send('toggleMenu');

				this.sendAction('action', elem);
			},

			toggleMenu: function toggleMenu() {

				this.set('searchValue', "");

				var menuOpened = this.get('menuOpened');

				if (menuOpened) {
					this.$('.optionsMenu').stop().fadeOut(200);
				} else {
					this.$('.optionsMenu').stop().fadeIn(200);
				}

				this.set('menuOpened', !menuOpened);
			}

		}

	});

	exports['default'] = InputsDefaultSelectComponent;
});
define('Sketch-it/components/inputs/default-slider', ['exports', 'ember'], function (exports, _ember) {

	var DefaultSliderComponent = _ember['default'].Component.extend({

		tagName: 'slider',

		// - Slider initial value
		currentValue: 50,

		init: function init() {

			this._super();

			this.set("currentValue", this.get("min"));
		},

		haveText: _ember['default'].computed('label', function () {

			return this.get("label") !== undefined;
		})

	});

	exports['default'] = DefaultSliderComponent;
});
define('Sketch-it/components/inputs/default-textbox', ['exports', 'ember'], function (exports, _ember) {

	var DefaultTextboxComponent = _ember['default'].Component.extend({
		tagName: 'textbox',
		currValue: '',

		actions: {
			change: function change() {
				this.sendAction('onChange', this.get('currValue'));
			},

			enter: function enter() {
				this.sendAction('onEnter', this.get('currValue'));
			}
		}
	});

	exports['default'] = DefaultTextboxComponent;
});
define('Sketch-it/components/inputs/fa-button', ['exports', 'ember'], function (exports, _ember) {

	var FaButtonComponent = _ember['default'].Component.extend({

		tagName: 'fa-button',

		actions: {
			click: function click() {
				this.sendAction();
			}
		}
	});

	exports['default'] = FaButtonComponent;
});
define('Sketch-it/components/inputs/select-item', ['exports', 'ember'], function (exports, _ember) {

	var InputsSelectItemComponent = _ember['default'].Component.extend({

		tagName: 'li',

		selected: false,

		content: null,

		hasDescription: _ember['default'].computed('content', function () {

			return this.get('content').description != null && this.get('content').description !== undefined;
		}),

		click: function click() {

			this.sendAction('action', this.get('content'));
		}

	});

	exports['default'] = InputsSelectItemComponent;
});
define("Sketch-it/components/notifications-menu", ["exports", "ember"], function (exports, _ember) {
	exports["default"] = _ember["default"].Component.extend({

		notifications: [{ name: "Francesco", description: "Invited you to join in a room.", time: "6 seconds ago" }, { name: "Beatrice", description: "Invited you to join in a room.", time: "13 seconds ago" }, { name: "Giovanni", description: "Invited you to join in a room.", time: "2 minutes ago" }, { name: "Giorgio", description: "Invited you to join in a room.", time: "6 minutes ago" }, { name: "Maria", description: "Invited you to join in a room.", time: "20 minutes ago" }, { name: "Rose", description: "Invited you to join in a room.", time: "22 minutes ago" }, { name: "Eva", description: "Invited you to join in a room.", time: "30 minutes ago" }]

	});
});
define('Sketch-it/components/room-list-entry', ['exports', 'ember'], function (exports, _ember) {

	var Moment = require('moment');

	exports['default'] = _ember['default'].Component.extend({
		classNames: ['roomListEntry'],

		// - If tab is open
		open: false,

		data: {
			name: "",
			language: "",
			description: "",
			creation: Date.now(),

			currentRound: 0,
			maxRounds: 0,

			maxPlayers: 0,
			users: []
		},

		// - Calculate the room owner
		owner: _ember['default'].computed('data', function () {
			var users = this.get('data').users;

			return users.filter(function (val) {
				return val.owner === true;
			})[0];
		}),

		timestamp: _ember['default'].computed('data', function () {
			return Moment(this.get('data.creation')).format("YYYY-MM-DD h:mm:ss a");
		}),

		init: function init() {
			this._super(arguments);
		},

		didInsertElement: function didInsertElement() {
			var that = this;

			this.$("#expand").slideUp(0);

			this.$("#row, #expand").click(function () {
				that.send("click");
			});

			this.$("#row, #expand").mouseover(function () {
				that.send("over");
			});

			this.$("#row, #expand").mouseout(function () {
				that.send("out");
			});
		},

		actions: {
			outClick: function outClick() {
				if (!this.get('open')) {
					this.$(".expanded").slideUp(0);
				}
			},

			over: function over() {
				if (!this.get('open')) {
					this.$("#expand").slideDown(0);
				}
			},

			out: function out() {
				if (!this.get('open')) {
					this.$("#expand").slideUp(0);
				}
			},

			click: function click() {
				if (!this.get('open')) {
					this.$(".expanded").slideDown(0);
					this.$("#expand").slideUp(0);
				} else {
					this.$(".expanded").slideUp(0);
				}

				this.set('open', !this.get('open'));
			},

			join: function join() {
				this.sendAction('action', this.get('data'));
			}
		}

	});
});
define('Sketch-it/components/room-list-new', ['exports', 'ember', 'Sketch-it/config/environment'], function (exports, _ember, _SketchItConfigEnvironment) {
	exports['default'] = _ember['default'].Component.extend({

		classNames: ['roomListEntryNew'],
		open: false,

		supportedLanguages: _SketchItConfigEnvironment['default'].APP.supportedLanguages,

		// - Data
		roomName: '',
		roomPassword: '',
		roomDescription: '',
		endlessMode: false,
		enableAway: false,
		enableHints: true,
		language: 'en',
		maxPlayers: 4,
		maxRounds: 7,

		init: function init() {
			this._super(arguments);
		},

		didInsertElement: function didInsertElement() {
			var that = this;

			this.$(".name").click(function () {
				that.send("click");
			});
		},

		cantConfirm: _ember['default'].computed('roomName', function () {
			return this.get('roomName') === '';
		}),

		actions: {
			outClick: function outClick() {
				if (!this.get('open')) {
					this.$(".expanded").slideUp(0);
				}
			},

			click: function click() {
				if (!this.get('open')) {
					this.$(".expanded").slideDown(0);
					this.$("#confirmButton").show();
				} else {
					this.$(".expanded").slideUp(0);
					this.$("#confirmButton").hide();
				}

				this.set('open', !this.get('open'));
			},

			create: function create() {
				var data = {
					name: this.get('roomName'),
					password: this.get('roomPassword'),
					description: this.get('roomDescription'),
					endlessMode: this.get('endlessMode'),
					enableAway: this.get('enableAway'),
					enableHints: this.get('enableHints'),
					language: this.get('language'),
					maxPlayers: this.get('maxPlayers'),
					maxRounds: this.get('maxRounds')
				};

				console.log(data);

				this.sendAction('action', data);
			}
		}

	});
});
define('Sketch-it/components/top-bar', ['exports', 'ember'], function (exports, _ember) {
	var Electron = require('electron');

	var TopBarComponent = _ember['default'].Component.extend({

		tagName: 'div',
		classNames: ['topbar'],
		classNameBindings: ['topbarBorder'],

		server: _ember['default'].inject.service('server'),

		// - Window hinstance
		window: Electron.remote.getCurrentWindow(),

		// - Options
		topbarBorder: false,
		canMinimize: true,
		canClose: true,
		showTitle: true,
		userLogged: false,
		hasNotifications: true,
		userPopup: false,
		cantLogout: false,

		click: function click(event) {
			event.stopPropagation();
		},

		actions: {

			appClose: function appClose() {
				this.get('window').close();
			},

			logOut: function logOut() {
				var server = this.get('server');

				server.disconnect();

				this.get('router').transitionTo('index');
			},

			appMinimize: function appMinimize() {
				this.get('window').minimize();
			},

			userNotifications: function userNotifications() {
				return;
			},

			openUserPopup: function openUserPopup() {
				this.set('userPopup', !this.get('userPopup'));
			}
		}
	});

	exports['default'] = TopBarComponent;
});
define('Sketch-it/components/user-profile', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({
		classNames: ['userPopup'],

		// - Popup visible
		visible: false,

		// - User data
		user: {
			name: "Username",
			language: "it",
			description: "Hi I'm Username, I was born in Sardinia and I like to draw everything I see.",
			wins: 64,
			wordsFound: 210,
			totalGames: 43,
			playTime: "23h",
			memberSince: "1yr",

			friends: [{ name: "Mario", online: true }, { name: "Giovanni", online: true }, { name: "Beatrice", online: true }, { name: "George", online: true }, { name: "Alex", online: true }, { name: "Uovo", online: false }, { name: "TestUtente", online: false }, { name: "Mannia", online: false }]
		},

		init: function init() {
			this._super(arguments);
		},

		didInsertElement: function didInsertElement() {
			var that = this;

			_ember['default'].$(".userPopup > .overlay").hide();
		},

		valueObserver: _ember['default'].observer('visible', function (sender, key, value, rev) {
			value = this.get('visible');

			if (value) {
				_ember['default'].$(".userPopup > .overlay").fadeIn(500);
			} else {
				_ember['default'].$(".userPopup > .overlay").fadeOut(500);
			}
		}),

		actions: {
			outClick: function outClick() {
				if (this.get('visible')) {
					this.set('visible', false);
				}
			}
		}
	});
});
define('Sketch-it/electron/browser-qunit-adapter', ['exports'], function (exports) {
  /* global QUnit, io */

  ;(function (window) {
    'use strict';

    // Exit immediately if we're not running in Electron
    if (!window.ELECTRON) {
      return;
    }

    // Adapted from Testem's default qunit-adapter.
    function qunitAdapter(socket) {
      var currentTest = undefined,
          currentModule = undefined;
      var id = 1;
      var results = {
        failed: 0,
        passed: 0,
        total: 0,
        skipped: 0,
        tests: []
      };

      QUnit.log(function (details) {
        var item = {
          passed: details.result,
          message: details.message
        };

        if (!details.result) {
          item.actual = details.actual;
          item.expected = details.expected;
        }

        currentTest.items.push(item);
      });

      QUnit.testStart(function (details) {
        currentTest = {
          id: id++,
          name: (currentModule ? currentModule + ': ' : '') + details.name,
          items: []
        };
        socket.emit('tests-start');
      });

      QUnit.testDone(function (details) {
        currentTest.failed = details.failed;
        currentTest.passed = details.passed;
        currentTest.total = details.total;

        results.total++;

        if (currentTest.failed > 0) {
          results.failed++;
        } else {
          results.passed++;
        }

        results.tests.push(currentTest);
        socket.emit('test-result', currentTest);
      });

      QUnit.moduleStart(function (details) {
        currentModule = details.name;
      });

      QUnit.done(function (details) {
        results.runDuration = details.runtime;
        socket.emit('all-test-results', results);
      });
    }

    function setQUnitAdapter(serverURL) {
      var socket = io(serverURL);

      socket.on('connect', function () {
        return socket.emit('browser-login', 'Electron', 1);
      });
      socket.on('start-tests', function () {
        socket.disconnect();
        window.location.reload();
      });

      qunitAdapter(socket);
    }

    window.addEventListener('load', function () {
      setQUnitAdapter(process.env.ELECTRON_TESTEM_SERVER_URL);
    });
  })(this);
});
define('Sketch-it/electron/reload', ['exports'], function (exports) {
  /* jshint browser: true */
  ;(function () {
    'use strict';

    // Exit immediately if we're not running in Electron
    if (!window.ELECTRON) {
      return;
    }

    // Reload the page when anything in `dist` changes
    var fs = window.requireNode('fs');
    var path = window.requireNode('path');

    /**
     * Watch a given directory for changes and reload
     * on change
     *
     * @param sub directory
     */
    var watch = function watch(sub) {
      var dirname = __dirname || path.resolve(path.dirname());
      var isInTest = !!window.QUnit;

      if (isInTest) {
        // In tests, __dirname is `<project>/tmp/<broccoli-dist-path>/tests`.
        // In normal `ember:electron` it's `<project>/dist`.
        // To achieve the regular behavior in testing, go to parent dir, which contains `tests` and `assets`
        dirname = path.join(dirname, '..');
      }

      if (sub) {
        dirname = path.join(dirname, sub);
      }

      fs.watch(dirname, { recursive: true }, function (e) {
        window.location.reload();
      });
    };

    /**
     * Install Devtron in the current window.
     */
    var installDevtron = function installDevtron() {
      var devtron = window.requireNode('devtron');

      if (devtron) {
        devtron.install();
      }
    };

    /**
     * Install Ember-Inspector in the current window.
     */
    var installEmberInspector = function installEmberInspector() {
      var location = path.join('node_modules', 'ember-inspector', 'dist', 'chrome');

      fs.lstat(location, function (err, results) {
        if (err) {
          return;
        }

        if (results && results.isDirectory && results.isDirectory()) {
          var BrowserWindow = window.requireNode('electron').remote.BrowserWindow;
          try {
            BrowserWindow.addDevToolsExtension(location);
          } catch (err) {
            // no-op
          }
        }
      });
    };

    document.addEventListener('DOMContentLoaded', function (e) {
      var dirname = __dirname || path.resolve(path.dirname());

      fs.stat(dirname, function (err, stat) {
        if (!err) {
          watch();

          // On linux, the recursive `watch` command is not fully supported:
          // https://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener
          //
          // However, the recursive option WILL watch direct children of the
          // given directory.  So, this hack just manually sets up watches on
          // the expected subdirs -- that is, `assets` and `tests`.
          if (process.platform === 'linux') {
            watch('/assets');
            watch('/tests');
          }
        }
      });

      installDevtron();
      installEmberInspector();
    });
  })();
});
define('Sketch-it/electron/tap-qunit-adapter', ['exports'], function (exports) {
  /* global QUnit */

  ;(function (window) {
    'use strict';

    // Exit immediately if we're not running in Electron
    if (!window.ELECTRON) {
      return;
    }

    // Log QUnit results to the console so they show up
    // in the `Electron` process output.
    function log(content) {
      console.log('[qunit-logger] ' + content);
      process.stdout.write('[qunit-logger] ' + content);
    }

    function setQUnitAdapter() {
      var testCount = 0;

      QUnit.begin(function (details) {
        if (details.totalTests >= 1) {
          log('1..' + details.totalTests);
        }
      });

      QUnit.testDone(function (details) {
        testCount++;
        if (details.failed === 0) {
          log('ok ' + testCount + ' - ' + details.module + ' # ' + details.name);
        }
      });

      QUnit.log(function (details) {
        if (details.result !== true) {
          var actualTestCount = testCount + 1;
          log('# ' + JSON.stringify(details));
          log('not ok ' + actualTestCount + ' - ' + details.module + ' - ' + details.name);
        }
      });

      QUnit.done(function (details) {
        log('# done' + (details.failed === 0 ? '' : ' with errors'));
      });
    }

    window.addEventListener('load', setQUnitAdapter);
  })(this);
});
define('Sketch-it/helpers/app-version', ['exports', 'ember', 'Sketch-it/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _SketchItConfigEnvironment, _emberCliAppVersionUtilsRegexp) {
  exports.appVersion = appVersion;
  var version = _SketchItConfigEnvironment['default'].APP.version;

  function appVersion(_) {
    var hash = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (hash.hideSha) {
      return version.match(_emberCliAppVersionUtilsRegexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_emberCliAppVersionUtilsRegexp.shaRegExp)[0];
    }

    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('Sketch-it/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('Sketch-it/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('Sketch-it/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'Sketch-it/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _SketchItConfigEnvironment) {
  var _config$APP = _SketchItConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('Sketch-it/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('Sketch-it/initializers/data-adapter', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('Sketch-it/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _emberDataSetupContainer, _emberData) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('Sketch-it/initializers/export-application-global', ['exports', 'ember', 'Sketch-it/config/environment'], function (exports, _ember, _SketchItConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_SketchItConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _SketchItConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_SketchItConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('Sketch-it/initializers/flags', ['exports', 'Sketch-it/config/environment'], function (exports, _SketchItConfigEnvironment) {
	exports.initialize = initialize;

	function initialize() {
		_SketchItConfigEnvironment['default'].APP.supportedLanguages = [{ name: 'Italy', description: 'Italiano', html: '<span class="flag-icon flag-icon-it"></span>' }, { name: 'English', description: 'Inglese', html: '<span class="flag-icon flag-icon-gb"></span>', selected: true }];

		_SketchItConfigEnvironment['default'].APP.allLanguages = [{ name: 'Italy', description: 'Italiano', html: '<span class="flag-icon flag-icon-it"></span>' }, { name: 'France', description: 'Francia', html: '<span class="flag-icon flag-icon-fr"></span>' }, { name: 'English', description: 'Inglese', html: '<span class="flag-icon flag-icon-gb"></span>', selected: true }, { name: 'Japanese', description: 'Giapponese', html: '<span class="flag-icon flag-icon-jp"></span>' }, { name: 'Chinese', description: 'Cinese', html: '<span class="flag-icon flag-icon-ch"></span>' }, { name: 'Russian', description: 'Russo', html: '<span class="flag-icon flag-icon-ru"></span>' }, { name: 'Egypt', description: 'Egitto', html: '<span class="flag-icon flag-icon-eg"></span>' }, { name: 'Ghana', description: 'Ghana', html: '<span class="flag-icon flag-icon-gh"></span>' }, { name: 'Guinea', description: 'Guinea', html: '<span class="flag-icon flag-icon-gn"></span>' }, { name: 'Nigeria', description: 'Nigeria', html: '<span class="flag-icon flag-icon-ng"></span>' }];
	}

	exports['default'] = {
		name: 'flags',
		initialize: initialize
	};
});
define('Sketch-it/initializers/global-router', ['exports'], function (exports) {
  exports.initialize = initialize;
  // app/initializers/component-router-injector.js

  function initialize(application) {
    // Injects all Ember components with a router object:
    application.inject('component', 'router', 'router:main');
  }

  exports['default'] = {
    name: 'component-router-injector',
    initialize: initialize
  };
});
define('Sketch-it/initializers/injectStore', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('Sketch-it/initializers/local-storage-adapter', ['exports', 'ember-local-storage/initializers/local-storage-adapter'], function (exports, _emberLocalStorageInitializersLocalStorageAdapter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLocalStorageInitializersLocalStorageAdapter['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberLocalStorageInitializersLocalStorageAdapter.initialize;
    }
  });
});
define('Sketch-it/initializers/store', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('Sketch-it/initializers/transforms', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("Sketch-it/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _emberDataInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataInstanceInitializersInitializeStoreService["default"]
  };
});
define('Sketch-it/instance-initializers/server-data', ['exports'], function (exports) {
	exports.initialize = initialize;

	function initialize(container) {

		// User initialization
	}

	exports['default'] = {
		name: 'server-data',
		initialize: initialize
	};
});
define('Sketch-it/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('Sketch-it/router', ['exports', 'ember', 'Sketch-it/config/environment'], function (exports, _ember, _SketchItConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _SketchItConfigEnvironment['default'].locationType,
    rootURL: _SketchItConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('register');
    this.route('lobby');
    this.route('gameplay');
  });

  exports['default'] = Router;
});
define('Sketch-it/routes/gameplay', ['exports', 'ember'], function (exports, _ember) {

	var DataURI = require('datauri').promise;

	exports['default'] = _ember['default'].Route.extend({
		server: _ember['default'].inject.service('server'),

		modelData: {
			users: [],

			messages: [],

			maxRound: 0,
			currentRound: 0,
			timeLeft: 100,
			realTime: 120,
			currentWord: "",
			definition: "",
			drawing: false,
			maxTime: 0,

			userPopupState: false,

			endGamePopupState: false,

			timer: null,

			extImage: ""
		},

		activate: function activate() {
			var server = this.get('server');

			var that = this;

			// - Reset message handlers
			server.off('message');

			var data = {
				command: 'Gameplay/RoundInfo'
			};

			server.send(JSON.stringify(data));

			// - Server messages handler
			server.on('message', function (content) {
				var data = JSON.parse(content);

				switch (data.command) {
					case "Chat/Message":

						var messages = that.get('modelData.messages');

						messages.pushObject({

							content: data.parameters.content,
							system: data.parameters.username === "",
							user: data.parameters.username,
							score: data.parameters.score

						});

						// - Add a message to the chat
						that.set('modelData.messages', messages);

						break;

					case "Gameplay/RoundInfo":

						var info = data.parameters;

						var restartTimer = false;

						if (that.get('modelData.currentWord') == "" && info.currentWord != "") restartTimer = true;

						var timer = that.get('modelData.timer');

						clearInterval(timer);

						that.set('modelData.users', info.users.sort(function (a, b) {
							return a.score - b.score;
						}));
						that.set('modelData.maxRound', info.maxRounds);
						that.set('modelData.currentRound', info.roundNumber);
						that.set('modelData.timeLeft', info.secondsLeft / info.maxTime * 100);
						that.set('modelData.realTime', info.secondsLeft);
						that.set('modelData.currentWord', info.currentWord);
						that.set('modelData.definition', info.definition);
						that.set('modelData.drawing', info.drawing);
						that.set('modelData.maxTime', info.maxTime);
						if (info.currentWord != "") {
							that.set('modelData.timer', setInterval(function () {

								that.set('modelData.realTime', Math.max(parseInt(that.get('modelData.realTime') - 1), 0));
								that.set('modelData.timeLeft', parseInt(that.get('modelData.realTime') / info.maxTime * 100));
							}, 1000));
						}

						if (restartTimer) setTimeout(timer, 1000);

					case "Gameplay/Drawing":

						var image = data.parameters.base64;

						that.set('modelData.extImage', image);

						break;

					case "Gameplay/End":

						that.set("modelData.endGamePopupState", true);

						break;
				}
			});

			var that = this;
		},

		model: function model() {
			return this.get("modelData");
		},

		actions: {
			exit: function exit() {
				// TODO: Send message to the server for room exit
				this.transitionTo('lobby');
			},

			endGame: function endGame() {},

			drawChanged: function drawChanged(imageData) {
				var server = this.get('server');

				if (server.connected) {
					var data = {
						command: 'Gameplay/Drawing',
						parameters: {
							base64: imageData
						}
					};

					// - Send chat message to the server
					server.send(JSON.stringify(data));
				}
			},

			sendMessage: function sendMessage(content) {
				var server = this.get('server');

				if (server.connected) {
					var data = {
						command: 'Chat/Message',
						parameters: {
							content: content
						}
					};

					// - Send chat message to the server
					server.send(JSON.stringify(data));
				}
			}
		}

	});
});
define('Sketch-it/routes/index', ['exports', 'ember', 'ember-local-storage'], function (exports, _ember, _emberLocalStorage) {
	exports['default'] = _ember['default'].Route.extend({

		appSettings: (0, _emberLocalStorage.storageFor)('settings'),

		server: _ember['default'].inject.service('server'),

		Data: {
			username: '',
			password: ''
		},

		activate: function activate() {
			var that = this;

			var server = this.get('server');

			// - Unbind events
			server.off('connect');
			server.off('message');

			// - Bind connection data send for login
			server.on('connect', function () {
				var data = {
					command: 'Authentication/Login',
					parameters: {
						username: that.get('Data.username'),
						password: that.get('Data.password')
					}
				};

				server.send(JSON.stringify(data));
			});

			// - Handle response from the server
			server.on('message', function (data) {
				var response = JSON.parse(data);

				// - If response is a login response
				if (response.command === "Authentication/Login") {
					// - Check if ther's an error
					if (response.parameters.response === true) {
						// - Go to lobby if no errors
						that.transitionTo('lobby');
					} else {
						// - Else disconnect
						server.disconnect();

						// - And shot an error popup
						_ember['default'].$(".login .error").html(response.parameters.error);
						_ember['default'].$(".login .error").fadeIn(500);

						setTimeout(function () {
							_ember['default'].$(".login .error").fadeOut(500);
						}, 4000);
					}
				}
			});
		},

		model: function model() {
			return this.get('Data');
		},

		renderTemplate: function renderTemplate() {
			this._super(this, arguments);
			this.render();
		},

		actions: {
			register: function register() {
				// - Go to register layout
				this.transitionTo('register');
			},

			login: function login() {
				var server = this.get('server');

				var that = this;

				// Connect and send request
				if (server.connected) server.disconnect();else server.connect();
			}
		}
	});
});
define('Sketch-it/routes/lobby', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Route.extend({
		server: _ember['default'].inject.service('server'),

		modelData: {
			rooms: [],
			messages: [],

			userPopupState: false
		},

		activate: function activate() {
			var server = this.get('server');

			var that = this;

			// - Remove binded events
			server.off('connect');
			server.off('message');

			var data = {
				command: 'Lobby/Join'
			};

			server.send(JSON.stringify(data));

			// - Handle server messages
			server.on('message', function (content) {
				var data = JSON.parse(content);

				switch (data.command) {
					case "Chat/Message":

						var messages = that.get('modelData.messages');

						messages.pushObject({

							content: data.parameters.content,
							system: data.parameters.username === "",
							user: data.parameters.username

						});

						// - Add a message to the chat
						that.set('modelData.messages', messages);

						break;

					case "Lobby/GetRooms":

						var rooms = data.parameters.rooms;

						// - Update room list
						that.set('modelData.rooms', rooms);

						break;

					case "Lobby/JoinRoom":

						// - Check if there are errors
						if (data.parameters.response == true) {

							// - Handle room join confirm
							that.transitionTo('gameplay');
						}
				}
			});
		},

		model: function model() {
			return this.get("modelData");
		},

		actions: {

			openRoom: function openRoom(room) {
				var server = this.get('server');

				if (server.connected) {
					var sendData = {
						command: 'Lobby/JoinRoom',
						parameters: {
							room: room.name
						}
					};

					// - Send message to the server
					server.send(JSON.stringify(sendData));
				}
			},

			newRoom: function newRoom(data) {
				var server = this.get('server');

				if (server.connected) {
					var sendData = {
						command: 'Lobby/CreateRoom',
						parameters: data
					};

					// - Send message to the server
					server.send(JSON.stringify(sendData));
				}
			},

			sendMessage: function sendMessage(content) {
				var server = this.get('server');

				if (server.connected) {
					var data = {
						command: 'Chat/Message',
						parameters: {
							content: content
						}
					};

					// - Send message to the server
					server.send(JSON.stringify(data));
				}
			}

		}

	});
});
define('Sketch-it/routes/register', ['exports', 'ember', 'Sketch-it/config/environment'], function (exports, _ember, _SketchItConfigEnvironment) {
	exports['default'] = _ember['default'].Route.extend({

		server: _ember['default'].inject.service('server'),

		data: {
			supportedLanguages: _SketchItConfigEnvironment['default'].APP.allLanguages,
			username: '',
			password: '',
			passwordConfirm: '',
			email: '',
			disabled: true
		},

		// - Error popups
		usernameError: false,
		emailError: false,
		passwordError: false,
		confirmError: false,

		currentLanguage: _ember['default'].computed('data.supportedLanguages', function () {
			var Languages = this.get('data.supportedLanguages');

			return Languages.find(function (elem) {
				return elem.selected;
			});
		}),

		model: function model() {
			return this.get("data");
		},

		actions: {
			setLocalization: function setLocalization() {
				// - Set current language on italy (for now).
				for (var i = 0; i < this.get("data.supportedLanguages").length; i++) {
					this.set("data.supportedLanguages." + i + ".selected", false);
				}

				this.set("data.supportedLanguages.0.selected", true);
			},

			cancel: function cancel() {
				this.transitionTo('index');
			},

			confirm: function confirm() {
				var server = this.get('server');

				var that = this;

				// - Reset events
				server.off('connect');
				server.off('message');

				// - On connect send register request
				server.on('connect', function () {
					var data = {

						command: 'Authentication/Register',
						parameters: {
							Username: that.get('data.username'),
							Password: that.get('data.password'),
							Email: that.get('data.email'),
							Language: that.get('currentLanguage')
						}
					};

					server.send(JSON.stringify(data));
				});

				// - Handle response from server
				server.on('message', function (data) {
					var response = JSON.parse(data);

					// - If it's a register response
					if (response.command === "Authentication/Register") {
						// - Check if there are errors
						if (response.parameters.response == true) {
							// - If no errors shows confirm popup
							_ember['default'].$(".register").fadeOut(100).after(function () {
								_ember['default'].$(".registerCompleted").fadeIn(500);
							});

							// - And return to index
							setTimeout(function () {
								that.transitionTo('index');
							}, 3000);
						} else {
							// - And shot an error popup
							_ember['default'].$(".register .error").html(response.parameters.error);
							_ember['default'].$(".register .error").fadeIn(500);

							setTimeout(function () {
								_ember['default'].$(".register .error").fadeOut(500);
							}, 4000);
						}

						server.disconnect();
					}
				});

				// Start connect process
				server.connect();
			},

			checkValues: function checkValues() {
				// - Validate input values
				this.send('mailCheck', this.get('data.email'));
				this.send('passwordCheck', this.get('data.password'));
				this.send('passwordConfirmCheck', this.get('data.passwordConfirm'));

				// - Set buttons
				this.send('check');
			},

			mailCheck: function mailCheck(email) {
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				if (!re.test(email)) {
					_ember['default'].$("#mail").attr("data-balloon", "Invalid mail format");
					_ember['default'].$("#mail").attr("data-balloon-pos", "left");

					_ember['default'].$("#mail textbox input").css("cssText", "border-bottom: 1px dashed #900 !important;");

					this.set('emailError', true);
				} else {
					_ember['default'].$("#mail").attr("data-balloon", null);
					_ember['default'].$("#mail").attr("data-balloon-pos", null);

					_ember['default'].$("#mail textbox input").css("cssText", "border-bottom: inherith");

					this.set('emailError', false);
				}
			},

			passwordCheck: function passwordCheck(password) {
				var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

				var emailError = this.get('emailError');

				if (!re.test(password) && !emailError) {
					_ember['default'].$("#password").attr("data-balloon", "Password must contains the following rules:\n- At least one digit\n- At least one lower case\n- At least one upper case\n- At least 8 from the mentioned characters");
					_ember['default'].$("#password").attr("data-balloon-pos", "left");
					_ember['default'].$("#password").attr("data-balloon-break", '');

					_ember['default'].$("#password textbox input").css("cssText", "border-bottom: 1px dashed #900 !important;");

					this.set('passwordError', true);
				} else {
					_ember['default'].$("#password").attr("data-balloon", null);
					_ember['default'].$("#password").attr("data-balloon-pos", null);

					_ember['default'].$("#password textbox input").css("cssText", "border-bottom: inherith");

					this.set('passwordError', false);
				}
			},

			passwordConfirmCheck: function passwordConfirmCheck(password) {
				var emailError = this.get('emailError');
				var passwordError = this.get('passwordError');

				if (password !== this.get("data.password") && !emailError && !passwordError) {
					_ember['default'].$("#passwordConfirm").attr("data-balloon", "Re-type the correct password.");
					_ember['default'].$("#passwordConfirm").attr("data-balloon-pos", "left");

					_ember['default'].$("#passwordConfirm textbox input").css("cssText", "border-bottom: 1px dashed #900 !important;");

					this.set('confirmError', true);
				} else {
					_ember['default'].$("#passwordConfirm").attr("data-balloon", null);
					_ember['default'].$("#passwordConfirm").attr("data-balloon-pos", null);

					_ember['default'].$("#passwordConfirm textbox input").css("cssText", "border-bottom: inherith");

					this.set('confirmError', false);
				}
			},

			check: function check() {
				var username = this.get("data.username");
				var password = this.get("data.password");
				var email = this.get("data.email");
				var passwordConfirm = this.get("data.passwordConfirm");

				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				var rp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

				var pass = true;

				if (!re.test(email)) {
					pass = false;
				}

				if (username === '') {
					pass = false;
				}

				if (password !== passwordConfirm || !rp.test(password)) {
					pass = false;
				}

				this.set("data.disabled", !pass);
			}
		}

	});
});
define('Sketch-it/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('Sketch-it/services/server', ['exports', 'ember'], function (exports, _ember) {

	var net = require('net');

	exports['default'] = _ember['default'].Service.extend(_ember['default'].Evented, {

		socket: null,
		connected: false,
		buffer: "",

		init: function init() {
			this._super.apply(this, arguments);

			var that = this;

			var socket = new net.Socket();

			socket.setNoDelay(true);

			socket.on('error', function (exception) {
				console.log('Connection error:');
				console.log(exception);

				that.trigger('error');
				that.set('connected', false);
				that.trigger('disconnect');
			});

			socket.on('data', function (data) {
				var buffer = that.get('buffer');

				var endIndex = 0;
				var starterIndex = 0;

				var lastChar = null;
				var consecutive = 0;

				var terminator = String.fromCharCode(4);
				var starter = String.fromCharCode(3);

				data = buffer + data;

				for (var i = 0; i < data.length; i++) {
					if (lastChar == data.charAt(i)) consecutive++;else consecutive = 0;

					if (data.charAt(i) != starter) {
						if (consecutive == 0 && lastChar == starter) starterIndex = i;

						if (consecutive > 0 && lastChar == starter) data = data.substring(0, i - 2) + data.substring(i, data.length);
					}

					if (data.charAt(i) != terminator) {
						if (consecutive == 0 && lastChar == terminator) endIndex = i - 1;

						if (consecutive > 0 && lastChar == terminator) data = data.substring(0, i - 2) + data.substring(i, data.length);
					}

					if (endIndex > 0) {
						var sendData = data.substring(starterIndex, endIndex);

						// - message end
						console.log('Received: ' + sendData);
						that.trigger('message', sendData);

						data = data.substring(endIndex + 1, data.length);

						endIndex = 0;
						starterIndex = 0;
						i = 0;
					}

					lastChar = data.charAt(i);
				}

				if (data.charAt(data.length - 1) == terminator) {
					if (consecutive == 0) endIndex = i - 1;
				}

				if (endIndex > 0) {
					var sendData = data.substring(starterIndex, endIndex);

					// - message end
					console.log('Received: ' + sendData);
					that.trigger('message', sendData);

					data = data.substring(endIndex + 1, data.length);

					endIndex = 0;
					starterIndex = 0;
					i = 0;
				}

				that.set('buffer', buffer);
			});

			socket.on('close', function () {
				console.log('Connection closed.');

				that.set('connected', false);
				that.trigger('disconnect');
			});

			this.set('socket', socket);
		},

		connect: function connect() {
			var that = this;

			var socket = this.get('socket');

			socket.connect(56489, '127.0.0.1', function () {
				console.log('Client connected to the server.');

				that.set('connected', true);
				that.trigger('connect');
			});
		},

		disconnect: function disconnect() {
			var socket = this.get('socket');

			socket.destroy();

			this.set('connected', false);
			this.trigger('disconnect');
		},

		send: function send(data) {
			var socket = this.get('socket');

			console.log("Sending: " + data);

			var terminator = String.fromCharCode(4);
			var starter = String.fromCharCode(3);

			var seq = false;
			var sseq = false;

			for (var i = 0; i < data.length; i++) {
				if (data.charAt(i) == terminator) {
					if (!seq) {
						data = data.substring(0, i - 1) + terminator + data.substring(i, data.length - 1);
					}
					seq = true;
				} else seq = false;

				if (data.charAt(i) == starter) {
					if (!sseq) {
						data = data.substring(0, i - 1) + starter + data.substring(i, data.length - 1);
					}
					sseq = true;
				} else sseq = false;
			}

			data += terminator;
			data = starter + data;

			socket.write(data);
		}
	});
});
define("Sketch-it/templates/components/animations/fade-slide", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "pkiTm/1h", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"fadeBody\"],[\"static-attr\",\"style\",\"heigth: 100%\"],[\"flush-element\"],[\"text\",\"\\n\\t\"],[\"yield\",\"default\"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/animations/fade-slide.hbs" } });
});
define("Sketch-it/templates/components/charts/radial-chart", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Kf3VPgSm", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"radial-progress\"],[\"dynamic-attr\",\"data-progress\",[\"concat\",[[\"unknown\",[\"proggress\"]]]]],[\"flush-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"circle\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"mask full\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"fill\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"mask half\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"fill\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"fill fix\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"inset\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"percentage\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"numbers\"],[\"flush-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"-\"],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"value\"]],false],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/charts/radial-chart.hbs" } });
});
define("Sketch-it/templates/components/chat-controller", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "PsaMm7Dp", "block": "{\"statements\":[[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"chatContent\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"messages\"]]],null,2],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"inputs/default-textbox\"],null,[[\"placeholder\",\"currValue\",\"onEnter\"],[\"Type here...\",[\"get\",[\"message\"]],\"sendMessage\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"score\"],[\"flush-element\"],[\"text\",\"+\"],[\"append\",[\"unknown\",[\"message\",\"score\"]],false],[\"text\",\"pt\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"user\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"message\",\"user\"]],false],[\"text\",\": \"],[\"close-element\"],[\"text\",\" \\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"message\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"message\",\"system\"]],\"system\",\"\"],null],[\"helper\",[\"if\"],[[\"get\",[\"message\",\"score\"]],\"score\",\"\"],null]]]],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"unless\"],[[\"get\",[\"message\",\"system\"]]],null,1],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"content\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"message\",\"content\"]],false],[\"close-element\"],[\"text\",\" \\n\\t\\t\\t\\t\\n\"],[\"block\",[\"if\"],[[\"get\",[\"message\",\"score\"]]],null,0],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[\"message\"]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/chat-controller.hbs" } });
});
define("Sketch-it/templates/components/draw-area", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "M1fgP6Fs", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"drawArea\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tools\"],[\"dynamic-attr\",\"style\",[\"helper\",[\"unless\"],[[\"get\",[\"enabled\"]],\"display: none;\"],null],null],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"setTool\",\"brush\"],null],null],[\"static-attr\",\"data-balloon\",\"Brush tool\"],[\"static-attr\",\"data-balloon-pos\",\"right\"],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"brushEnabled\"]],\"selected\",\"\"],null]]]],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-paint-brush\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"setTool\",\"pen\"],null],null],[\"static-attr\",\"data-balloon\",\"Pencil tool\"],[\"static-attr\",\"data-balloon-pos\",\"right\"],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"penEnabled\"]],\"selected\",\"\"],null]]]],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-pencil\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"setTool\",\"eraser\"],null],null],[\"static-attr\",\"data-balloon\",\"Eraser tool\"],[\"static-attr\",\"data-balloon-pos\",\"right\"],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"eraserEnabled\"]],\"selected\",\"\"],null]]]],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-eraser\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"setTool\",\"rectangle\"],null],null],[\"static-attr\",\"data-balloon\",\"Rectangle tool\"],[\"static-attr\",\"data-balloon-pos\",\"right\"],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"rectangleEnabled\"]],\"selected\",\"\"],null]]]],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-square-o\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"setTool\",\"circle\"],null],null],[\"static-attr\",\"data-balloon\",\"Circle tool\"],[\"static-attr\",\"data-balloon-pos\",\"right\"],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"circleEnabled\"]],\"selected\",\"\"],null]]]],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-circle-o\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"setTool\",\"fill\"],null],null],[\"static-attr\",\"data-balloon\",\"Fill tool\"],[\"static-attr\",\"data-balloon-pos\",\"right\"],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"fillEnabled\"]],\"selected\",\"\"],null]]]],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-tint\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"setTool\",\"clear\"],null],null],[\"static-attr\",\"data-balloon\",\"Clear draw\"],[\"static-attr\",\"data-balloon-pos\",\"right\"],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-file-o\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-color\"],null,[[\"currValue\"],[[\"get\",[\"brushColor\"]]]]],false],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-slider\"],null,[[\"label\",\"currentValue\",\"min\",\"max\"],[\"brush size\",[\"get\",[\"brushSize\"]],10,100]]],false],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"text\",\"\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"drawableArea\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"table\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"tr\",[]],[\"static-attr\",\"class\",\"emp\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"min\"],[\"static-attr\",\"style\",\"border-right: 1px solid #777; border-bottom: 1px solid #777;\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"min\"],[\"static-attr\",\"style\",\"border-left: 1px solid #777; border-bottom: 1px solid #777;\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"content\"],[\"flush-element\"],[\"open-element\",\"canvas\",[]],[\"static-attr\",\"id\",\"paper\"],[\"static-attr\",\"width\",\"424\"],[\"static-attr\",\"height\",\"530\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"tr\",[]],[\"static-attr\",\"class\",\"emp\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"min\"],[\"static-attr\",\"style\",\"border-right: 1px solid #777; border-top: 1px solid #777;\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"min\"],[\"static-attr\",\"style\",\"border-left: 1px solid #777; border-top: 1px solid #777;\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/draw-area.hbs" } });
});
define("Sketch-it/templates/components/friend-block", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "3s3yKzov", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"friend-block\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"name\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"data\",\"name\"]],false],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"status\"],[\"dynamic-attr\",\"style\",[\"concat\",[\"color: \",[\"helper\",[\"if\"],[[\"get\",[\"data\",\"online\"]],\"green\",\"red\"],null]]]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"append\",[\"helper\",[\"if\"],[[\"get\",[\"data\",\"online\"]],\"online\",\"offline\"],null],false],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"buttons\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"append\",[\"helper\",[\"inputs/fa-button\"],null,[[\"icon\"],[\"fa-trash\"]]],false],[\"text\",\"\\n\\t\\t\"],[\"append\",[\"helper\",[\"inputs/fa-button\"],null,[[\"icon\"],[\"fa-envelope\"]]],false],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/friend-block.hbs" } });
});
define("Sketch-it/templates/components/game-result", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "bnQIOz6C", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"overlay\"],[\"flush-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"popup\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"align\",\"center\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"winner\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"assets/images/star.png\"],[\"static-attr\",\"class\",\"left\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\n\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\tThe winner is\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"username\"],[\"flush-element\"],[\"text\",\"Username\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"assets/images/star.png\"],[\"static-attr\",\"class\",\"right\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"stats\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"users\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"table\",[]],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"users\"]]],null,3],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"drawings\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"list\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"drawings\"]]],null,2],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"viewer\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\\t\"],[\"open-element\",\"img\",[]],[\"dynamic-attr\",\"src\",[\"concat\",[[\"unknown\",[\"selected\",\"file\"]]]]],[\"static-attr\",\"height\",\"300\"],[\"static-attr\",\"width\",\"300\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"details\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"content\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"word\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"selected\",\"word\"]],false],[\"text\",\" \"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"author\"],[\"flush-element\"],[\"text\",\"by \"],[\"append\",[\"unknown\",[\"selected\",\"author\"]],false],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"round\"],[\"flush-element\"],[\"text\",\"Drawn on round \"],[\"append\",[\"unknown\",[\"selected\",\"round\"]],false],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"scores\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"score\"],[\"flush-element\"],[\"text\",\"Scoreboard\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"scoreboard\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"table\",[]],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"selected\",\"scoreboard\"]]],null,1],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"buttons\"],[\"static-attr\",\"align\",\"center\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-button\"],null,[[\"text\",\"action\"],[\"Exit\",\"exit\"]]],false],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-button\"],null,[[\"text\",\"action\"],[\"New game\",\"newGame\"]]],false],[\"text\",\"\\n\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"score\",\"time\"]],false],[\"text\",\"s\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"score\",\"name\"]],true],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"if\"],[[\"get\",[\"score\",\"found\"]],\"Found\",\"Missed\"],null],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"block\",[\"if\"],[[\"get\",[\"score\",\"found\"]]],null,0],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"score\"]},{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"img\",[]],[\"dynamic-attr\",\"src\",[\"concat\",[[\"unknown\",[\"drawing\",\"file\"]]]]],[\"dynamic-attr\",\"onClick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"selectImage\",[\"get\",[\"drawing\"]]],null],null],[\"static-attr\",\"height\",\"80\"],[\"static-attr\",\"width\",\"80\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"drawing\"]},{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"name\"]],true],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"score\"]],false],[\"text\",\"pt\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"user\"]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/game-result.hbs" } });
});
define("Sketch-it/templates/components/inputs/default-button", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "YWwBGbHI", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"disabled\"]]],null,1,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"click\"]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"text\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"disabled\",\"\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"click\"]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"text\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/inputs/default-button.hbs" } });
});
define("Sketch-it/templates/components/inputs/default-checkbox", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Z5UoaIjs", "block": "{\"statements\":[[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"checked\",\"disabled\"],[\"checkbox\",[\"get\",[\"value\"]],[\"get\",[\"disabled\"]]]]],false],[\"text\",\"\\n\"],[\"open-element\",\"label\",[]],[\"dynamic-attr\",\"for\",[\"concat\",[[\"unknown\",[\"name\"]]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"label\"]],false],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/inputs/default-checkbox.hbs" } });
});
define("Sketch-it/templates/components/inputs/default-color", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "oNzIJcps", "block": "{\"statements\":[[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\"],[\"color\",[\"get\",[\"currValue\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/inputs/default-color.hbs" } });
});
define("Sketch-it/templates/components/inputs/default-confirm-button", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "5Zgd6h/k", "block": "{\"statements\":[[\"block\",[\"click-outside\"],null,[[\"action\"],[[\"helper\",[\"action\"],[[\"get\",[null]],\"outClick\"],null]]],2]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"button\",[]],[\"static-attr\",\"action\",\"click\"],[\"dynamic-attr\",\"style\",[\"concat\",[\"background-color: \",[\"unknown\",[\"color\"]]]]],[\"flush-element\"],[\"text\",\"\\n\\n\\t\"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"i\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"fa \",[\"unknown\",[\"icon\"]]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"label\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"button\",[]],[\"static-attr\",\"action\",\"click\"],[\"static-attr\",\"disabled\",\"\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"i\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"fa \",[\"unknown\",[\"icon\"]]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"label\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"disabled\"]]],null,1,0],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/inputs/default-confirm-button.hbs" } });
});
define("Sketch-it/templates/components/inputs/default-numberbox", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "fl8SQc0w", "block": "{\"statements\":[[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"max\",\"min\",\"value\"],[\"number\",\"{{max}}\",\"{{min}}\",[\"get\",[\"value\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/inputs/default-numberbox.hbs" } });
});
define("Sketch-it/templates/components/inputs/default-radiobutton", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "NtHX5NpX", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"disabled\"]]],null,1,0],[\"text\",\"\\n\"],[\"open-element\",\"label\",[]],[\"dynamic-attr\",\"for\",[\"unknown\",[\"getId\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"label\"]],false],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"radio\"],[\"dynamic-attr\",\"id\",[\"unknown\",[\"getId\"]],null],[\"dynamic-attr\",\"checked\",[\"concat\",[[\"unknown\",[\"checked\"]]]]],[\"dynamic-attr\",\"name\",[\"concat\",[[\"unknown\",[\"name\"]]]]],[\"dynamic-attr\",\"value\",[\"concat\",[[\"unknown\",[\"value\"]]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"radio\"],[\"dynamic-attr\",\"id\",[\"unknown\",[\"getId\"]],null],[\"dynamic-attr\",\"checked\",[\"concat\",[[\"unknown\",[\"checked\"]]]]],[\"dynamic-attr\",\"name\",[\"concat\",[[\"unknown\",[\"name\"]]]]],[\"dynamic-attr\",\"value\",[\"concat\",[[\"unknown\",[\"value\"]]]]],[\"static-attr\",\"disabled\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/inputs/default-radiobutton.hbs" } });
});
define("Sketch-it/templates/components/inputs/default-select", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "cthswp8p", "block": "{\"statements\":[[\"block\",[\"click-outside\"],null,[[\"action\"],[[\"helper\",[\"action\"],[[\"get\",[null]],\"outClick\"],null]]],2]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/select-item\"],null,[[\"content\",\"action\"],[[\"get\",[\"item\"]],\"selected\"]]],false],[\"text\",\"\\n\"]],\"locals\":[\"item\"]},{\"statements\":[[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"searchbox\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"placeholder\",\"value\"],[\"text\",\"Search...\",[\"get\",[\"searchValue\"]]]]],false],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleMenu\"]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"append\",[\"unknown\",[\"currentSelected\",\"html\"]],true],[\"text\",\"\\t\\n\\t\\t\"],[\"append\",[\"unknown\",[\"currentSelected\",\"name\"]],true],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"optionsMenu\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"search\"]]],null,1],[\"text\",\"\\t\\t\"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"items\"]]],null,0],[\"text\",\"\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/inputs/default-select.hbs" } });
});
define("Sketch-it/templates/components/inputs/default-slider", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "shXJf6Jh", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"disabled\"]]],null,2,1],[\"text\",\"\\t\\n\"],[\"block\",[\"if\"],[[\"get\",[\"haveText\"]]],null,0],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\t\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"label\"]],false],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"currentValue\"]],false],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"name\",\"value\",\"min\",\"max\",\"disabled\"],[\"range\",[\"get\",[\"name\"]],[\"get\",[\"currentValue\"]],[\"get\",[\"min\"]],[\"get\",[\"max\"]],false]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"name\",\"value\",\"min\",\"max\",\"disabled\"],[\"range\",[\"get\",[\"name\"]],[\"get\",[\"currentValue\"]],[\"get\",[\"min\"]],[\"get\",[\"max\"]],true]]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/inputs/default-slider.hbs" } });
});
define("Sketch-it/templates/components/inputs/default-textbox", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "FcKyztdw", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"password\"]]],null,5,2]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"placeholder\",\"value\",\"key-up\",\"enter\"],[\"text\",[\"get\",[\"placeholder\"]],[\"get\",[\"currValue\"]],\"change\",\"enter\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"placeholder\",\"value\",\"key-up\",\"disabled\",\"enter\"],[\"text\",[\"get\",[\"placeholder\"]],[\"get\",[\"currValue\"]],\"change\",true,\"enter\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"disabled\"]]],null,1,0]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"placeholder\",\"value\",\"key-up\",\"enter\"],[\"password\",[\"get\",[\"placeholder\"]],[\"get\",[\"currValue\"]],\"change\",\"enter\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"placeholder\",\"value\",\"key-up\",\"enter\",\"disabled\"],[\"password\",[\"get\",[\"placeholder\"]],[\"get\",[\"currValue\"]],\"change\",\"enter\",true]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"disabled\"]]],null,4,3]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/inputs/default-textbox.hbs" } });
});
define("Sketch-it/templates/components/inputs/fa-button", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Sk8xGt+C", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"disabled\"]]],null,1,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[[\"unknown\",[\"class\"]]]]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"click\"]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"i\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"fa \",[\"unknown\",[\"icon\"]]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\" \\n\\t\\t\"],[\"append\",[\"unknown\",[\"label\"]],false],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[[\"unknown\",[\"class\"]]]]],[\"static-attr\",\"disabled\",\"\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"click\"]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"i\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"fa \",[\"unknown\",[\"icon\"]]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\" \\n\\t\\t\"],[\"append\",[\"unknown\",[\"label\"]],false],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/inputs/fa-button.hbs" } });
});
define("Sketch-it/templates/components/inputs/select-item", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Yg0Mepn9", "block": "{\"statements\":[[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"title\"],[\"trusting-attr\",\"style\",[\"helper\",[\"if\"],[[\"get\",[\"content\",\"selected\"]],\"font-weight: 600;\",\"\"],null]],[\"flush-element\"],[\"text\",\"\\n\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"style\",\"float: left; margin-right: 5px; vertical-align: middle;\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"content\",\"html\"]],true],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"append\",[\"unknown\",[\"content\",\"name\"]],true],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"hasDescription\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"description\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"content\",\"description\"]],true],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/inputs/select-item.hbs" } });
});
define("Sketch-it/templates/components/notifications-menu", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "E3JtqqDy", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"notification-box\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"notifications\"]]],null,0],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"notification-live\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"close\"],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-close\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"title\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"notification\",\"name\"]],false],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"description\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"notification\",\"description\"]],false],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"time\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"notification\",\"time\"]],false],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"buttons\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\tClick to join\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"notification\"]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/notifications-menu.hbs" } });
});
define("Sketch-it/templates/components/room-list-entry", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "1HWxojGf", "block": "{\"statements\":[[\"open-element\",\"table\",[]],[\"flush-element\"],[\"text\",\"\\n\\n\\t\"],[\"open-element\",\"tr\",[]],[\"static-attr\",\"id\",\"row\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"name\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"flag-icon flag-icon-\",[\"unknown\",[\"data\",\"language\"]]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"unknown\",[\"data\",\"name\"]],true],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"id\",\"expand\"],[\"flush-element\"],[\"text\",\"(Click for more dettails)\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"users\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-user-circle\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"unknown\",[\"data\",\"users\",\"length\"]],true],[\"text\",\"/\"],[\"append\",[\"unknown\",[\"data\",\"maxPlayers\"]],true],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"round\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-bookmark-o\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"unknown\",[\"data\",\"currentRound\"]],true],[\"text\",\"/\"],[\"append\",[\"unknown\",[\"data\",\"maxRounds\"]],true],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"join\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/fa-button\"],null,[[\"icon\",\"action\"],[\"fa-sign-in\",\"join\"]]],false],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\t\"],[\"open-element\",\"tr\",[]],[\"static-attr\",\"class\",\"expanded\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"description\"],[\"flush-element\"],[\"text\",\"Description:\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"append\",[\"unknown\",[\"data\",\"description\"]],true],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"data\",\"owner\"]]],null,2,1],[\"text\",\"\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"userlist\"],[\"static-attr\",\"colspan\",\"3\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\tUsers:\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"open-element\",\"table\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"data\",\"users\"]]],null,0],[\"text\",\"\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"name\"]],true],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"score\"]],false],[\"text\",\"pt\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-pencil\"],[\"dynamic-attr\",\"style\",[\"concat\",[\"color:\",[\"helper\",[\"if\"],[[\"get\",[\"user\",\"drawing\"]],\"#444\",\"#DDD\"],null],\";\"]]],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"user\"]},{\"statements\":[[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"info\"],[\"flush-element\"],[\"text\",\"created by default.\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"info\"],[\"flush-element\"],[\"text\",\"created by \"],[\"append\",[\"unknown\",[\"data\",\"owner\",\"name\"]],false],[\"text\",\" at \"],[\"append\",[\"unknown\",[\"timestamp\"]],true],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/room-list-entry.hbs" } });
});
define("Sketch-it/templates/components/room-list-new", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "o8VPsnf2", "block": "{\"statements\":[[\"open-element\",\"table\",[]],[\"flush-element\"],[\"text\",\"\\n\\n\\n\\t\"],[\"open-element\",\"tr\",[]],[\"static-attr\",\"id\",\"row\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"name\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"open\"]]],null,1,0],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"New room\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"style\",\"text-align: right;\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"confirmButton\"],[\"static-attr\",\"style\",\"display: none;\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-confirm-button\"],null,[[\"icon\",\"label\",\"disabled\",\"action\"],[\"fa-check-circle-o\",\"Confirm\",[\"get\",[\"cantConfirm\"]],\"create\"]]],false],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\t\"],[\"open-element\",\"tr\",[]],[\"static-attr\",\"class\",\"expanded\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"roomName\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-textbox\"],null,[[\"placeholder\",\"currValue\"],[\"Room name\",[\"get\",[\"roomName\"]]]]],false],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"roomPassword\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-textbox\"],null,[[\"placeholder\",\"currValue\"],[\"Password\",[\"get\",[\"roomPassword\"]]]]],false],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"roomDescription\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"placeholder\",\"value\"],[\"Room description...\",[\"get\",[\"roomDescription\"]]]]],false],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"open-element\",\"th\",[]],[\"static-attr\",\"class\",\"options\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\n\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"title\"],[\"flush-element\"],[\"text\",\"Options\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-checkbox\"],null,[[\"value\"],[[\"get\",[\"endlessMode\"]]]]],false],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"label\"],[\"flush-element\"],[\"text\",\"Endless mode\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-checkbox\"],null,[[\"value\"],[[\"get\",[\"enableAway\"]]]]],false],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"label\"],[\"flush-element\"],[\"text\",\"Enable away\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-checkbox\"],null,[[\"value\"],[[\"get\",[\"enableHints\"]]]]],false],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"label\"],[\"flush-element\"],[\"text\",\"Enable hints\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-numberbox\"],null,[[\"value\",\"max\",\"min\"],[[\"get\",[\"maxPlayers\"]],100,0]]],false],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"label\"],[\"flush-element\"],[\"text\",\"Max players\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-numberbox\"],null,[[\"value\",\"max\",\"min\"],[[\"get\",[\"maxRounds\"]],100,0]]],false],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"label\"],[\"flush-element\"],[\"text\",\"Max rounds\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-select\"],null,[[\"data\",\"controllerName\"],[[\"get\",[\"supportedLanguages\"]],\"language\"]]],false],[\"text\",\"\\n\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-plus-circle\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-minus-circle\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/room-list-new.hbs" } });
});
define("Sketch-it/templates/components/top-bar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "g8xwuLu1", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n\\n\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"left\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"userLogged\"]]],null,5],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"userLogged\"]]],null,4],[\"text\",\"\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"center\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"showTitle\"]]],null,3],[\"text\",\"\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"right\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"userLogged\"]]],null,2],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"canMinimize\"]]],null,1],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"canClose\"]]],null,0],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/fa-button\"],null,[[\"icon\",\"class\",\"action\"],[\"fa-close\",\"close\",\"appClose\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/fa-button\"],null,[[\"icon\",\"class\",\"action\"],[\"fa-window-restore\",\"restore\",\"appMinimize\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/fa-button\"],null,[[\"icon\",\"class\",\"action\",\"disabled\"],[\"fa-sign-out\",\"logout\",\"logOut\",[\"get\",[\"cantLogout\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"logo\"],[\"flush-element\"],[\"text\",\"Sketch\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"it\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/fa-button\"],null,[[\"icon\",\"action\"],[\"fa-user\",\"openUserPopup\"]]],false],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"user\"],[\"flush-element\"],[\"text\",\"Username\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/fa-button\"],null,[[\"icon\",\"class\",\"action\",\"disabled\"],[\"fa-bell\",\"notifications\",\"userNotifications\",false]]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/top-bar.hbs" } });
});
define("Sketch-it/templates/components/user-profile", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "RJK/cp2m", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"overlay\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"click-outside\"],null,[[\"action\"],[\"outClick\"]],1],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"friend-block\"],null,[[\"data\"],[[\"get\",[\"friend\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"friend\"]},{\"statements\":[[\"text\",\"\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"popup\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"profile\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"avatar\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-user-circle\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"description\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"username\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"flag-icon flag-icon-\",[\"unknown\",[\"user\",\"language\"]]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\" \\n\\t\\t\\t\\t\\t\\t\"],[\"append\",[\"unknown\",[\"user\",\"name\"]],true],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"desc\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"description\"]],true],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"stats\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"favSketch\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"assets/images/bussola.png\"],[\"static-attr\",\"height\",\"150\"],[\"static-attr\",\"width\",\"150\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"numbers\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\tWins: \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"value\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"wins\"]],false],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\tWords found: \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"value\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"wordsFound\"]],false],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\tTotal games: \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"value\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"totalGames\"]],false],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\tPlay time: \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"value\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"playTime\"]],false],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\tMember since: \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"value\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"memberSince\"]],false],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"gallery\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\\tGallery\\n\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"images\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"assets/images/bussola.png\"],[\"static-attr\",\"height\",\"110\"],[\"static-attr\",\"width\",\"110\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"assets/images/penna.png\"],[\"static-attr\",\"height\",\"110\"],[\"static-attr\",\"width\",\"110\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"assets/images/portatile.png\"],[\"static-attr\",\"height\",\"110\"],[\"static-attr\",\"width\",\"110\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"assets/images/circonferenza.png\"],[\"static-attr\",\"height\",\"110\"],[\"static-attr\",\"width\",\"110\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"assets/images/cartella.png\"],[\"static-attr\",\"height\",\"110\"],[\"static-attr\",\"width\",\"110\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"friends\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"user\",\"friends\"]]],null,0],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/components/user-profile.hbs" } });
});
define("Sketch-it/templates/gameplay", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ORvaGcMV", "block": "{\"statements\":[[\"append\",[\"helper\",[\"top-bar\"],null,[[\"topbarBorder\",\"userLogged\",\"userPopup\"],[true,true,[\"get\",[\"model\",\"userPopupState\"]]]]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"gameplay\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"left\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"top\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"users\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"open-element\",\"table\",[]],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"users\"]]],null,5],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"round\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"timer\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"charts/radial-chart\"],null,[[\"proggress\",\"value\"],[[\"get\",[\"model\",\"timeLeft\"]],[\"get\",[\"model\",\"realTime\"]]]]],false],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"roundNumber\"],[\"flush-element\"],[\"text\",\"Round \"],[\"append\",[\"unknown\",[\"model\",\"currentRound\"]],false],[\"text\",\"/\"],[\"append\",[\"unknown\",[\"model\",\"maxRound\"]],false],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"drawing\"]]],null,4,3],[\"text\",\"\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"currentWord\"]]],null,1],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"bottom\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"chat\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"chat-controller\"],null,[[\"messages\",\"action\"],[[\"get\",[\"model\",\"messages\"]],\"sendMessage\"]]],false],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"right\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-confirm-button\"],null,[[\"label\",\"icon\",\"color\"],[\"Away\",\"fa-clock-o\",\"#383433\"]]],false],[\"text\",\"\\n\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-confirm-button\"],null,[[\"label\",\"icon\",\"color\"],[\"Hint\",\"fa-lightbulb-o\",\"#E5B74B\"]]],false],[\"text\",\"\\n\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-confirm-button\"],null,[[\"label\",\"icon\",\"action\",\"color\"],[\"Skip\",\"fa-fast-forward\",\"endGame\",\"#554D9E\"]]],false],[\"text\",\"\\n\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-confirm-button\"],null,[[\"label\",\"icon\",\"action\",\"color\"],[\"Exit\",\"fa-sign-out\",\"exit\",\"#E24A4A\"]]],false],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"append\",[\"helper\",[\"draw-area\"],null,[[\"enabled\",\"changed\",\"externalImage\"],[[\"get\",[\"model\",\"drawing\"]],\"drawChanged\",[\"get\",[\"model\",\"extImage\"]]]]],false],[\"text\",\"\\n\\t\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"user-profile\"],null,[[\"visible\"],[[\"get\",[\"model\",\"userPopupState\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"game-result\"],null,[[\"visible\"],[[\"get\",[\"model\",\"endGamePopupState\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"class\",[]],[\"static-attr\",\"style\",\"font-weight: normal;\"],[\"dynamic-attr\",\"data-balloon\",[\"concat\",[[\"unknown\",[\"model\",\"definition\"]]]]],[\"static-attr\",\"data-balloon-pos\",\"down\"],[\"static-attr\",\"data-balloon-break\",\"\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-info-circle\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"word\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\tThe current word is\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"drawing\"]]],null,0],[\"text\",\"\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"word\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"model\",\"currentWord\"]],false],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"role\"],[\"flush-element\"],[\"text\",\"Waiting...\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"unless\"],[[\"get\",[\"model\",\"currentWord\"]]],null,2]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"role\"],[\"flush-element\"],[\"text\",\"Now you are drawing\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"dynamic-attr\",\"style\",[\"helper\",[\"if\"],[[\"get\",[\"user\",\"current\"]],\"font-weight: bolder;\",\"\"],null],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"name\"]],true],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"score\"]],false],[\"text\",\"pt\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-pencil\"],[\"dynamic-attr\",\"style\",[\"concat\",[\"color:\",[\"helper\",[\"if\"],[[\"get\",[\"user\",\"drawing\"]],\"#444\",\"#DDD\"],null],\";\"]]],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"user\"]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/gameplay.hbs" } });
});
define("Sketch-it/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "vk5iHKtq", "block": "{\"statements\":[[\"append\",[\"helper\",[\"top-bar\"],null,[[\"showTitle\"],[false]]],false],[\"text\",\"\\n\\n\"],[\"block\",[\"animations/fade-slide\"],null,null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\\n\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"login\"],[\"static-attr\",\"align\",\"center\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"logo\"],[\"flush-element\"],[\"text\",\"Sketch\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"it\"],[\"close-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"subtitle\"],[\"flush-element\"],[\"text\",\"Login\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"content\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"guest\"],[\"static-attr\",\"data-balloon\",\"Login as guest\\n(not avaiable)\"],[\"static-attr\",\"data-balloon-pos\",\"up\"],[\"static-attr\",\"data-balloon-break\",\"\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/fa-button\"],null,[[\"icon\"],[\"fa-user-circle\"]]],false],[\"text\",\"\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-textbox\"],null,[[\"placeholder\",\"currValue\",\"onEnter\"],[\"Username\",[\"get\",[\"model\",\"username\"]],\"login\"]]],false],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-textbox\"],null,[[\"placeholder\",\"password\",\"currValue\",\"onEnter\"],[\"Password\",true,[\"get\",[\"model\",\"password\"]],\"login\"]]],false],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-button\"],null,[[\"text\",\"action\"],[\"Register\",\"register\"]]],false],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-button\"],null,[[\"text\",\"action\"],[\"Login\",\"login\"]]],false],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"error\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/index.hbs" } });
});
define("Sketch-it/templates/lobby", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "wggChwi/", "block": "{\"statements\":[[\"append\",[\"helper\",[\"top-bar\"],null,[[\"topbarBorder\",\"userLogged\",\"userPopup\"],[true,true,[\"get\",[\"model\",\"userPopupState\"]]]]],false],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"animations/fade-slide\"],null,null,1],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"user-profile\"],null,[[\"visible\"],[[\"get\",[\"model\",\"userPopupState\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"room-list-entry\"],null,[[\"data\",\"action\"],[[\"get\",[\"item\"]],\"openRoom\"]]],false],[\"text\",\"\\n\\n\"]],\"locals\":[\"item\"]},{\"statements\":[[\"text\",\"\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"lobby\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"roomList\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\"],[\"append\",[\"helper\",[\"room-list-new\"],null,[[\"action\"],[\"newRoom\"]]],false],[\"text\",\"\\n\\t\\t\\t\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"rooms\"]]],null,0],[\"text\",\"\\t\\t\\t\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"chat\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"append\",[\"helper\",[\"chat-controller\"],null,[[\"messages\",\"action\"],[[\"get\",[\"model\",\"messages\"]],\"sendMessage\"]]],false],[\"text\",\"\\n\\t\\t\\t\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/lobby.hbs" } });
});
define("Sketch-it/templates/register", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "gS+XidoC", "block": "{\"statements\":[[\"append\",[\"helper\",[\"top-bar\"],null,[[\"showTitle\"],[false]]],false],[\"text\",\"\\n\\n\"],[\"block\",[\"animations/fade-slide\"],null,null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"register\"],[\"static-attr\",\"align\",\"center\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"logo\"],[\"flush-element\"],[\"text\",\"Sketch\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"it\"],[\"close-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"subtitle\"],[\"flush-element\"],[\"text\",\"Register\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"content\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"position\"],[\"static-attr\",\"data-balloon\",\"Automatic localization\"],[\"static-attr\",\"data-balloon-pos\",\"up\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/fa-button\"],null,[[\"icon\",\"action\"],[\"fa-street-view\",\"setLocalization\"]]],false],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-select\"],null,[[\"data\",\"controllerName\"],[[\"get\",[\"model\",\"supportedLanguages\"]],\"language\"]]],false],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-textbox\"],null,[[\"currValue\",\"onChange\",\"placeholder\"],[[\"get\",[\"model\",\"username\"]],\"checkValues\",\"Username\"]]],false],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"id\",\"mail\"],[\"static-attr\",\"data-balloon-visible\",\"\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-textbox\"],null,[[\"currValue\",\"placeholder\",\"onChange\"],[[\"get\",[\"model\",\"email\"]],\"E-mail\",\"checkValues\"]]],false],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"id\",\"password\"],[\"static-attr\",\"data-balloon-visible\",\"\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-textbox\"],null,[[\"currValue\",\"placeholder\",\"onChange\",\"password\"],[[\"get\",[\"model\",\"password\"]],\"Password\",\"checkValues\",true]]],false],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"id\",\"passwordConfirm\"],[\"static-attr\",\"data-balloon-visible\",\"\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-textbox\"],null,[[\"currValue\",\"placeholder\",\"onChange\",\"password\"],[[\"get\",[\"model\",\"passwordConfirm\"]],\"Retype password\",\"checkValues\",true]]],false],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\\t\\t\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-button\"],null,[[\"text\",\"action\"],[\"Cancel\",\"cancel\"]]],false],[\"text\",\"\\n\\t\\t\\t\\t\"],[\"append\",[\"helper\",[\"inputs/default-button\"],null,[[\"text\",\"disabled\",\"action\"],[\"Confirm\",[\"get\",[\"model\",\"disabled\"]],\"confirm\"]]],false],[\"text\",\"\\n\\n\\t\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"error\"],[\"flush-element\"],[\"text\",\"\\n\\t\\t\\tHey ciao!\\n\\t\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"\\t\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"registerCompleted\"],[\"flush-element\"],[\"text\",\"\\n\\n\\t\"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "Sketch-it/templates/register.hbs" } });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('Sketch-it/config/environment', ['ember'], function(Ember) {
  var prefix = 'Sketch-it';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("Sketch-it/app")["default"].create({"name":"Sketch-it","version":"0.0.0+"});
}

/* jshint ignore:end */
//# sourceMappingURL=Sketch-it.map
