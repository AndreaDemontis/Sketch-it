import Ember from 'ember';

export default Ember.Component.extend(
{
	brushEnabled: Ember.computed('currentTool', function () { return this.get('currentTool') == 'brush'; }),
	penEnabled: Ember.computed('currentTool', function () { return this.get('currentTool') == 'pen'; }),
	eraserEnabled: Ember.computed('currentTool', function () { return this.get('currentTool') == 'eraser'; }),
	rectangleEnabled: Ember.computed('currentTool', function () { return this.get('currentTool') == 'rectangle'; }),
	circleEnabled: Ember.computed('currentTool', function () { return this.get('currentTool') == 'circle'; }),
	fillEnabled: Ember.computed('currentTool', function () { return this.get('currentTool') == 'fill'; }),

	currentMousePos: { X: 0, Y: 0 },
	initialMousePos: { X: 0, Y: 0 },
	currentTool: 'brush',
	brushColor: '#000',
	brushSize: 10,
	disabled: false,

	states: [],
	pendingStates: [],

	// - Context
	canvas: null,
	context: null,

	didInsertElement: function () 
	{
		var that = this;

		var cv = document.getElementById('paper');
		var ctx = null;

		if(cv && cv.getContext) 
		{
			ctx = cv.getContext("2d");
		}

		this.set('canvas', cv);
		this.set('context', ctx);

		var firstClick = false;

		var saveState = function () 
		{
			var states = that.get('states');

			states = states.concat(that.get('pendingStates'));

			that.set('states', states);

			that.set('pendingStates', []);
		};

		var addState = function (tool, params) 
		{
			var pendingStates = that.get('pendingStates');

			pendingStates.push(
			{
				tool: tool,
				params: params,
				drawed: false
			});

			that.set('pendingStates', pendingStates);
		};

		var clearCurrentState = function ()
		{
			that.set('pendingStates', []);
		};

		var undo = function () 
		{
			var states = that.get('states');

			if (states.length <= 0)
			{
				return;
			}

			while (!states[states.length - 1].params.first)
			{
				states.pop();
			}

			states.pop();

			that.set('states', states);

			clearCurrentState();

			that.send('ResetDrawing');
			that.send('DrawState');
		};

		var mouseMove = function (mouse) 
		{
			var currentMousePos = { X: 0, Y: 0 };
			var initialMousePos = that.get('initialMousePos');
			var lastMousePos = that.get('currentMousePos');

			// - Get current position
			currentMousePos.X = mouse.offsetX ? mouse.offsetX : (mouse.pageX - mouse.target.offsetLeft);
			currentMousePos.Y = mouse.offsetY ? mouse.offsetY : (mouse.pageY - mouse.target.offsetTop);

			// - Set the new position
			that.set('currentMousePos', currentMousePos);

			// - Draw using current tool
			var currentTool = that.get('currentTool');

			if (currentTool === 'brush') 
			{
				addState(currentTool, 
				{
					start: lastMousePos,
					end: currentMousePos,
					brushSize: that.get('brushSize') / 5,
					color: that.get('brushColor'),
					first: firstClick
				});
			}

			if (currentTool === 'pen') 
			{
				addState('brush', 
				{
					start: lastMousePos,
					end: currentMousePos,
					brushSize: 1,
					color: that.get('brushColor'),
					first: firstClick
				});
			}

			if (currentTool === 'eraser') 
			{
				addState('brush', 
				{
					start: lastMousePos,
					end: currentMousePos,
					brushSize: that.get('brushSize') / 5,
					color: "#FFF",
					first: firstClick
				});
			}

			if (currentTool === 'rectangle') 
			{
				var width = currentMousePos.X - initialMousePos.X;
				var height = currentMousePos.Y - initialMousePos.Y;

				that.set('pendingStates', []);
				that.send('ResetDrawing');

				// - Draw a rectangle
				addState(currentTool, 
				{
					start: initialMousePos,
					size: { width: width, height: height },
					brushSize: that.get('brushSize') / 5,
					color: that.get('brushColor'),
					first: true
				});
			}

			if (currentTool === 'circle') 
			{
				that.set('pendingStates', []);
				that.send('ResetDrawing');

				// - Draw a rectangle
				addState(currentTool, 
				{
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

		var mouseDownActions = function (mouse) 
		{
			// - Draw using current tool
			var currentTool = that.get('currentTool');

			var initialMousePos = that.get('initialMousePos');

			if (currentTool === 'fill') 
			{
				that.set('pendingStates', []);
				that.send('ResetDrawing');

				// - Draw a rectangle
				addState(currentTool, 
				{
					start: initialMousePos,
					color: that.get('brushColor'),
					first: true
				});

				that.send('DrawState');
			}
		}

		var mouseUp = function (mouse) 
		{
			var context = that.get('context');
			var canvas = that.get('canvas');

			saveState();

			//if mouse is not being pressed then don't draw anything
			canvas.removeEventListener('mousemove', mouseMove, false);
			canvas.removeEventListener('mouseup', mouseUp, false);

			that.send('DrawState');
		};

		var mouseDown = function (mouse) 
		{
			if (that.get('disabled'))
			{
				// - Canvas disabled
				return;
			}

			// - If left button pressed
			if (mouse.which != 3 && mouse.which != 2)
			{
				var canvas = that.get('canvas');

				var currentMousePos = { X: 0, Y: 0 };

				// - Save start position
				currentMousePos.X = mouse.offsetX ? mouse.offsetX : (mouse.pageX - mouse.target.offsetLeft);
				currentMousePos.Y = mouse.offsetY ? mouse.offsetY : (mouse.pageY - mouse.target.offsetTop);

				that.set('initialMousePos', currentMousePos);
				that.set('currentMousePos', currentMousePos);

				firstClick = true;

				// - Add listener for mouse move and key up
				canvas.addEventListener('mousemove', mouseMove, false);
				canvas.addEventListener('mouseup', mouseUp, false);

				mouseDownActions(mouse);
			}

			if (mouse.which == 3)
			{
				clearCurrentState();

				that.send('DrawState');
			}
		};

		function KeyPress(e) 
		{
			var evtobj = window.event ? event : e;

			if (evtobj.keyCode == 90 && evtobj.ctrlKey)
			{
				undo();
			}
		}

		cv.onmousedown = mouseDown;
		document.onkeydown = KeyPress;

		// - Update cycle
		function refreshCycle() 
		{
			that.send('DrawState');
			setTimeout(refreshCycle, 1000);
		}

		this.send('ResetDrawing');
		
		refreshCycle();
		
	},


	actions:
	{

		setTool: function (tool) 
		{
			
			
			if (tool === 'clear')
			{
				this.set('states', []);
				this.set('pendingStates', []);
				this.send('ResetDrawing');
				this.send('DrawState');
			}
			else this.set('currentTool', tool);
		},

		ResetDrawing: function () 
		{
			var states = this.get('states');

			for (var i = states.length - 1; i >= 0; i--) 
			{
				states[i].drawed = false;
			}

			this.set('states', states);

			states = this.get('pendingStates');

			for (var i = states.length - 1; i >= 0; i--) 
			{
				states[i].drawed = false;
			}

			this.set('pendingStates', states);

			var context = this.get('context');
			var canvas = this.get('canvas');

			context.clearRect(0, 0, canvas.width, canvas.height);

			context.fillStyle = "#FFF";
			context.fillRect(0, 0, canvas.width, canvas.height);
		},


		DrawState: function () 
		{
			var context = this.get('context');
			var canvas = this.get('canvas');

			var states = this.get('states');
			var pendingStates = this.get('pendingStates');

			var colorTreshold = 0.9;

			states = states.concat(pendingStates);

			for (var i = 0; i < states.length; i++) 
			{
				var state = states[i];

				if (state.drawed)
					continue;

				state.drawed = true;

				if (state.tool === 'brush')
				{

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

				if (state.tool === 'rectangle')
				{

					context.lineWidth = state.params.brushSize;
					context.strokeStyle = state.params.color;
					context.lineCap = "round";
					context.lineJoin = "round";

					// - Draw the rectangle
					context.strokeRect(state.params.start.X, state.params.start.Y, state.params.size.width, state.params.size.height);
				}

				if (state.tool === 'circle')
				{

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

				if (state.tool === 'fill')
				{
					function hexToRgb(hex) 
					{
						var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

						hex = hex.replace(shorthandRegex, function(m, r, g, b) 
						{
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
					var fillColor = hexToRgb(state.params.color);

					// - Get pixel layers
					var colorLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
					var outlineLayerData = context.getImageData(0, 0, canvas.width, canvas.height);

					function matchOutlineColor (r, g, b, a) 
					{
						return (r + g + b < 100 && a === 255);
					};

					function matchStartColor (pixelPos, startR, startG, startB, startA) 
					{
						var r = outlineLayerData.data[pixelPos];
						var g = outlineLayerData.data[pixelPos + 1];
						var b = outlineLayerData.data[pixelPos + 2];
						var a = outlineLayerData.data[pixelPos + 3];

						// - If current pixel of the outline image is black
						if (matchOutlineColor(r, g, b, a)) 
						{
							return false;
						}

						r = colorLayerData.data[pixelPos];
						g = colorLayerData.data[pixelPos + 1];
						b = colorLayerData.data[pixelPos + 2];
						a = colorLayerData.data[pixelPos + 3];

						// - If current pixel matches the new color
						if (r === fillColor.r && g === fillColor.g && b === fillColor.b) 
						{
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

						if (a === startA)
						{
							return similar;
						}
					};

					function colorPixel (pixelPos, r, g, b, a, treshold) 
					{
						var or = colorLayerData.data[pixelPos];
						var og = colorLayerData.data[pixelPos + 1];
						var ob = colorLayerData.data[pixelPos + 2];
						var oa = colorLayerData.data[pixelPos + 3];

						colorLayerData.data[pixelPos] = (r * treshold) + (or * (1 - treshold));
						colorLayerData.data[pixelPos + 1] = (g * treshold) + (og * (1 - treshold));
						colorLayerData.data[pixelPos + 2] = (b * treshold) + (ob * (1 - treshold));
						colorLayerData.data[pixelPos + 3] = (a * treshold) + (oa * (1 - treshold));
					};

					function floodFill (startX, startY, startR, startG, startB, startA) 
					{
						var newPos, x, y;
						var pixelPos, reachLeft, reachRight;
						var drawingBoundLeft = 0;
						var drawingBoundTop = 0;
						var drawingBoundRight = 0 + canvas.width - 1;
						var drawingBoundBottom = 0 + canvas.height - 1;
						var pixelStack = [[startX, startY]];

						while (pixelStack.length) 
						{
							newPos = pixelStack.pop();
							x = newPos[0];
							y = newPos[1];

							// - Get current pixel position
							pixelPos = (y * canvas.width + x) * 4;

							// - Go up as long as the color matches and are inside the canvas
							while (y >= drawingBoundTop && matchStartColor(pixelPos, startR, startG, startB, startA) > colorTreshold) 
							{
								y -= 1;
								pixelPos -= canvas.width * 4;
							}

							pixelPos += canvas.width * 4;
							y += 1;
							reachLeft = false;
							reachRight = false;

							// - Go down as long as the color matches and in inside the canvas
							while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB, startA) > colorTreshold) 
							{
								y += 1;


								colorPixel(pixelPos, fillColor.r, fillColor.g, fillColor.b, 255, matchStartColor(pixelPos, startR, startG, startB, startA));

								if (x > drawingBoundLeft) 
								{
									if (matchStartColor(pixelPos - 4, startR, startG, startB, startA) > colorTreshold) 
									{
										if (!reachLeft) 
										{
											// - Add pixel to stack
											pixelStack.push([x - 1, y]);
											reachLeft = true;
										}
									} 
									else if (reachLeft) 
									{
										reachLeft = false;
									}
								}

								if (x < drawingBoundRight) 
								{
									if (matchStartColor(pixelPos + 4, startR, startG, startB, startA) > colorTreshold) 
									{
										if (!reachRight) 
										{
											// - Add pixel to stack
											pixelStack.push([x + 1, y]);
											reachRight = true;
										}
									} 
									else if (reachRight) 
									{
										reachRight = false;
									}
								}

								pixelPos += canvas.width * 4;
							}
						}
					};

					var startX = state.params.start.X;
					var startY = state.params.start.Y;

					var pixelPos = (startY * canvas.width + startX) * 4;

					var r = colorLayerData.data[pixelPos];
					var g = colorLayerData.data[pixelPos + 1];
					var b = colorLayerData.data[pixelPos + 2];
					var a = colorLayerData.data[pixelPos + 3];

					if (r === fillColor.r && g === fillColor.g && b === fillColor.b && a != 0) 
					{
						// - Return because trying to fill with the same color
						return;
					}

					if (matchOutlineColor(r, g, b, a)) 
					{
						// - Return because clicked outline
						return;
					}

					floodFill(startX, startY, r, g, b, a);

					// - Draw the current state of the color layer to the canvas
					context.putImageData(colorLayerData, 0, 0)
				}
			}

			states = this.get('states');

			for (var i = 0; i < states.length; i++) 
			{
				states[i].drawed = true;
			}
			
			this.set('states', states);
		}

	}
});
