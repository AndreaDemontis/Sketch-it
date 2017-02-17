import Ember from 'ember';

export default Ember.Component.extend(
{
	classNames: [ 'gameEndPopup' ],

	users:
	[
		{ name: 'Giancarlo', drawing: false, score: 12 }, 
		{ name: 'Mirry', drawing: true, score: 200}, 
		{ name: 'Fra07', drawing: false, score: 0, current: true}, 
		{ name: 'Dany', drawing: false, score: 132},
		{ name: 'Dany', drawing: false, score: 132},
		{ name: 'Dany', drawing: false, score: 132}
	],

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
			this.$(".overlay").fadeIn(500);
		}
		else
		{
			this.$(".overlay").fadeOut(500);
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
