using System;
using System.Timers;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SkethItServer.Users;

namespace SkethItServer.Multiplayer
{
    enum WordHitLevel
    {
        Exact,
        Close,
        Miss
    }

    enum RoundState
    {
        Running,
        Close,
        Pause
    }

	class Round
	{
		/// <summary>
		/// Creates a new instance of <see cref="Round"/> class.
		/// </summary>
		public Round(IEnumerable<User> users, User drawer, TimeSpan timeLimit, string word, int number)
		{
			Scores = new Dictionary<User, int>();

			Word = word;
            Number = number;
            Drawer = drawer;

			foreach (User u in users)
				Scores.Add(u, 0);
            
            Clock = new Timer();
            Clock.Interval = (timeLimit.Seconds + timeLimit.Minutes * 60 + timeLimit.Hours * 60 * 60) * 1000;
            Clock.Elapsed += Clock_Elapsed;

            StartTime = DateTime.Now;
		}
		
		/// <summary>
		/// 
		/// </summary>
		public Dictionary<User, int> Scores { get; }

        public DateTime? WordHitTime { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public User Drawer { get; }

		/// <summary>
		/// 
		/// </summary>
		public Draw Drawing { get; }

        /// <summary>
        /// Gets or sets the start time.
        /// </summary>
        public DateTime StartTime { get; set; }

		/// <summary>
		/// Round word.
		/// </summary>
		public string Word { get; }

        /// <summary>
        /// Gets the round number.
        /// </summary>
        public int Number { get; }

        /// <summary>
        /// Gets the round clock.
        /// </summary>
        public Timer Clock { get; }

        /// <summary>
        /// Gets the round state.
        /// </summary>
        public RoundState State { get; private set; }

        /// <summary>
        /// Occurs when round ends.
        /// </summary>
        public event EventHandler RoundFinish;

        public void RoundEnd()
        {
			Clock.Close();
            State = RoundState.Close;
            RoundFinish?.Invoke(this, EventArgs.Empty);
        }

        public void ShortTimer()
        {
            Clock.Stop();
            Clock.Interval = 30 * 1000;
            Clock.Start();
        }

        void Clock_Elapsed(object sender, ElapsedEventArgs e)
        {
            RoundEnd();
        }

        /// <summary>
        /// Start this round.
        /// </summary>
        public void Start()
        {
            Clock.Start();
            State = RoundState.Running;
        }

        /// <summary>
        /// Pause this round.
        /// </summary>
        public void Pause()
        {
            switch (State)
            {
                case RoundState.Pause:
                    Clock.Start();
                    State = RoundState.Running;
                    break;
                case RoundState.Running:
                    Clock.Stop();
                    State = RoundState.Pause;
                    break;
            }
        }

        /// <summary>
        /// Processes the chat word.
        /// </summary>
        /// <returns>If word is found or is close to the real word.</returns>
        /// <param name="text">User text.</param>
        public WordHitLevel ProcessWord(string text)
        {
            if (text.Contains(Word))
            {
                return WordHitLevel.Exact;
            }

            return WordHitLevel.Miss;
        }

	}
}
