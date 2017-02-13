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

		window.alert("cane");

		server.on('connect', function () 
		{
			var data = 
			{
				command: 'Authentication/Login',
				parameters:
				{
					Username: that.get('Data.username'),
					Password: that.get('Data.password')
				}
			};

			server.send(JSON.stringify(data));
		});

		server.on('message', function (data) 
		{
			var response = JSON.parse(data);

			if (response.command === "Authentication/Login")
			{
				if (response.parameters.response === true)
				{
					that.transitionTo('lobby');
				}
				else
				{
					server.disconnect();

					Ember.$(".login .error").html(response.parameters.response);
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
			this.transitionTo('register');
		},

		login: function () 
		{
			var server = this.get('server');

			var that = this;

			if (server.connected)
				server.disconnect();
			else server.connect();

			
		}
	}
});