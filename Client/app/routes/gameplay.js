import Ember from 'ember';

const DataURI = require('datauri').promise;

export default Ember.Route.extend(
{
	server: Ember.inject.service('server'),

	modelData: 
	{
		users: [],

		messages: [],

		maxRound: 0,
		currentRound: 0,
		timeLeft: 100,
		realTime: 120,
		currentWord: "",
		definition: "",
		drawing: false,
		maxTime: 0,

		userPopupState: false,

		endGamePopupState: false,

		timer: null,

		extImage: "",
	},

	activate: function ()
	{
		var server = this.get('server');

		var that = this;

		// - Reset message handlers
		server.off('message');

		var data = 
		{
			command: 'Gameplay/RoundInfo'
		};

		server.send(JSON.stringify(data));

		// - Server messages handler
		server.on('message', function (content) 
		{
			var data = JSON.parse(content);

			switch (data.command)
			{
				case "Chat/Message":

					var messages = that.get('modelData.messages');

					messages.pushObject({

						content: data.parameters.content,
						system: data.parameters.username === "",
						user: data.parameters.username,
						score: data.parameters.score

					});

					// - Add a message to the chat
					that.set('modelData.messages', messages);

					break;

				case "Gameplay/RoundInfo":

					var info = data.parameters;

					var restartTimer = false;

					if (that.get('modelData.currentWord') == "" && info.currentWord != "")
						restartTimer = true;

					var timer = that.get('modelData.timer');

					clearInterval(timer);

					that.set('modelData.users', info.users.sort(function(a, b){return a.score - b.score}));
					that.set('modelData.maxRound', info.maxRounds);
					that.set('modelData.currentRound', info.roundNumber);
					that.set('modelData.timeLeft', info.secondsLeft / info.maxTime * 100);
					that.set('modelData.realTime', info.secondsLeft);
					that.set('modelData.currentWord', info.currentWord);
					that.set('modelData.definition', info.definition);
					that.set('modelData.drawing', info.drawing);
					that.set('modelData.maxTime', info.maxTime);
					if (info.currentWord != "")
					{
						that.set('modelData.timer', setInterval(function()
						{

							that.set('modelData.realTime', Math.max(parseInt(that.get('modelData.realTime') - 1), 0));
							that.set('modelData.timeLeft', parseInt((that.get('modelData.realTime') / info.maxTime) * 100));

						}, 1000));
					}

					if (restartTimer)
						setTimeout(timer, 1000);

				case "Gameplay/Drawing":

					var image = data.parameters.base64;

					that.set('modelData.extImage', image);

					break;

				case "Gameplay/End":

					that.set("modelData.endGamePopupState", true);

					break;
			}
		});

		var that = this;

		
	},


	model: function () 
	{
		return this.get("modelData");
	},

	actions:
	{
		exit: function () 
		{
			// TODO: Send message to the server for room exit
			this.transitionTo('lobby');
		},

		endGame: function () 
		{
		},

		drawChanged: function(imageData)
		{
			var server = this.get('server');

			if (server.connected) 
			{
				var data =
				{
					command: 'Gameplay/Drawing',
					parameters:
					{
						base64: imageData
					}
				};

				// - Send chat message to the server
				server.send(JSON.stringify(data));
			}
		},

		sendMessage: function (content) 
		{
			var server = this.get('server');

			if (server.connected) 
			{
				var data =
				{
					command: 'Chat/Message',
					parameters:
					{
						content: content
					}
				};

				// - Send chat message to the server
				server.send(JSON.stringify(data));
			}
		}
	}


});
