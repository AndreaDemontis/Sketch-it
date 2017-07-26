using System;
using System.Linq;
using System.Data;
using System.Collections.Generic;

using SkethItServer.Users;

namespace SkethItServer.Authentication
{
    public class UserFactory
    {

        #region Sigleton

        static UserFactory instance;

        /// <summary>
        /// Gets the instance.
        /// </summary>
        public static UserFactory Instance
        {
            get
            {
                if (instance == null)
                    instance = new UserFactory();
                return instance;
            }
        }

        #endregion

        /// <summary>
        /// Initializes a new instance of the <see cref="T:SkethItServer.Authentication.UserFactory"/> class.
        /// </summary>
        private UserFactory()
        {
            Users = new DataTable("Users");

            Users.Columns.Add("Username");
            Users.Columns.Add("Password");
            Users.Columns.Add("Email");
        }

        public DataTable Users { get; }

        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <param name="username">Username.</param>
        /// <param name="password">Password.</param>
        /// <param name="email">Email.</param>
        public bool RegisterUser(string username, string password, string email)
        {
			try
			{
				if (Users.Select($"Username LIKE {username}").Length > 0)
					return false;
			}
			catch(Exception )
			{ }

            Users.Rows.Add(username, password, email);

            return true;
        }

		/// <summary>
		/// Login this session with an username and a password.
		/// </summary>
		/// <returns>The login.</returns>
		/// <param name="username">Username.</param>
		/// <param name="password">Password.</param>
		public DataRow Login(string username, string password)
		{
			try
			{
				DataRow[] rows = Users.Select($"Username LIKE '{username}'");

				if (rows.Length > 1)
					throw new Exception("Inconsistent data.");

				DataRow currUser = rows.First();

				if ((String)currUser["Password"] == password)
					return currUser;
			}
			catch (Exception e)
			{
			}

            return null;
		}
    }
}
