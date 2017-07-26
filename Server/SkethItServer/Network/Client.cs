using System;
using System.Net;
using System.Linq;
using System.Text;
using System.Net.Sockets;
using System.Threading;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace SkethItServer.Network
{
	using NetSocket = System.Net.Sockets.Socket;

    /// <summary>
    /// Message received event handler.
    /// </summary>
    public delegate void MessageReceivedEventHandler(object sender, MessageEventArgs args);

	class Client : IDisposable
	{
		/// <summary>
		/// Makes a new instance of <see cref="Client"/> class.
		/// </summary>
		/// <param name="socket">Client socket.</param>
		public Client(NetSocket socket)
		{
			Socket = socket;
			socket.NoDelay = true;
			buffer = new byte[bufferSize];
			messageWait = new ManualResetEvent(false);
			currentMessage = new List<byte>();
		}

		/// <summary>
		/// Client socket.
		/// </summary>
		public NetSocket Socket { get; }

		/// <summary>
		/// True if this client is connected.
		/// </summary>
		public bool Connected => Socket.Connected;

		/// <summary>
		/// Remove this element from the memory.
		/// </summary>
		public void Dispose()
		{
			CloseConnection();
		}

        #region Events

        /// <summary>
        /// Occurs when a message is received.
        /// </summary>
        public event MessageReceivedEventHandler MessageReceived;

        /// <summary>
        /// Occurs when the client close the connection.
        /// </summary>
        public event EventHandler Disconnected;

		/// <summary>
		/// Called on a message received.
		/// </summary>
		/// <param name="sender">Sender <see cref="Client"/>.</param>
		protected virtual List<byte> OnMessageReceived(object sender)
		{
			List<byte> packet = new List<byte>(currentMessage.Skip(1));

			int consecutive = 0;
			for (int i = 0; i < packet.Count; ++i)
			{
				if (packet[i] == messageTerminator)
					consecutive++;
				else
				{
					if (consecutive > 1)
					{
						packet.RemoveAt(--i);
					}

					consecutive = 0;
				}
			}

			return packet;
		}

		/// <summary>
		/// Called on a message sent.
		/// </summary>
		/// <param name="sender">Object sender.</param>
		/// <param name="message">Clean message.</param>
		/// <returns>Modified message to send.</returns>
		protected virtual List<byte> OnMessageSend(object sender, List<byte> message)
		{
			List<byte> packet = new List<byte>(message);

			byte consecutive = 0;
			for (int i = 0; i < packet.Count; ++i)
			{
				if (packet[i] == messageTerminator || packet[i] == messageStart)
					consecutive = packet[i];
				else
				{
					if (consecutive == messageTerminator)
					{
						packet.Insert(i++, (byte)messageTerminator);
					}

					if (consecutive == messageStart)
					{
						packet.Insert(i++, (byte)messageStart);
					}

					consecutive = 0;
				}
			}

			return packet;
		}

		#endregion

		#region Receive

		/// <summary>
		/// Buffer size.
		/// </summary>
		private int bufferSize => 1024;

		/// <summary>
		/// Message terminator character.
		/// </summary>
		private char messageTerminator => (char)0x0004;

		/// <summary>
		/// Message sterter character.
		/// </summary>
		private char messageStart => (char)0x0003;

		/// <summary>
		/// Receive buffer.
		/// </summary>
		private byte[] buffer { get; set; }

		/// <summary>
		/// Work in progress message.
		/// </summary>
		private List<byte> currentMessage;

		/// <summary>
		/// Reset event for message wait.
		/// </summary>
		private ManualResetEvent messageWait { get; }

		public void ReceiveProcess()
		{
			currentMessage = new List<byte>();

			while (Connected)
			{
				// - Reset message wait
				messageWait.Reset();

				// - Start to receive a message
				Socket.BeginReceive(buffer, 0, bufferSize, 0, new AsyncCallback(ReadCallback), null);

				// - Wait for the next message
				messageWait.WaitOne();
			}

            Disconnected?.Invoke(this, EventArgs.Empty);
		}

		byte consecutive = 0;
		bool newMessage = false;

		private void ReadCallback(IAsyncResult res)
		{
			try
			{
				// - End receive this message
				int receivedBytes = Socket.EndReceive(res);

				if (receivedBytes > 0)
				{
					int i = 0;

                    for (; i < buffer.Length; ++i)
                    {
                        if (buffer[i] == consecutive)
                            consecutive = 1;
                        else if (consecutive != 1 && (buffer[i] == messageTerminator || buffer[i] == messageStart))
                            consecutive = buffer[i];
                        else consecutive = 0;

                        if (consecutive == messageTerminator)
                        {

                            // - Message end
                            MessageReceived?.Invoke(this, new MessageEventArgs(OnMessageReceived(this).ToArray()));
                            currentMessage = new List<byte>();

                            newMessage = false;
                        }

                        if (consecutive == messageStart)
                        {
                            newMessage = true;
                            currentMessage = new List<byte>();
                        }

                        if (newMessage)
                        {
                            // - Append last character to the main message
                            currentMessage.Add(buffer[i]);
                        }

                    }
				}
			}
			catch(SocketException )
			{
				// TODO: Handle error
			}

			// - Unlock the wait for the next message
			messageWait.Set();
		}

		#endregion

		#region Send

		/// <summary>
		/// Send a string to the client.
		/// </summary>
		/// <param name="data">String to send.</param>
		public void Send(string data)
		{
			Send(Encoding.ASCII.GetBytes(data).ToList());
		}

		/// <summary>
		/// Send an array of bytes to the client.
		/// </summary>
		/// <param name="data">Data to send.</param>
		public void Send(List<byte> data)
		{
			data = OnMessageSend(this, data);

			// Add end message
			data.Add((byte)messageTerminator);
			data.Insert(0, (byte)messageStart);

			// Convert the string data to byte data using ASCII encoding.
			byte[] byteData = data.ToArray();

            string g = Encoding.ASCII.GetString(byteData);

			// Begin sending the data to the remote device.
			Socket.BeginSend(byteData, 0, byteData.Length, 0, new AsyncCallback(SendCallback), null);
		}

		private void SendCallback(IAsyncResult res)
		{
			try
			{
				// Complete sending the data to the remote device.
				int bytesSent = Socket.EndSend(res);
			}
			catch (SocketException )
			{
				// TODO: Handle error
			}
		}

		#endregion

		#region Close

		/// <summary>
		/// Close the connection from the server.
		/// </summary>
		public void CloseConnection()
		{
			Socket.Shutdown(SocketShutdown.Both);
			Socket.Close();
		}

		#endregion
	}

    public class MessageEventArgs : EventArgs
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="T:SkethItServer.Network.MessageEventArgs"/> class.
        /// </summary>
        /// <param name="message">Message received.</param>
        public MessageEventArgs(byte[] message)
        {
            Bytes = message;
        }

        /// <summary>
        /// Gets the message in bytes.
        /// </summary>
        public byte[] Bytes { get; }

        /// <summary>
        /// Gets the message in ASCII string.
        /// </summary>
        public string String => Encoding.ASCII.GetString(Bytes);

        /// <summary>
        /// Gets the message in Unicode string.
        /// </summary>
        public string Unicode => Encoding.UTF8.GetString(Bytes);

    }

}
