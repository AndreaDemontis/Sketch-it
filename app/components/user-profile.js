import Ember from 'ember';

export default Ember.Component.extend(
{
	classNames: [ 'userPopup' ],

	// - Popup visible
	visible: false,

	// - User data
	user:
	{
		name: "Username",
		language: "it",
		description: "Hi I'm Username, I was born in Sardinia and I like to draw everythink I see.",
		wins: 64,
		wordsFound: 210,
		totalGames: 43,
		playTime: "23h",
		memberSince: "1yr",

		friends: 
		[
			{ name: "Mario", online: true },
			{ name: "Giovanni", online: true },
			{ name: "Cardioide", online: true },
			{ name: "Cefalo", online: false },
			{ name: "Mastraio", online: false },
			{ name: "Uvuvwevwewe", online: true },
			{ name: "Nandovado", online: true },
			{ name: "Manna", online: true }
		]
	},

	init: function () 
	{
		this._super(arguments);
	},

	didInsertElement: function () 
	{
		var that = this;

		Ember.$(".userPopup > .overlay").hide();
	},

	valueObserver: Ember.observer('visible', function(sender, key, value, rev) 
	{
		value = this.get('visible');

		if (value)
		{
			Ember.$(".userPopup > .overlay").fadeIn(500);
		}
		else
		{
			Ember.$(".userPopup > .overlay").fadeOut(500);
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
