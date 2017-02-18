import Ember from 'ember';

export default Ember.Route.extend(
{
	server: Ember.inject.service('server'),

	modelData: 
	{
		users: [],
		messages: [],

		userPopupState: false,

		endGamePopupState: false
	},

	activate: function ()
	{
		var server = this.get('server');

		var that = this;

		// - Reset message handlers
		server.off('message');

		// - Server messages handler
		server.on('message', function (content) 
		{
			var data = JSON.parse(content);

			switch (data.command)
			{
				case "Room/ReceiveMesage":

					var messages = that.get('modelData.messages');

					// - Push new messages on the message list
					messages.pushObject(data.parameters);

					// - Update chat messages
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
			// TODO: Send message to the server for room exit
			this.transitionTo('lobby');
		},

		endGame: function () 
		{
			// - TODO: This will be triggered from the server
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

				// - Send chat message to the server
				server.send(JSON.stringify(data));
			}
		}
	}


});
