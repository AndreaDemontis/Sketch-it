import Ember from 'ember';

export default Ember.Route.extend(
{
	server: Ember.inject.service('server'),

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
		],

		userPopupState: false,

		endGamePopupState: false
		
	},

	activate: function ()
	{
		var server = this.get('server');

		var that = this;

		server.off('connect');
		server.off('message');

		server.on('message', function (content) 
		{
			var data = JSON.parse(content);

			switch (data.command)
			{
				case "Room/ReceiveMesage":

					var messages = that.get('modelData.messages');

					messages.pushObject(data.parameters);

					that.set('modelData.messages', messages);

					break;
			}
		});
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
		},

		endGame: function () 
		{
			this.set("modelData.endGamePopupState", true);
		},

		sendMessage: function (data) 
		{
			var server = this.get('server');

			if (server.connected) 
			{
				var data =
				{
					command: 'Room/SendMessage',
					parameters:
					{
						content: content
					}
				};

				server.send(JSON.stringify(data));
			}
		}
	}


});
