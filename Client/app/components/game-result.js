import Ember from 'ember';

export default Ember.Component.extend(
{
	classNames: [ 'gameEndPopup' ],

	users:
	[
		{ name: 'Username', score: 120 }, 
		{ name: 'Beatrice',  score: 90}, 
		{ name: 'Maria',  score: 68}
	],

	drawings:
	[
		{ 
			file: "assets/images/penna.png", 
			author: "Username", 
			word: "Pen",
			round: 15,

			scoreboard: 
			[
				{name: "Maria", found: true, time: 20},
				{name: "Beatrice", found: true, time: 32}
			] 
		},
		{ 
			file: "assets/images/joypad.png", 
			author: "Mario", 
			word: "Joypad",
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
			file: "assets/images/alba.png", 
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
			file: "assets/images/bussola.png", 
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
