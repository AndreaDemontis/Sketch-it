import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend
({

	appSettings: storageFor('settings'),

	server: Ember.inject.service('server'),

	Data:
	{
		username: '',
		password: '',
	},

	activate: function ()
	{
		var that = this;

		var server = this.get('server');
		
		// - Unbind events
		server.off('connect');
		server.off('message');
		
		// - Bind connection data send for login
		server.on('connect', function () 
		{
			var data = 
			{
				command: 'Authentication/Login',
				parameters:
				{
					username: that.get('Data.username'),
					password: that.get('Data.password')
				}
			};

			server.send(JSON.stringify(data));
		});

		// - Handle response from the server
		server.on('message', function (data) 
		{
			var response = JSON.parse(data);

			// - If response is a login response
			if (response.command === "Authentication/Login")
			{
				// - Check if ther's an error
				if (response.parameters.response === true)
				{
					// - Go to lobby if no errors
					that.transitionTo('lobby');
				}
				else
				{
					// - Else disconnect
					server.disconnect();

					// - And shot an error popup
					Ember.$(".login .error").html(response.parameters.error);
					Ember.$(".login .error").fadeIn(500);

					setTimeout(function () 
					{
						Ember.$(".login .error").fadeOut(500);
					}, 4000);
				}
			}
		});
	},

	model: function ()
	{
		return this.get('Data');
	},

	renderTemplate: function ()
	{
		this._super(this, arguments);
		this.render();
	},

	actions:
	{
		register: function () 
		{
			// - Go to register layout
			this.transitionTo('register');
		},

		login: function () 
		{
			var server = this.get('server');

			var that = this;

			// Connect and send request
			if (server.connected)
				server.disconnect();
			else server.connect();
		}
	}
});
