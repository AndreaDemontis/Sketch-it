using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Runtime.Serialization.Json;

using Newtonsoft.Json;

namespace SkethItServer
{
	class Program
	{
		static void Main(string[] args)
		{

			Server S = new Server(56489, 10);
			S.Bind();

		}
	}
}
