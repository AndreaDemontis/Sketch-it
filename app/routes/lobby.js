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

		// - Handle server messages
		server.on('message', function (content) 
		{
			var data = JSON.parse(content);

			switch (data.command)
			{
				case "Lobby/ReceiveMesage":

					var messages = that.get('modelData.messages');

					messages.pushObject(data.parameters);

					// - Add a message to the chat
					that.set('modelData.messages', messages);

					break;

				case "Lobby/RoomList":

					var rooms = data.parameters;

					// - Update room list
					that.set('modelData.rooms', rooms);

					break;

				case "Lobby/OpenRoomResponse":

					// - Handle room join confirm
					this.transitionTo('gameplay', data.parameters);
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
						id: room.id
					}
				};

				// - Send message to the server
				server.send(JSON.stringify(sendData));
			}
		},

		newRoom: function (data) 
		{
			this.transitionTo('gameplay');
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
					command: 'Lobby/SendMessage',
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
