using System;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Collections.Generic;

namespace SkethItServer.Network
{
	using NetSocket = System.Net.Sockets.Socket;

	class ServerSocket
	{

		/// <summary>
		/// Makes a new instance of <see cref="Socket"/> class.
		/// </summary>
		public ServerSocket(int port, int queueLength)
		{
			Port = port;
			QueueLength = queueLength;

			waitUser = new ManualResetEvent(false);
		}

		/// <summary>
		/// Current port for binding.
		/// </summary>
		public int Port { get; }

		/// <summary>
		/// Max number of connections.
		/// </summary>
		public int QueueLength { get; }

		/// <summary>
		/// If false at the next connection server will stopped.
		/// </summary>
		public bool CanRun { get; private set; }

		/// <summary>
		/// Host name for this server.
		/// </summary>
        public string HostName => "localhost"; //Dns.GetHostName();

		/// <summary>
		/// Gets the host entry for this network.
		/// </summary>
		public IPHostEntry SelfHostEntry => Dns.GetHostEntry(HostName);

		/// <summary>
		/// Gets the current ip.
		/// </summary>
		public IPAddress CurrentIP => SelfHostEntry.AddressList[0];

		/// <summary>
		/// Called on new user connection to this server.
		/// </summary>
		/// <param name="sender">Object sender.</param>
		/// <param name="client">New client connected.</param>
		protected virtual void OnUserConnection(object sender, Client client)
		{

		}

		#region Binding and user management

		private ManualResetEvent waitUser;

		/// <summary>
		/// Stop server if binded.
		/// </summary>
		public void StopServer()
		{
			CanRun = false;
			waitUser.Set();
		}

		/// <summary>
		/// Set server for listening.
		/// </summary>
		public void Bind()
		{
			// - Sets the local end point
			IPEndPoint localEndPoint = new IPEndPoint(CurrentIP, Port);

			// - Setup the listener
			NetSocket listener = new NetSocket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

			CanRun = true;

			try
			{
				// - Bind the server and start to listen
				listener.Bind(localEndPoint);
				listener.Listen(QueueLength);

				// - Acceptance loop
				while (CanRun)
				{
					// - Reset user lock
					waitUser.Reset();

					// - Waiting for a connection
					listener.BeginAccept(new AsyncCallback(AcceptCallback), listener);

					// - Lock for a new user
					waitUser.WaitOne();
				}
			}
			catch (SocketException e)
			{
				// TODO: Log error
			}

		}

		public void AcceptCallback(IAsyncResult res)
		{
			// - Unlock wait for a new user
			waitUser.Set();

			// - Get the socket that handles the client request.
			NetSocket listener = (NetSocket)res.AsyncState;
			NetSocket handler = listener.EndAccept(res);

			// - Client data
			Client client = new Client(handler);
			OnUserConnection(this, client);
			client.ReceiveProcess();
		}

		#endregion
	}
}
