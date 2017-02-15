import Ember from 'ember';

export default Ember.Component.extend(
{
	visible: false,

	init: function () 
	{
		this._super(arguments);
	},

	didInsertElement: function () 
	{
		var that = this;

		this.$(".overlay").hide();
	},

	valueObserver: Ember.observer('visible', function(sender, key, value, rev) 
	{
		value = this.get('visible');

		if (value)
		{
			Ember.$(".overlay").fadeIn(500);
		}
		else
		{
			Ember.$(".overlay").fadeOut(500);
		}
	}),

	actions:
	{
		outClick: function () 
		{
			if (this.get('visible'))
			{
				this.set('visible', false);
			}
		}
	}
});
