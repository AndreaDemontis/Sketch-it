import Ember from 'ember';

import ENV from '../config/environment';

export default Ember.Component.extend(
{

	classNames: ['roomListEntryNew'],
	open: false,

	supportedLanguages: ENV.APP.supportedLanguages,

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

	init: function () 
	{
		this._super(arguments);
	},

	didInsertElement: function () 
	{
		var that = this;

		this.$(".name").click(function () 
		{
			that.send("click");
		});
	},

	cantConfirm: Ember.computed('roomName', function () 
	{
		return this.get('roomName') === '';
	}),

	actions:
	{
		outClick: function () 
		{
			if (!this.get('open'))
			{
				this.$(".expanded").slideUp(0);
			}
		},

		click: function () 
		{
			if (!this.get('open'))
			{
				this.$(".expanded").slideDown(0);
			}
			else 
			{
				this.$(".expanded").slideUp(0);
			}
	
			this.set('open', !this.get('open'));
		},

		create: function () 
		{
			var data =
			{
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