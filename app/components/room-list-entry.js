import Ember from 'ember';

var Moment = require('moment');

export default Ember.Component.extend(
{
	classNames: ['roomListEntry'],

	// - If tab is open
	open: false,

	data: 
	{
		name: "",
		language: "",
		description: "",
		creation: Date.now(),

		currentRount: 0,
		maxRounds: 0,

		maxPlayers: 0,
		users: []
	},

	// - Calculate the room owner
	owner: Ember.computed('data', function () 
	{
		var users = this.get('data').users;

		return users.filter(function (val)
		{
			return val.owner === true;
		})[0];
	}),

	timestamp: Ember.computed('data', function () 
	{
		return Moment(this.get('data.creation')).format("YYYY-MM-DD h:mm:ss a");
	}),

	init: function () 
	{
		this._super(arguments);
	},

	didInsertElement: function () 
	{
		var that = this;

		this.$(".name, .users, .round").click(function () 
		{
			that.send("click");
		});
	},

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

		join: function () 
		{
			this.sendAction('action', this.get('data'));
		}
	}

});
