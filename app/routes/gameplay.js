import Ember from 'ember';

export default Ember.Route.extend(
{
	modelData: 
	{
		users:
		[
			{ name: 'Giancarlo', drawing: false, score: 12 }, 
			{ name: 'Mirry', drawing: true, score: 200}, 
			{ name: 'Fra07', drawing: false, score: 0, current: true}, 
			{ name: 'Dany', drawing: false, score: 132},
			{ name: 'Dany', drawing: false, score: 132},
			{ name: 'Dany', drawing: false, score: 132}
		],

		messages:
		[
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'SPAMMMM', system: false },
			{ user: 'Giorgio', content: 'Hei ciao! come stai? :(', system: false },
			{ user: 'Francesco', content: 'Hei ciao! sto bene owo', system: false },
			{ user: 'xXxSimone200xXx', content: 'sono sordo.', system: false },
			{ user: 'Giorgio', content: 'Hei ciao! come stai? :(', system: false },
			{ user: '', content: 'A new user joined on Sketch-it!', system: true },
			{ user: 'Pietro Smusi', content: 'Oh malvenuto!', system: false },
			{ user: 'BaldoTridente', content: 'uvuvwevwevwe onyetenyevwe ugwemubwem ossas', system: false },
			{ user: '', content: 'New public room: Bel nome', system: true },
			{ user: 'Pietro Smusi', content: 'Fantastico ora ci entro :D', system: false },
			{ user: 'ArMa79', content: 'Sono gay ehehehehe ahahahvihfoeiowief', system: false },
			{ user: 'Pietro Smusi', content: 'Oh malvenuto!', system: false }
		],

		userPopupState: false
		
	},

	activate: function ()
	{
	},


	model: function () 
	{
		return this.get("modelData");
	},

	actions:
	{
		exit: function () 
		{
			this.transitionTo('lobby');
		}
	}


});
