import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend
({

	appSettings: storageFor('settings'),

	Data:
	{
		username: '',
		password: '',
	},

	activate: function ()
	{

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
			if ("password" === this.get('Data.password') && "username" === this.get('Data.username'))
			{
				this.transitionTo('lobby');
			}
			else
			{
				Ember.$(".login .error").html("Username or password are invalid.");
				Ember.$(".login .error").fadeIn(500);

				setTimeout(function () 
				{
					Ember.$(".login .error").fadeOut(500);
				}, 4000);
			}
		}
	}
});
