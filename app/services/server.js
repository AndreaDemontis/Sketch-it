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

		this.set('socket', new net.Socket());
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

			var seq = 0;

			var terminator = String.fromCharCode(4);;

			data = buffer + data;

			for (var i = 0; i < data.length; i++) 
			{
				if (data.charAt(i) == terminator)
				{
					if (seq == 0)
					{
						data = data.substring(0, i) + data.substring(i + 1, data.length);
					}

					seq++;
				}
				else 
				{
					if (seq == 1)
					{
						// - message end
						console.log('Received: ' + data);
						that.trigger('message', data);

						data = "";
					}

					seq = 0;
				}
			}

			if (seq == 1)
			{
				// - message end
				console.log('Received: ' + data);
				that.trigger('message', data);

				data = "";
			}

			buffer = data;

			that.set('buffer', buffer);
		});

		socket.on('close', function() 
		{
			console.log('Connection closed.');

			that.set('connected', false);
			that.trigger('disconnect');
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

		var terminator = String.fromCharCode(4);

		var seq = false;

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
		}

		data += terminator;

		socket.write(data);
	}
});
