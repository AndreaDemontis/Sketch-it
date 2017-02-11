import Ember from 'ember';

export default Ember.Component.extend(
{

	classNames: ['roomListEntry'],
	open: false,

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
