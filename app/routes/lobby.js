import Ember from 'ember';

export default Ember.Route.extend(
{

	modelData: 
	{
		rooms:
		[
			{name: 'La stanza di prova', 		maxUsers: 5, currentRound: 4, maxRounds: 7, language: 'it', users: [ { name: 'Giancarlo', drawing: false, score: 12 }, { name: 'Mirry', drawing: true, score: 200}, { name: 'Fra07', drawing: false, score: 0}, { name: 'Dany', drawing: false, score: 132}], description: 'Una bella stanza in cui entrare, non so cosa scrivere nella descrizione ma deve essere abbastanza lunga.', cration: '15/03/2017 16:32' },
			{name: 'Anemone inpanato', 			maxUsers: 5, currentRound: 4, maxRounds: 7, language: 'fr', users: [ { name: 'Giancarlo', drawing: false, score: 12 }, { name: 'Mirry', drawing: true, score: 200}, { name: 'Fra07', drawing: false, score: 0}, { name: 'Dany', drawing: false, score: 132}], description: 'Una bella stanza in cui entrare, non so cosa scrivere nella descrizione ma deve essere abbastanza lunga.', cration: '15/03/2017 16:32' },
			{name: 'Frittelle arrosto', 		maxUsers: 5, currentRound: 4, maxRounds: 7, language: 'it', users: [ { name: 'Giancarlo', drawing: false, score: 12 }, { name: 'Mirry', drawing: true, score: 200}, { name: 'Fra07', drawing: false, score: 0}, { name: 'Dany', drawing: false, score: 132}], description: 'Una bella stanza in cui entrare, non so cosa scrivere nella descrizione ma deve essere abbastanza lunga.', cration: '15/03/2017 16:32' },
			{name: 'Non so che nome scegliere', maxUsers: 5, currentRound: 4, maxRounds: 7, language: 'it', users: [ { name: 'Giancarlo', drawing: false, score: 12 }, { name: 'Mirry', drawing: true, score: 200}, { name: 'Fra07', drawing: false, score: 0}, { name: 'Dany', drawing: false, score: 132}], description: 'Una bella stanza in cui entrare, non so cosa scrivere nella descrizione ma deve essere abbastanza lunga.', cration: '15/03/2017 16:32' },
			{name: 'bho', 						maxUsers: 5, currentRound: 4, maxRounds: 7, language: 'kr', users: [ { name: 'Giancarlo', drawing: false, score: 12 }, { name: 'Mirry', drawing: true, score: 200}, { name: 'Fra07', drawing: false, score: 0}, { name: 'Dany', drawing: false, score: 132}], description: 'Una bella stanza in cui entrare, non so cosa scrivere nella descrizione ma deve essere abbastanza lunga.', cration: '15/03/2017 16:32' },
			{name: 'Bel nome', 					maxUsers: 5, currentRound: 4, maxRounds: 7, language: 'jp', users: [ { name: 'Giancarlo', drawing: false, score: 12 }, { name: 'Mirry', drawing: true, score: 200}, { name: 'Fra07', drawing: false, score: 0}, { name: 'Dany', drawing: false, score: 132}], description: 'Una bella stanza in cui entrare, non so cosa scrivere nella descrizione ma deve essere abbastanza lunga.', cration: '15/03/2017 16:32' }
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
		]
		
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

		openRoom: function () 
		{
			this.transitionTo('gameplay');
		}

	}

});