import Ember from 'ember';

var net = require('net');

export default Ember.Service.extend(Ember.Evented,
{

	socket: null,
	connected: false,
	buffer: "",

	init() 
	{
		this._super(...arguments);

		var that = this;

		var socket = new net.Socket()

		socket.setNoDelay(true);

		socket.on('error', function (exception) 
		{
			console.log('Connection error:');
			console.log(exception);

			that.trigger('error');
			that.set('connected', false);
			that.trigger('disconnect');
		});


		socket.on('data', function(data) 
		{
			var buffer = that.get('buffer');

			var endIndex = 0;
			var starterIndex = 0;

			var lastChar = null
			var consecutive = 0;

			var terminator = String.fromCharCode(4);
			var starter = String.fromCharCode(3);

			data = buffer + data;

			for (var i = 0; i < data.length; i++) 
			{
				if (lastChar == data.charAt(i))
					consecutive++;
				else consecutive = 0;

				if (data.charAt(i) != starter)
				{
					if (consecutive == 0 && lastChar == starter)
						starterIndex = i;

					if (consecutive > 0 && lastChar == starter)
						data = data.substring(0, i - 2) + data.substring(i, data.length);
				}

				if (data.charAt(i) != terminator)
				{
					if (consecutive == 0 && lastChar == terminator)
						endIndex = i - 1;

					if (consecutive > 0 && lastChar == terminator)
						data = data.substring(0, i - 2) + data.substring(i, data.length);
				}

				if (endIndex > 0)
				{
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

			if (data.charAt(data.length - 1) == terminator)
			{
				if (consecutive == 0)
					endIndex = i - 1;
			}

			if (endIndex > 0)
			{
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

		socket.on('close', function() 
		{
			console.log('Connection closed.');

			that.set('connected', false);
			that.trigger('disconnect');
		});

		this.set('socket', socket);
	},

	connect()
	{
		var that = this;

		var socket = this.get('socket');

		socket.connect(56489, '127.0.0.1', function() 
		{
			console.log('Client connected to the server.');

			that.set('connected', true);
			that.trigger('connect');
		});
	},

	disconnect()
	{
		var socket = this.get('socket');

		socket.destroy();

		this.set('connected', false);
		this.trigger('disconnect');
	},

	send(data)
	{
		var socket = this.get('socket');

		console.log("Sending: " + data);

		var terminator = String.fromCharCode(4);
		var starter = String.fromCharCode(3);

		var seq = false;
		var sseq = false;

		for (var i = 0; i < data.length; i++) 
		{
			if (data.charAt(i) == terminator)
			{
				if (!seq)
				{
					data = data.substring(0, i - 1) + terminator + data.substring(i, data.length - 1);
				}
				seq = true;
			}
			else seq = false;

			if (data.charAt(i) == starter)
			{
				if (!sseq)
				{
					data = data.substring(0, i - 1) + starter + data.substring(i, data.length - 1);
				}
				sseq = true;
			}
			else sseq = false;
		}

		data += terminator;
		data = starter + data;

		socket.write(data);
	}
});
