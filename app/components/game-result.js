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

	drawings:
	[
		{ 
			file: "assets/images/dog.jpg", 
			author: "Mario", 
			word: "Cane",
			round: 3,

			scoreboard: 
			[
				{name: "Giorgio", found: true, time: 13},
				{name: "Maario", found: true, time: 27},
				{name: "Frumento", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0}
			] 
		},
		{ 
			file: "assets/images/dog.jpg", 
			author: "Mario", 
			word: "Cane",
			round: 3,

			scoreboard: 
			[
				{name: "Giorgio", found: true, time: 13},
				{name: "Maario", found: true, time: 27},
				{name: "Frumento", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0}
			] 
		},
		{ 
			file: "assets/images/dog.jpg", 
			author: "Mario", 
			word: "Cane",
			round: 3,

			scoreboard: 
			[
				{name: "Giorgio", found: true, time: 13},
				{name: "Maario", found: true, time: 27},
				{name: "Frumento", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0}
			] 
		},
		{ 
			file: "assets/images/dog.jpg", 
			author: "Mario", 
			word: "Cane",
			round: 3,

			scoreboard: 
			[
				{name: "Giorgio", found: true, time: 13},
				{name: "Maario", found: true, time: 27},
				{name: "Frumento", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0}
			] 
		},
		{ 
			file: "assets/images/star.png", 
			author: "Vivaldi", 
			word: "Stela", 
			round: 7,

			scoreboard: 
			[
				{name: "Giorgio", found: true, time: 13},
				{name: "Maario", found: true, time: 27},
				{name: "Frumento", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0}
			] 
		},
		{ 
			file: "assets/images/dog.jpg", 
			author: "Fanciullo", 
			word: "Motocarro a vapore", 
			round: 10,

			scoreboard: 
			[
				{name: "Giorgio", found: true, time: 13},
				{name: "Maario", found: true, time: 27},
				{name: "Frumento", found: false, time: 0},
				{name: "Vermentino", found: false, time: 0}
			] 
		}
	],

	selected: null,

	visible: false,

	init: function () 
	{
		this._super(arguments);
	},

	didInsertElement: function () 
	{
		var that = this;

		this.$(".overlay").hide();

		this.send('selectImage', this.get('drawings.0'));
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
		selectImage: function (img) 
		{
			this.set('selected', img);
		},

		exit: function () 
		{
			this.set('visible', false);
		},

		newGame: function () 
		{
			this.set('visible', false);
		}
	}
});
