import Ember from 'ember';

export default Ember.Route.extend(
{
	server: Ember.inject.service('server'),

	modelData: 
	{
		rooms: [],
		messages: [],

		userPopupState: false
	},

	activate: function ()
	{
		var server = this.get('server');

		var that = this;

		// - Remove binded events
		server.off('connect');
		server.off('message');

		var data = 
		{
			command: 'Lobby/Join'
		};

		server.send(JSON.stringify(data));

		// - Handle server messages
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
						user: data.parameters.username

					});

					// - Add a message to the chat
					that.set('modelData.messages', messages);

					break;

				case "Lobby/GetRooms":

					var rooms = data.parameters.rooms;

					// - Update room list
					that.set('modelData.rooms', rooms);

					break;

				case "Lobby/JoinRoom":

					// - Check if there are errors
					if (data.parameters.response == true)
					{

						// - Handle room join confirm
						that.transitionTo('gameplay');

					}
			}
		});
		
	},


	model: function () 
	{
		return this.get("modelData");
	},

	actions: 
	{

		openRoom: function (room) 
		{
			var server = this.get('server');

			if (server.connected) 
			{
				var sendData =
				{
					command: 'Lobby/JoinRoom',
					parameters: 
					{
						room: room.name
					}
				};

				// - Send message to the server
				server.send(JSON.stringify(sendData));
			}
		},

		newRoom: function (data) 
		{
			var server = this.get('server');

			if (server.connected) 
			{
				var sendData =
				{
					command: 'Lobby/CreateRoom',
					parameters: data
				};

				// - Send message to the server
				server.send(JSON.stringify(sendData));
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

				// - Send message to the server
				server.send(JSON.stringify(data));
			}
		}

	}

});
