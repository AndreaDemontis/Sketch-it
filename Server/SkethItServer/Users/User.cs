using System;
using System.Linq;
using System.Data;
using System.Collections.Generic;
using System.Collections.Specialized;

using SkethItServer.Network;
using SkethItServer.Multiplayer;
using SkethItServer.Authentication;

using Newtonsoft.Json;


namespace SkethItServer.Users
{
    class User
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="T:SkethItServer.Users.User"/> class.
        /// </summary>
        /// <param name="session">Socket user session.</param>
        public User(Client session)
        {
            Client = session;

            Client.MessageReceived += Client_MessageReceived;
			Client.Disconnected += Client_Disconnected;
        }

		/// <summary>
		/// Gets the client instance.
		/// </summary>
		public Client Client { get; }

		/// <summary>
		/// 
		/// </summary>
		public Lobby CurrentLobby { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public Room CurrentRoom { get; set; }

        /// <summary>
        /// Gets the username.
        /// </summary>
        public string Username { get; private set; }

        /// <summary>
        /// Gets the email.
        /// </summary>
        public string Email { get; private set; }

		#region Authentication

		/// <summary>
		/// Triggered on user login.
		/// </summary>
		public event EventHandler UserLogin;

        /// <summary>
        /// Login this session with an username and a password.
        /// </summary>
        /// <returns>The login.</returns>
        /// <param name="username">Username.</param>
        /// <param name="password">Password.</param>
        public string Login(string username, string password)
        {
			if (username == string.Empty)
				return "Empty username field";

			if (password == string.Empty)
				return "Empty password field";

			DataRow data = UserFactory.Instance.Login(username, password);

			if (data != null)
			{
				Username = (string)data["Username"];
				Email = (string)data["Email"];

				UserLogin?.Invoke(this, EventArgs.Empty);

				return string.Empty;
			}

			return "Invalid username or password";
		}

        /// <summary>
        /// Register a new user with username and password.
        /// </summary>
        /// <returns>True if registration is completed.</returns>
        /// <param name="username">Username.</param>
        /// <param name="password">Password.</param>
        public static bool Register(string username, string password, string email)
        {
            return UserFactory.Instance.RegisterUser(username, password, email);
        }

		#endregion

		#region Chat messages

		/// <summary>
		/// Triggered on client chat message.
		/// </summary>
		public event EventHandler<ChatMessageData> ChatMessage;

		/// <summary>
		/// Send a message to this user.
		/// </summary>
		/// <param name="from">User that send the message.</param>
		/// <param name="content">Message content.</param>
		public void SendChatMessage(User from, string content, int? score = null, bool server = false)
		{
			ChatMessageData data = new ChatMessageData();
			data.Username = from?.Username ?? "";
			data.Content = content;
            data.Score = score;
            data.Server = server;

			SendResponse(CommandType.ChatMessage, data);
		}

		#endregion

		#region Lobby

		/// <summary>
		/// Triggered on user lobby join.
		/// </summary>
		public event EventHandler LobbyJoin;

        /// <summary>
        /// Occurs when lobby leave.
        /// </summary>
        public event EventHandler LobbyLeave;

		/// <summary>
		/// Join this user in the main lobby.
		/// </summary>
		public void MoveToLobby()
		{
            if (CurrentRoom != null)
                return;

			LobbyJoin?.Invoke(this, EventArgs.Empty);

            CurrentLobby.Users.Add(this);
            CurrentLobby.Rooms.CollectionChanged += LobbyRoomListChanged;

            SendRoomList();
		}

        /// <summary>
        /// Leaves the lobby.
        /// </summary>
        public void LeaveLobby()
        {
            if (CurrentLobby == null)
                return;

            CurrentLobby.Users.Remove(this);

            CurrentLobby.Rooms.CollectionChanged -= LobbyRoomListChanged;

            CurrentLobby = null;
        }

		/// <summary>
		/// 
		/// </summary>
		/// <param name="name"></param>
		public void JoinRoom(string name)
		{
			if (CurrentLobby == null)
				return;

			var room = CurrentLobby.Rooms.Where(x => x.Name == name).FirstOrDefault();

			room.Users.Add(this);

			CurrentRoom = room;
		}

		/// <summary>
		/// Send a room list to the client.
		/// </summary>
		public void SendRoomList()
		{
			if (CurrentLobby != null)
			{
				RoomsListData rooms = new RoomsListData();
				rooms.Rooms = new List<RoomData>();

				foreach (Room r in CurrentLobby.Rooms)
				{
                    rooms.Rooms.Add(new RoomData()
                    {
                        Name = r.Name,
                        Password = r.Password,
                        Description = r.Description,
                        EndlessMode = r.EndlessMode,
                        EnableHints = r.EnableHints,
                        EnableAway = r.EnableAway,
                        MaxPlayers = r.MaxPlayers,
                        MaxRounds = r.MaxRounds,
                        CurrentRound = r.Rounds.Count(),
                        Language = r.Dictionary,
                        Owner = r.Owner,
                        Users = r.Users.Select((x) => new RoundUser 
                        { 
                            Name = x.Username, 
                            IsDrawing = (r.CurrentRound?.Drawer ?? null) == x, 
                            Score = r.CurrentRound?.Scores[x] ?? 0 
                        }).ToList()
					});
				}

				SendResponse(CommandType.GetRooms, rooms);
			}
		}

        void LobbyRoomListChanged(object sender, NotifyCollectionChangedEventArgs e)
        {
            SendRoomList();
        }

		#endregion

		#region Room

		/// <summary>
		/// Triggered on user room join.
		/// </summary>
		public event EventHandler RoomJoin;

		/// <summary>
		/// Occurs when user leaves the current room.
		/// </summary>
		public event EventHandler RoomLeave;

        /// <summary>
        /// Moves to the specified room.
        /// </summary>
        /// <param name="room">Target room.</param>
        public void MoveToRoom(Room room)
        {
            LeaveLobby();

            CurrentRoom = room;

            room.Users.Add(this);

            RoomJoin?.Invoke(this, EventArgs.Empty);
        }

        /// <summary>
        /// Leaves the current room.
        /// </summary>
        public void LeaveCurrentRoom()
        {
            MoveToLobby();

            CurrentRoom.Users.Add(this);

            CurrentRoom = null;

            RoomLeave?.Invoke(this, EventArgs.Empty);
        }

        #endregion

        #region Message dispatching

        void Client_MessageReceived(object sender, MessageEventArgs args)
		{
			Command command = null;

			try
			{
				command = JsonConvert.DeserializeObject<Command>(args.String);

                if (command == null)
					return;
			}
			catch (Exception e)
			{
				return;
			}

			switch(command.Type)
			{
				case CommandType.Register:

					// - User registration section
					RegisterData rdata = (RegisterData)command.Data;

					if (Register(rdata.Username, rdata.Password, rdata.Email))
						DefaultResponse(CommandType.Register, true);
					else DefaultResponse(CommandType.Register, false);

					break;

				case CommandType.Login:

					// - User login section
					LoginData ldata = (LoginData)command.Data;

					DataRow data =  UserFactory.Instance.Login(ldata.Username, ldata.Password);

					string e = "";
					if ((e = Login(ldata.Username, ldata.Password)) == string.Empty)
						DefaultResponse(CommandType.Login, true);
					else
						DefaultResponse(CommandType.Login, false, e);

					break;

				case CommandType.LobbyJoin:

                    // - Insert the user in a lobby
                    MoveToLobby();

					break;

				case CommandType.JoinRoom:

					// - User login section
					JoinData jdata = (JoinData)command.Data;

					JoinRoom(jdata.Room);

					if (CurrentRoom != null)
						LeaveLobby();

                    DefaultResponse(CommandType.JoinRoom, true);

					break;

				case CommandType.ChatMessage:

					// - Message received from the client.
					ChatMessageData cdata = (ChatMessageData)command.Data;
					cdata.Username = Username;

					ChatMessage?.Invoke(this, cdata);

					break;

                case CommandType.CreateRoom:

                    if (CurrentLobby == null)
                        DefaultResponse(CommandType.CreateRoom, false);

					// - Message received from the client.
					RoomData rodata = (RoomData)command.Data;
                    Room newRoom = null;

                    CurrentLobby.Rooms.Add(newRoom = new Room()
                    {
                        Name = rodata.Name,
                        Description = rodata.Description,
                        MaxRounds = rodata.MaxRounds,
                        MaxPlayers = rodata.MaxPlayers,
                        Dictionary = "it"
                    });

                    newRoom.Users.Add(this);
                    CurrentRoom = newRoom;
                    LeaveLobby();

                    JoinRoom(newRoom.Name);

                    DefaultResponse(CommandType.JoinRoom, true);

                    break;

				case CommandType.GetRooms:

					// - Client requests the room list
					if (CurrentLobby != null)
					{
						SendRoomList();
					}
					else
					{
						DefaultResponse(CommandType.GetRooms, false, "You are not in a lobby.");
					}

                    break;

                case CommandType.RoundInfo:

                    if (CurrentRoom != null)
                    {
                        CurrentRoom.SendRoundData(this);
                    }

					break;

                case CommandType.Drawing:

                    if (CurrentRoom == null)
                        return;

                    DrawingData ddata = (DrawingData)command.Data;

                    CurrentRoom.SendDraw(ddata.Data);

                    break;
			}
		}

		#endregion

		#region Response section

		/// <summary>
		/// Send a generic response message.
		/// </summary>
		/// <param name="context">Message context.</param>
		/// <param name="response">Response.</param>
		public void DefaultResponse(CommandType context, bool response, string error = "")
		{
			Command newCommand = new Command();
			newCommand.Type = context;

			ResponseData newResponse = new ResponseData();
			newResponse.Response = response;
			newResponse.Error = error;

			newCommand.Data = newResponse;

			Client.Send(JsonConvert.SerializeObject(newCommand));
		}

        /// <summary>
        /// Send a generic response.
        /// </summary>
        /// <param name="context">Context of this response.</param>
        /// <param name="data">Response to send.</param>
        public void SendResponse(CommandType context, ICommandData data)
        {
            Command newCommand = new Command();
            newCommand.Type = context;
            newCommand.Data = data;

            Client.Send(JsonConvert.SerializeObject(newCommand));
        }

		#endregion

		#region Connection

		/// <summary>
		/// Triggered on client disconnection.
		/// </summary>
		public event EventHandler Disconnect;

		private void Client_Disconnected(object sender, EventArgs e)
		{
            LeaveLobby();
            LeaveCurrentRoom();

			Disconnect?.Invoke(this, EventArgs.Empty);
		}

		#endregion
	}
}
