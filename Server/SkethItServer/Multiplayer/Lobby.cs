using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SkethItServer.Users;

namespace SkethItServer.Multiplayer
{
	class Lobby
	{
		/// <summary>
		/// Makes a new instance of <see cref="Lobby"/> class.
		/// </summary>
		public Lobby()
		{
			Users = new ObservableCollection<User>();
			Rooms = new ObservableCollection<Room>();

			Users.CollectionChanged += UserListChanged;
			Rooms.CollectionChanged += RoomListChanged;

			// - Set default rooms
			Rooms.Add(new Room()
			{
				Name = "English - 1",
				Dictionary = "gb",
				MaxRounds = 20,
				MaxPlayers = 30,
				EnableAway = true,
				EnableHints = true,
				EndlessMode = false,
				Description = "Default room for english players, It will be used only english words."
			});

			Rooms.Add(new Room()
			{
				Name = "English - 2",
				Dictionary = "gb",
				MaxRounds = 20,
				MaxPlayers = 30,
				EnableAway = true,
				EnableHints = true,
				EndlessMode = false,
				Description = "Default room for english players, It will be used only english words."
			});

			Rooms.Add(new Room()
			{
				Name = "English - 3",
				Dictionary = "gb",
				MaxRounds = 20,
				MaxPlayers = 30,
				EnableAway = true,
				EnableHints = true,
				EndlessMode = false,
				Description = "Default room for english players, It will be used only english words."
			});

			Rooms.Add(new Room()
			{
				Name = "Italian - 1",
				Dictionary = "it",
				MaxRounds = 20,
				MaxPlayers = 30,
				EnableAway = true,
				EnableHints = true,
				EndlessMode = false,
				Description = "Stanza standard per i giocatori italiani, verranno scelte solo parole dal dizionario italiano."
			});

			Rooms.Add(new Room()
			{
				Name = "Italian - 2",
				Dictionary = "it",
				MaxRounds = 20,
				MaxPlayers = 30,
				EnableAway = true,
				EnableHints = true,
				EndlessMode = false,
				Description = "Stanza standard per i giocatori italiani, verranno scelte solo parole dal dizionario italiano."
			});

			Rooms.Add(new Room()
			{
				Name = "Italian - 3",
				Dictionary = "it",
				MaxRounds = 20,
				MaxPlayers = 30,
				EnableAway = true,
				EnableHints = true,
				EndlessMode = false,
				Description = "Stanza standard per i giocatori italiani, verranno scelte solo parole dal dizionario italiano."
			});
		}

		/// <summary>
		/// Users connected to the lobby.
		/// </summary>
		public ObservableCollection<User> Users { get; }

		/// <summary>
		/// Open room list.
		/// </summary>
		public ObservableCollection<Room> Rooms { get; }

		#region Rooms management

		private void RoomListChanged(object sender, NotifyCollectionChangedEventArgs e)
		{
			switch (e.Action)
			{
				case NotifyCollectionChangedAction.Add:

					break;

				case NotifyCollectionChangedAction.Remove:

					break;
			}
		} 

		#endregion

		#region Messages dispatching

		private void UserChatMessage(object sender, ChatMessageData e)
		{
			foreach (User u in Users)
			{
				u.SendChatMessage((User)sender, e.Content);
			}
		}

		#endregion

		#region Users management

		private void UserListChanged(object sender, NotifyCollectionChangedEventArgs e)
		{
			switch (e.Action)
			{
				case NotifyCollectionChangedAction.Add:

					foreach (User u in e.NewItems)
					{
						u.ChatMessage += UserChatMessage;

						u.SendChatMessage(null, $"You joined in the server lobby.");

                        foreach (User online in Users.Except(new List<User> { u }))
                        {
                            online.SendChatMessage(null, $"{u.Username} joined in the server lobby.");
                            online.SendRoomList();
                        }
					}

					break;

				case NotifyCollectionChangedAction.Remove:

					foreach (User u in e.OldItems)
					{
                        u.ChatMessage -= UserChatMessage;

                        foreach (User online in Users.Except(new List<User> { u }))
                        {
                            online.SendChatMessage(null, $"{u.Username} left the lobby.");
                            online.SendRoomList();
                        }
					}

					break;
			}
		}

		#endregion
	}
}
