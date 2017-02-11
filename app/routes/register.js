import Ember from 'ember';

import ENV from '../config/environment';

export default Ember.Route.extend(
{

	server: Ember.inject.service('server'),

	Data:
	{
		supportedLanguages: ENV.APP.supportedLanguages,
		username: '',
		password: '',
		passwordConfirm: '',
		email: '',
		disabled: true
	},

	model: function () 
	{
		return this.get("Data");
	},

	actions:
	{
		setLocalization: function () 
		{
			for (var i = 0; i < this.get("Data.supportedLanguages").length; i++) 
			{
				this.set("Data.supportedLanguages." + i + ".selected", false);
			}

			this.set("Data.supportedLanguages.0.selected", true);
		},

		cancel: function () 
		{
			this.transitionTo('index');
		},

		confirm: function () 
		{
			var server = this.get('server');

			var that = this;

			server.connect();

			server.on('connect', function () 
			{
				var data = 
				{
					command: 'Authentication/Register',
					parameters:
					{
						Username: that.get('Data.username'),
						Password: that.get('Data.password'),
						Email: that.get('Data.email'),
						Language: that.get('Data.supportedLanguages').find(function (elem) 
							{
								return elem.selected;
							})
					}
				};

				server.send(JSON.stringify(data));
			});

			server.on('message', function (data) 
			{
				var response = JSON.parse(data);

				if (response.command === "Authentication/Register")
				{
					if (response.parameters.response === true)
					{
						Ember.$(".register").fadeOut(100).after(function () 
						{
							Ember.$(".registerCompleted").fadeIn(500);
						});

						setTimeout(function () 
						{
							that.transitionTo('index');
						}, 3000);
					}
					else
					{
						// - Handle error
					}

					server.disconnect();
				}
			});

			
		},

		mailCheck: function (email) 
		{
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			
			if (!re.test(email))
			{
				Ember.$("#mail").attr("data-balloon", "Invalid mail format");
				Ember.$("#mail").attr("data-balloon-pos", "left");

				Ember.$("#mail textbox input").css("cssText", "border-bottom: 1px dashed #900 !important;");
			}
			else
			{
				Ember.$("#mail").attr("data-balloon", null);
				Ember.$("#mail").attr("data-balloon-pos", null);

				Ember.$("#mail textbox input").css("cssText", "border-bottom: inherith");
			}

			this.send('check');
		},

		passwordCheck: function (password) 
		{
			var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

			if (!re.test(password))
			{
				Ember.$("#password").attr("data-balloon", "Password must contains the following rules:\n- At least one digit\n- At least one lower case\n- At least one upper case\n- At least 8 from the mentioned characters");
				Ember.$("#password").attr("data-balloon-pos", "left");
				Ember.$("#password").attr("data-balloon-break", '');

				Ember.$("#password textbox input").css("cssText", "border-bottom: 1px dashed #900 !important;");
			}
			else
			{
				Ember.$("#password").attr("data-balloon", null);
				Ember.$("#password").attr("data-balloon-pos", null);

				Ember.$("#password textbox input").css("cssText", "border-bottom: inherith");
			}

			this.send('check');
		},

		passwordConfirmCheck: function (password) 
		{
			if (password !== this.get("Data.password"))
			{
				Ember.$("#passwordConfirm").attr("data-balloon", "Re-type the correct password.");
				Ember.$("#passwordConfirm").attr("data-balloon-pos", "left");

				Ember.$("#passwordConfirm textbox input").css("cssText", "border-bottom: 1px dashed #900 !important;");
			}
			else
			{
				Ember.$("#passwordConfirm").attr("data-balloon", null);
				Ember.$("#passwordConfirm").attr("data-balloon-pos", null);

				Ember.$("#passwordConfirm textbox input").css("cssText", "border-bottom: inherith");
			}

			this.send('check');
		},

		check: function () 
		{
			var	username = this.get("Data.username");
			var	password = this.get("Data.password");
			var	email = this.get("Data.email");
			var	passwordConfirm = this.get("Data.passwordConfirm");

			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var rp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

			var pass = true;
			
			if (!re.test(email))
			{
				pass = false;
			}

			if (username === '')
			{
				pass = false;
			}

			if (password !== passwordConfirm || !rp.test(password))
			{
				pass = false;
			}

			this.set("Data.disabled", !pass);
		}
	}

});
