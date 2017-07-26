using System;
using System.Collections.Generic;

using SkethItServer.Multiplayer;
using SkethItServer.Network;
using SkethItServer.Users;

namespace SkethItServer
{
    class Server : ServerSocket
    {
        
        /// <summary>
        /// Initializes a new instance of the <see cref="T:SkethItServer.Server"/> class.
        /// </summary>
        /// <param name="port">Port.</param>
        /// <param name="conn">Conn.</param>
        public Server(int port, int conn)
            : base(port, conn)
        {
			OnlineUsers = new List<User>();
			ServerLobby = new Lobby();
		}

		/// <summary>
		/// Connected users.
		/// </summary>
		public List<User> OnlineUsers { get; }

		/// <summary>
		/// Main server lobby.
		/// </summary>
		public Lobby ServerLobby { get; }


		#region Connection management

		protected override void OnUserConnection(object sender, Client client)
        {
            base.OnUserConnection(sender, client);

			User newUser = new User(client);
			OnlineUsers.Add(newUser);

			newUser.UserLogin += UserLogin;
			newUser.Disconnect += UserDisconnection;

            newUser.CurrentLobby = ServerLobby;
        }

		private void UserDisconnection(object sender, EventArgs e)
		{
			
		}

		private void UserLogin(object sender, EventArgs e)
		{
			
		}

		#endregion

	}
}
