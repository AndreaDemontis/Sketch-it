using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Collections.Concurrent;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SkethItServer.Users;
using SkethItServer.Localization;

namespace SkethItServer.Multiplayer
{
	class Room
	{

		/// <summary>
		/// Makes a new instance of <see cref="Room"/> class.
		/// </summary>
		public Room()
		{
			Users = new ObservableCollection<User>();
            Rounds = new ConcurrentStack<Round>();

            Users.CollectionChanged += UserListChanged;

            TimeLimit = 120;
		}

		/// <summary>
		/// Room's users list.
		/// </summary>
		public ObservableCollection<User> Users { get; }

		/// <summary>
		/// Room rounds.
		/// </summary>
		public ConcurrentStack<Round> Rounds { get; }

		/// <summary>
		/// Current round.
		/// </summary>
		public Round CurrentRound { get; set; }

        /// <summary>
        /// Gets or sets the owner.
        /// </summary>
        public User Owner { get; set; }

        /// <summary>
        /// Gets or sets the time limit.
        /// </summary>
        public int TimeLimit { get; set; }

		/// <summary>
		/// Room's name.
		/// </summary>
		public string Name { get; set; }

		/// <summary>
		/// Room's password (optional).
		/// </summary>
		public string Password { get; set; }

		/// <summary>
		/// Room's description.
		/// </summary>
		public string Description { get; set; }

		/// <summary>
		/// If enabled there's no round limits.
		/// </summary>
		public bool EndlessMode { get; set; }

		/// <summary>
		/// False if hints are not allowed.
		/// </summary>
		public bool EnableHints { get; set; }

		/// <summary>
		/// False if users can't be away.
		/// </summary>
		public bool EnableAway { get; set; }

		/// <summary>
		/// Maximum number of active players.
		/// </summary>
		public int MaxPlayers { get; set; }

		/// <summary>
		/// Rounds limit.
		/// </summary>
		public int MaxRounds { get; set; }

		/// <summary>
		/// Dictionary language.
		/// </summary>
		public string Dictionary { get; set; }

        #region Rounds management

        /// <summary>
        /// News the round.
        /// </summary>
        public void NewRound()
        {
            if (CurrentRound != null)
                CurrentRound.RoundFinish -= CurrentRound_RoundFinish;
            User newDrawer = Users[(Rounds.Count() > 0 ? (Users.IndexOf(CurrentRound.Drawer) + 1) % Users.Count : 0)];
            Rounds.Push(new Round(Users, newDrawer, new TimeSpan(0, 2, 0), "Incensiere", Rounds.Count() + 1));
            CurrentRound = Rounds.First();
            CurrentRound.RoundFinish += CurrentRound_RoundFinish;
            CurrentRound.Start();
        }

        void CurrentRound_RoundFinish(object sender, EventArgs e)
        {
			foreach (User u in Users)
			{
                
                var users = CurrentRound.Scores.Where(x => x.Value > 0).Select(x => x.Key.Username);
                string scores = "";

                if (users.Count() <= 0)
                {
                    u.SendChatMessage(null, "Nobody hit the word.");
                    continue;
                }

                foreach(var us in users)
                {
                    scores += us + ",";
                }
                scores = scores.Substring(0, scores.Length - 1);

                u.SendChatMessage(null, "Round finish: " + scores + " hit the word.");
			}

            if (Rounds.Count() < MaxRounds)
                NewRound();
            else
                GameEnd();

            foreach(User u in Users)
				SendRoundData(u);
        }

        private void GameEnd()
        {
            var users = Rounds.SelectMany(x => x.Scores.Keys).ToList();
            var scores = users.Select(u => new KeyValuePair<User, int>(u, Rounds.Where(x => x.Scores.ContainsKey(u)).Sum(x => x.Scores[u])));
            GameEndData data = new GameEndData
            {
                Winner = scores.OrderBy(y => y.Value).LastOrDefault().Key.Username
            };


			foreach (User u in Users)
			{
                u.SendChatMessage(null, "Game end! The winner is: " + data.Winner);
                u.SendResponse(CommandType.GameEnd, data);
			}
        }

        #endregion

        #region Drawing

