using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft;
using Newtonsoft.Json.Converters;

namespace SkethItServer.Users
{

	/// <summary>
	/// Packet command types.
	/// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum CommandType
    {
        [EnumMember(Value = "Authentication/Login")]
        Login,

        [EnumMember(Value = "Authentication/Register")]
        Register,

		[EnumMember(Value = "Chat/Message")]
		ChatMessage,

		[EnumMember(Value = "Lobby/Join")]
		LobbyJoin,

		[EnumMember(Value = "Lobby/GetRooms")]
		GetRooms,

		[EnumMember(Value = "Lobby/CreateRoom")]
		CreateRoom,

		[EnumMember(Value = "Lobby/JoinRoom")]
		JoinRoom,

        [EnumMember(Value = "Gameplay/RoundInfo")]
        RoundInfo,

		[EnumMember(Value = "Gameplay/End")]
		GameEnd,

		[EnumMember(Value = "Gameplay/Drawing")]
		Drawing
    }

	/// <summary>
	/// Main message structure.
	/// </summary>
    [DataContract]
    [JsonConverter(typeof(CommandDataConverter))]
    class Command
    {
		/// <summary>
		/// Message type.
		/// </summary>
        [DataMember]
		[JsonProperty(PropertyName = "command")]
		public CommandType Type { get; set; }

		/// <summary>
		/// Message parameters.
		/// </summary>
        [DataMember]
		[JsonProperty(PropertyName = "parameters")]
		public ICommandData Data { get; set; }

    }

	/// <summary>
	/// Interface for all messages data.
	/// </summary>
    interface ICommandData
    {

    }

	/// <summary>
	/// Generic response data.
	/// </summary>
    [DataContract]
    class ResponseData : ICommandData
    {
		/// <summary>
		/// Message response.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "response")]
		public bool Response { get; set; }

		/// <summary>
		/// Reponse error message.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "error")]
		public string Error { get; set; }
	}

	/// <summary>
	/// Login form account data.
	/// </summary>
    [DataContract]
    class LoginData : ICommandData
    {
		/// <summary>
		/// Login username.
		/// </summary>
        [DataMember]
		[JsonProperty(PropertyName = "username")]
		public string Username { get; set; }

		/// <summary>
		/// Login password.
		/// </summary>
        [DataMember]
		[JsonProperty(PropertyName = "password")]
		public string Password { get; set; }
    }

	/// <summary>
	/// Registration form account data.
	/// </summary>
    [DataContract]
    class RegisterData : ICommandData
    {
		/// <summary>
		/// This field must be unique in the database.
		/// </summary>
        [DataMember]
		[JsonProperty(PropertyName = "username")]
		public string Username { get; set; }

		/// <summary>
		/// TODO: consider to use some encryption algorithm.
		/// </summary>
        [DataMember]
		[JsonProperty(PropertyName = "password")]
		public string Password { get; set; }

		/// <summary>
		/// Registration username. (Not important)
		/// </summary>
        [DataMember]
		[JsonProperty(PropertyName = "email")]
		public string Email { get; set; }

		/// <summary>
		/// User language. (Not important)
		/// </summary>
        [DataMember]
		[JsonProperty(PropertyName = "language")]
		public LanguageInformations Language { get; set; }
    }

	/// <summary>
	/// User chat message.
	/// </summary>
	[DataContract]
	class ChatMessageData : ICommandData
	{
		/// <summary>
		/// User that send the message.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "username")]
		public string Username { get; set; }

		/// <summary>
		/// Message content.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "content")]
		public string Content { get; set; }

		/// <summary>
		/// Message content.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "score")]
		public int? Score { get; set; }

		/// <summary>
		/// Message content.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "server")]
		public bool Server { get; set; }
	}

	/// <summary>
	/// 
	/// </summary>
	[DataContract]
	class RoomsListData : ICommandData
	{
		/// <summary>
		/// Room list.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "rooms")]
		public List<RoomData> Rooms { get; set; }
	}

