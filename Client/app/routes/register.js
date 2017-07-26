import Ember from 'ember';

import ENV from '../config/environment';

export default Ember.Route.extend(
{

	server: Ember.inject.service('server'),

	data:
	{
		supportedLanguages: ENV.APP.allLanguages,
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

	currentLanguage: Ember.computed('data.supportedLanguages', function () 
	{
		var Languages = this.get('data.supportedLanguages');

		return Languages.find(function (elem) 
		{
			return elem.selected;
		});
	}),

	model: function () 
	{
		return this.get("data");
	},

	actions:
	{
		setLocalization: function () 
		{
			// - Set current language on italy (for now).
			for (var i = 0; i < this.get("data.supportedLanguages").length; i++) 
			{
				this.set("data.supportedLanguages." + i + ".selected", false);
			}

			this.set("data.supportedLanguages.0.selected", true);
		},

		cancel: function () 
		{
			this.transitionTo('index');
		},

		confirm: function () 
		{
			var server = this.get('server');

			var that = this;

			// - Reset events
			server.off('connect');
			server.off('message');

			// - On connect send register request
			server.on('connect', function () 
			{
				var data = 
				{

					command: 'Authentication/Register',
					parameters:
					{
						Username: that.get('data.username'),
						Password: that.get('data.password'),
						Email: that.get('data.email'),
						Language: that.get('currentLanguage')
					}
				};

				server.send(JSON.stringify(data));
			});

			// - Handle response from server
			server.on('message', function (data) 
			{
				var response = JSON.parse(data);

				// - If it's a register response
				if (response.command === "Authentication/Register")
				{
					// - Check if there are errors
					if (response.parameters.response == true)
					{
						// - If no errors shows confirm popup
						Ember.$(".register").fadeOut(100).after(function () 
						{
							Ember.$(".registerCompleted").fadeIn(500);
						});

						// - And return to index
						setTimeout(function () 
						{
							that.transitionTo('index');
						}, 3000);
					}
					else
					{
						// - And shot an error popup
						Ember.$(".register .error").html(response.parameters.error);
						Ember.$(".register .error").fadeIn(500);

						setTimeout(function () 
						{
							Ember.$(".register .error").fadeOut(500);
						}, 4000);
					}

					server.disconnect();
				}
			});

			// Start connect process
			server.connect();
		},

		checkValues: function () 
		{
			// - Validate input values
			this.send('mailCheck', this.get('data.email'));
			this.send('passwordCheck', this.get('data.password'));
			this.send('passwordConfirmCheck', this.get('data.passwordConfirm'));

			// - Set buttons
			this.send('check');
		},

		mailCheck: function (email) 
		{
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			
			if (!re.test(email))
			{
				Ember.$("#mail").attr("data-balloon", "Invalid mail format");
				Ember.$("#mail").attr("data-balloon-pos", "left");

				Ember.$("#mail textbox input").css("cssText", "border-bottom: 1px dashed #900 !important;");
			
				this.set('emailError', true);
			}
			else
			{
				Ember.$("#mail").attr("data-balloon", null);
				Ember.$("#mail").attr("data-balloon-pos", null);

				Ember.$("#mail textbox input").css("cssText", "border-bottom: inherith");

				this.set('emailError', false);
			}
		},

		passwordCheck: function (password) 
		{
			var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

			var emailError = this.get('emailError');

			if (!re.test(password) && !emailError)
			{
				Ember.$("#password").attr("data-balloon", "Password must contains the following rules:\n- At least one digit\n- At least one lower case\n- At least one upper case\n- At least 8 from the mentioned characters");
				Ember.$("#password").attr("data-balloon-pos", "left");
				Ember.$("#password").attr("data-balloon-break", '');

				Ember.$("#password textbox input").css("cssText", "border-bottom: 1px dashed #900 !important;");
			
				this.set('passwordError', true);
			}
			else
			{
				Ember.$("#password").attr("data-balloon", null);
				Ember.$("#password").attr("data-balloon-pos", null);

				Ember.$("#password textbox input").css("cssText", "border-bottom: inherith");
			
				this.set('passwordError', false);
			}
		},

		passwordConfirmCheck: function (password) 
		{
			var emailError = this.get('emailError');
			var passwordError = this.get('passwordError');

			if (password !== this.get("data.password") && !emailError && !passwordError)
			{
				Ember.$("#passwordConfirm").attr("data-balloon", "Re-type the correct password.");
				Ember.$("#passwordConfirm").attr("data-balloon-pos", "left");

				Ember.$("#passwordConfirm textbox input").css("cssText", "border-bottom: 1px dashed #900 !important;");
			
				this.set('confirmError', true);
			}
			else
			{
				Ember.$("#passwordConfirm").attr("data-balloon", null);
				Ember.$("#passwordConfirm").attr("data-balloon-pos", null);

				Ember.$("#passwordConfirm textbox input").css("cssText", "border-bottom: inherith");
			
				this.set('confirmError', false);
			}
		},

		check: function () 
		{
			var	username = this.get("data.username");
			var	password = this.get("data.password");
			var	email = this.get("data.email");
			var	passwordConfirm = this.get("data.passwordConfirm");

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

			this.set("data.disabled", !pass);
		}
	}

});