        public void SendDraw(string data)
        {
            if (CurrentRound == null)
                return;

            DrawingData message = new DrawingData
            {
                Data = data
            };


            foreach (User u in Users)
                if (CurrentRound.Drawer != u)
                    u.SendResponse(CommandType.Drawing, message);
        }

        #endregion

        #region Messages dispatching

        private void UserChatMessage(object sender, ChatMessageData e)
		{

			var hitTest = CurrentRound?.ProcessWord(e.Content) ?? WordHitLevel.Miss;

			switch (hitTest)
			{
				case WordHitLevel.Exact:
                    
                    User s = sender as User;

                    if (s == CurrentRound.Drawer)
                    {
                        s.SendChatMessage(null, "You are not allowed to write the word!", null, true);
                        return;
                    }


                    if (CurrentRound.Scores[s] <= 0)
                    {
                        bool first = !CurrentRound.Scores.Any(x => x.Value > 0);
                        var min = 0;
                        if (!first)
                            min = CurrentRound.Scores.Where(x => x.Value > 0).Min(x => x.Value) - 1;

                        CurrentRound.Scores[s] = first ? 20 : Math.Max(min, 10);

                        if (first)
                        {
                            CurrentRound.ShortTimer();
                        }


                        if (CurrentRound.WordHitTime == null)
                            CurrentRound.WordHitTime = DateTime.Now;

						s.SendChatMessage(s, e.Content, CurrentRound.Scores[s], false);
						s.SendChatMessage(null, "You found the word!", null, true);
                    }

                    if (!CurrentRound.Scores.Where(x => x.Key != CurrentRound.Drawer).Any(x => x.Value <= 0))
                    {
                        CurrentRound.RoundEnd();
                    }

                    foreach(User u in Users)
						SendRoundData(u);

					break;
				case WordHitLevel.Miss:

					foreach (User u in Users)
					{
                        u.SendChatMessage((User)sender, e.Content);
					}
					break;
			}

			
		}

		#endregion

		#region Users management

		private void UserListChanged(object sender, NotifyCollectionChangedEventArgs e)
		{
			switch (e.Action)
			{
				case NotifyCollectionChangedAction.Add:

                    if (Users.Count() - e.NewItems.Count == 1)
                        NewRound();

					foreach (User u in e.NewItems)
					{
						u.ChatMessage += UserChatMessage;

						u.SendChatMessage(null, $"You joined in the server lobby.");

						foreach (User online in Users.Except(new List<User> { u }))
							online.SendChatMessage(null, $"{u.Username} joined in the server lobby.");
					}

                    foreach(User u in Users)
                        SendRoundData(u);

					break;

				case NotifyCollectionChangedAction.Remove:

					foreach (User u in e.OldItems)
					{
                        u.ChatMessage -= UserChatMessage;

						foreach (User online in Users.Except(new List<User> { u }))
							online.SendChatMessage(null, $"{u.Username} left the lobby.");
					}

					break;
			}
		}

        public void SendRoundData(User u)
        {
            RoundData data = new RoundData
            {
                Number = Rounds.Count(),
                Drawing = CurrentRound?.Drawer == u,
                SecondsLeft = ((CurrentRound?.WordHitTime != null ? 30 : 120) - ((DateTime.Now - ((CurrentRound?.WordHitTime != null ? CurrentRound?.WordHitTime : CurrentRound?.StartTime) ?? DateTime.Now)).Seconds)),
                MaxTime = TimeLimit,
                CurrentWord = (CurrentRound?.Drawer == u ? CurrentRound?.Word : new String('_', CurrentRound?.Word.Length ?? 0)) ?? "",
                Definition = CurrentRound?.Drawer == u ? "Definizione della parola" : "",
                MaxRounds = MaxRounds,
                Users = Users.Select(x => new RoundUser
                {
                    Name = x.Username,
                    Score = Rounds.Sum(r => r.Scores.ContainsKey(x) ? r.Scores[x] : 0),
                    IsDrawing = CurrentRound?.Drawer == x
                }).ToList()
            };

            u.SendResponse(CommandType.RoundInfo, data);
        }

		#endregion

	}
}