	[DataContract]
	class JoinData : ICommandData
	{
		/// <summary>
		/// 
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "room")]
		public string Room { get; set;
		}
	}

	/// <summary>
	/// 
	/// </summary>
	[DataContract]
	class RoomData : ICommandData
	{
		/// <summary>
		/// New room name.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "name")]
		public string Name { get; set; }

		/// <summary>
		/// New room password (if no password String.Empty)
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "password")]
		public string Password { get; set; }

		/// <summary>
		/// New room description.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "description")]
		public string Description { get; set; }

		/// <summary>
		/// Endless mode.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "endlessMode")]
		public bool EndlessMode { get; set; }

		/// <summary>
		/// Enable hints mode.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "enableHints")]
		public bool EnableHints { get; set; }

		/// <summary>
		/// Enable away.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "enableAway")]
		public bool EnableAway { get; set; }

		/// <summary>
		/// Maximum number of players for this room.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "maxPlayers")]
		public int MaxPlayers { get; set; }

		/// <summary>
		/// Max number of rounds.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "maxRounds")]
		public int MaxRounds { get; set; }

        /// <summary>
        /// Gets or sets the current round.
        /// </summary>
        [DataMember]
        [JsonProperty(PropertyName = "currentRound")]
        public int CurrentRound { get; set; }

		/// <summary>
		/// dictionary language.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "language")]
		public string Language { get; set; }

		/// <summary>
		/// Gets or sets the users.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "users")]
		public List<RoundUser> Users { get; set; }

		/// <summary>
		/// Gets or sets the users.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "owner")]
		public User Owner { get; set; }
	}

	[DataContract]
	class RoundData : ICommandData
	{
		/// <summary>
		/// 
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "roundNumber")]
		public int Number { get; set; }

		/// <summary>
		/// 
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "drawing")]
		public bool Drawing { get; set; }

		/// <summary>
		/// 
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "secondsLeft")]
		public int SecondsLeft { get; set; }

		/// <summary>
		/// 
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "maxTime")]
		public int MaxTime { get; set; }

		/// <summary>
		/// 
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "currentWord")]
		public string CurrentWord { get; set; }

        /// <summary>
        /// Gets or sets the max rouns.
        /// </summary>
        [DataMember]
        [JsonProperty(PropertyName = "maxRounds")]
        public int MaxRounds { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [DataMember]
        [JsonProperty(PropertyName = "definition")]
        public string Definition { get; set; }

		/// <summary>
		/// 
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "users")]
		public List<RoundUser> Users { get; set; }
		
	}

    [DataContract]
    class RoundUser
    {
        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        [DataMember]
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the score.
        /// </summary>
        [DataMember]
        [JsonProperty(PropertyName = "score")]
        public int Score { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="T:SkethItServer.Users.RoundUser"/> is drawing.
        /// </summary>
        [DataMember]
        [JsonProperty(PropertyName = "drawing")]
        public bool IsDrawing { get; set; }
    }

    [DataContract]
    class GameEndData : ICommandData
    {
        /// <summary>
        /// Gets or sets the users.
        /// </summary>
        [DataMember]
        [JsonProperty(PropertyName = "users")]
        public List<RoundUser> Users { get; set; }

		/// <summary>
		/// Gets or sets the winner.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "winner")]
        public string Winner { get; set; }
    }

	[DataContract]
	class DrawingData : ICommandData
	{
		/// <summary>
		/// Gets or sets the users.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "base64")]
		public string Data { get; set; }
	}


	[DataContract]
	class LanguageInformations
	{
		/// <summary>
		/// Language name.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "name")]
		public string Name { get; set; }

		/// <summary>
		/// Language description.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "description")]
		public string Description { get; set; }

		/// <summary>
		/// Language icon.
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "html")]
		public string Html { get; set; }

		/// <summary>
		/// (Used only in language type array).
		/// </summary>
		[DataMember]
		[JsonProperty(PropertyName = "selected")]
		public bool Selected { get; set; }
	}



	#region Converter

	class CommandDataConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType.IsAssignableFrom(typeof(ICommandData));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            JObject obj = JObject.Load(reader);
            string c = (string)obj["command"];

            Command current = new Command();

			current.Type = (CommandType)serializer.Deserialize(obj["command"].CreateReader(), typeof(CommandType));

            switch (c)
            {
                case "Authentication/Login":
                    current.Data = new LoginData();
                    serializer.Populate(obj["parameters"].CreateReader(), current.Data);
                    break;
                case "Authentication/Register":
                    current.Data = new RegisterData();
                    serializer.Populate(obj["parameters"].CreateReader(), current.Data);
                    break;
				case "Lobby/CreateRoom":
					current.Data = new RoomData();
					serializer.Populate(obj["parameters"].CreateReader(), current.Data);
					break;
				case "Chat/Message":
					current.Data = new ChatMessageData();
					serializer.Populate(obj["parameters"].CreateReader(), current.Data);
					break;
				case "Lobby/JoinRoom":
					current.Data = new JoinData();
					serializer.Populate(obj["parameters"].CreateReader(), current.Data);
					break;
                case "Gameplay/Drawing":
					current.Data = new DrawingData();
					serializer.Populate(obj["parameters"].CreateReader(), current.Data);
                    break;
			}

            return current;
        }

        public override bool CanWrite
        {
            get { return false; }
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
    }

    #endregion

}
