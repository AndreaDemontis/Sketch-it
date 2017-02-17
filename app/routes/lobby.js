import Ember from 'ember';

export default Ember.Route.extend(
{
	server: Ember.inject.service('server'),

	modelData: 
	{
		rooms:
		[
		],

		messages:
		[
		],

		userPopupState: false
		
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
				case "Lobby/ReceiveMesage":

					var messages = that.get('modelData.messages');

					messages.pushObject(data.parameters);

					that.set('modelData.messages', messages);

					break;

				case "Lobby/RoomList":

					var rooms = data.parameters.rooms;

					that.set('modelData.rooms', rooms);

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

		openRoom: function () 
		{
			this.transitionTo('gameplay');
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

				server.send(JSON.stringify(data));
			}
		}

	}

});
